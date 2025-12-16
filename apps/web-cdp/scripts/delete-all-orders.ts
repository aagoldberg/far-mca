import 'dotenv/config';

/**
 * Delete all orders from a Shopify store
 *
 * Usage:
 *   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx SHOP_DOMAIN=store.myshopify.com npx tsx scripts/delete-all-orders.ts
 *
 * Options:
 *   --confirm     Required flag to actually delete (safety measure)
 */

const args = process.argv.slice(2);
const hasFlag = (name: string): boolean => args.includes(`--${name}`);

const SHOP_DOMAIN = process.env.SHOP_DOMAIN || 'lendfriend-dev.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2024-10';
const BASE_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}`;

const confirmed = hasFlag('confirm');

if (!ACCESS_TOKEN) {
  console.error('Error: SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is not set.');
  process.exit(1);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface Order {
  id: number;
  name: string;
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

    // DELETE returns empty body
    if (method === 'DELETE') {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

async function deleteAllOrders() {
  console.log('\n' + '='.repeat(60));
  console.log(`🏪 Store: ${SHOP_DOMAIN}`);
  console.log(`🗑️  Action: DELETE ALL ORDERS`);
  console.log('='.repeat(60));

  if (!confirmed) {
    console.log('\n⚠️  DRY RUN - No orders will be deleted');
    console.log('   Add --confirm flag to actually delete orders\n');
  }

  // Fetch and delete in batches
  let totalDeleted = 0;
  let page = 1;

  while (true) {
    // Fetch batch of orders
    const result = await apiCall<{ orders: Order[] }>(`/orders.json?status=any&limit=250`);

    if (!result?.orders || result.orders.length === 0) {
      break;
    }

    console.log(`\nPage ${page}: Found ${result.orders.length} orders`);

    if (!confirmed) {
      console.log('   Would delete these orders (--confirm to proceed)');
      totalDeleted += result.orders.length;
      page++;
      // In dry run, break after first page to avoid infinite loop
      if (page > 3) {
        console.log('   ... (showing first 3 pages only in dry run)');
        break;
      }
      continue;
    }

    // Delete each order
    for (let i = 0; i < result.orders.length; i++) {
      const order = result.orders[i];
      process.stdout.write(`\r   Deleting ${i + 1}/${result.orders.length} (${order.name})...`);

      await apiCall(`/orders/${order.id}.json`, 'DELETE');
      totalDeleted++;

      await sleep(350); // Rate limiting
    }

    console.log(`\n   ✓ Deleted ${result.orders.length} orders`);
    page++;

    // Small delay between pages
    await sleep(500);
  }

  console.log('\n' + '='.repeat(60));
  if (confirmed) {
    console.log(`✅ DELETED ${totalDeleted} orders from ${SHOP_DOMAIN}`);
  } else {
    console.log(`📊 Would delete ${totalDeleted}+ orders from ${SHOP_DOMAIN}`);
    console.log('   Run with --confirm to actually delete');
  }
  console.log('='.repeat(60) + '\n');
}

deleteAllOrders().catch(console.error);
