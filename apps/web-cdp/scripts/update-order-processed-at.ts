import 'dotenv/config';

/**
 * Update processed_at dates on existing Shopify orders
 *
 * This script fetches all orders from a Shopify store and updates their
 * processed_at dates to simulate historical order data for Business Health Score testing.
 *
 * Note: Shopify's API may or may not allow updating processed_at on existing orders.
 * This script will attempt it and report the results.
 *
 * If direct API update doesn't work, you'll need to use Matrixify app to import orders
 * with historical processed_at dates.
 *
 * Usage:
 *   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx SHOP_DOMAIN=store.myshopify.com npx tsx scripts/update-order-processed-at.ts
 *
 * Options:
 *   --tenure-months=N   Number of months to spread orders across (default: 12)
 *   --dry-run           Show what would be updated without making changes
 */

const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : undefined;
};
const hasFlag = (name: string): boolean => args.includes(`--${name}`);

const SHOP_DOMAIN = process.env.SHOP_DOMAIN || 'lendfriend-dev.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2024-10';
const BASE_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}`;

const tenureMonths = parseInt(getArg('tenure-months') || '12', 10);
const dryRun = hasFlag('dry-run');

if (!ACCESS_TOKEN) {
  console.error('Error: SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is not set.');
  console.error('\nUsage:');
  console.error('  SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx SHOP_DOMAIN=store.myshopify.com npx tsx scripts/update-order-processed-at.ts');
  process.exit(1);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface Order {
  id: number;
  name: string;
  created_at: string;
  processed_at: string;
  total_price: string;
}

async function apiCall<T = any>(endpoint: string, method: string = 'GET', body?: object): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN!
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('Rate limited. Waiting 2 seconds...');
        await sleep(2000);
        return apiCall(endpoint, method, body);
      }
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

async function fetchAllOrders(): Promise<Order[]> {
  console.log('\n📦 Fetching all orders...');

  const orders: Order[] = [];
  let pageInfo: string | null = null;
  let page = 1;

  while (true) {
    const endpoint = pageInfo
      ? `/orders.json?status=any&limit=250&page_info=${pageInfo}`
      : `/orders.json?status=any&limit=250`;

    const result = await apiCall<{ orders: Order[] }>(endpoint);

    if (!result?.orders) break;

    orders.push(...result.orders);
    console.log(`   Page ${page}: fetched ${result.orders.length} orders (total: ${orders.length})`);

    if (result.orders.length < 250) break;

    // Get next page from Link header (simplified - may need adjustment)
    page++;
    await sleep(300);
  }

  return orders;
}

async function updateOrderProcessedAt(orderId: number, processedAt: string): Promise<boolean> {
  const result = await apiCall(`/orders/${orderId}.json`, 'PUT', {
    order: {
      id: orderId,
      processed_at: processedAt
    }
  });

  return result !== null;
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log(`🏪 Store: ${SHOP_DOMAIN}`);
  console.log(`📅 Target tenure: ${tenureMonths} months`);
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log('='.repeat(60));

  // Fetch all orders
  const orders = await fetchAllOrders();

  if (orders.length === 0) {
    console.log('\n❌ No orders found in store.');
    return;
  }

  console.log(`\n📊 Found ${orders.length} orders`);

  // Sort orders by ID (roughly creation order)
  orders.sort((a, b) => a.id - b.id);

  // Calculate date range
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - tenureMonths);

  const totalDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  console.log(`\n📅 Spreading ${orders.length} orders over ${totalDays} days`);
  console.log(`   From: ${startDate.toISOString().split('T')[0]}`);
  console.log(`   To:   ${now.toISOString().split('T')[0]}`);

  // Calculate new dates for each order
  const updates: Array<{ order: Order; newDate: string }> = [];

  for (let i = 0; i < orders.length; i++) {
    // Distribute orders evenly across the time period
    const dayOffset = Math.floor((i / (orders.length - 1 || 1)) * totalDays);
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + dayOffset);

    // Add some randomness (±2 days)
    newDate.setDate(newDate.getDate() + Math.floor(Math.random() * 5) - 2);

    // Don't go past today
    if (newDate > now) {
      newDate.setTime(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    }

    updates.push({
      order: orders[i],
      newDate: newDate.toISOString()
    });
  }

  console.log('\n📝 Sample updates (first 5 orders):');
  for (let i = 0; i < Math.min(5, updates.length); i++) {
    const u = updates[i];
    console.log(`   ${u.order.name}: ${u.order.processed_at?.split('T')[0] || 'N/A'} → ${u.newDate.split('T')[0]}`);
  }

  if (dryRun) {
    console.log('\n⚠️  DRY RUN - No changes made');
    console.log('   Run without --dry-run to apply changes');
    return;
  }

  // Attempt to update orders
  console.log('\n🔄 Updating orders...\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < updates.length; i++) {
    const { order, newDate } = updates[i];
    process.stdout.write(`\rUpdating order ${i + 1}/${updates.length} (${order.name})...`);

    const success = await updateOrderProcessedAt(order.id, newDate);

    if (success) {
      successCount++;
    } else {
      failCount++;
      if (failCount === 1) {
        console.log('\n\n⚠️  First update failed. Shopify may not allow updating processed_at via API.');
        console.log('   Trying a few more to confirm...');
      }
      if (failCount >= 3) {
        console.log('\n\n❌ Multiple failures. Shopify does not allow updating processed_at via API.');
        console.log('\n💡 Alternative: Use Matrixify app to import orders with historical dates:');
        console.log('   1. Export orders from Shopify');
        console.log('   2. Edit the CSV to set Processed At column to desired dates');
        console.log('   3. Import back using Matrixify (it can update existing orders)');
        console.log('   See: https://apps.shopify.com/excel-export-import');
        return;
      }
    }

    await sleep(350); // Rate limiting
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('✅ UPDATE COMPLETE');
  console.log('='.repeat(60));
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed:  ${failCount}`);
  console.log('='.repeat(60));

  if (successCount > 0 && failCount === 0) {
    console.log('\n🎉 All orders updated! Refresh your store data to see new Business Health Score.');
  }
}

main().catch(console.error);
