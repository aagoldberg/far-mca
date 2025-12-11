import 'dotenv/config';
import { randomBytes } from 'crypto';

/**
 * Configurable Shopify Order Seeder
 *
 * Usage:
 *   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx SHOP_DOMAIN=store.myshopify.com npx tsx scripts/seed-shopify-configurable.ts --profile=<profile>
 *
 * Score Profiles:
 *   --profile=new        ~45 score (Developing) - 3 months, steady
 *   --profile=volatile   ~55 score (Moderate)   - 12 months, inconsistent
 *   --profile=strong     ~85 score (Strong)     - 25 months, consistent, growth
 *   --profile=star       ~95 score (Excellent)  - 36 months, high volume, very consistent
 *
 * Variable Testing Profiles (isolate each variable):
 *   --profile=tenure-high       36 months, medium everything else
 *   --profile=tenure-low        3 months, medium everything else
 *   --profile=consistency-high  12 months, very consistent orders
 *   --profile=consistency-low   12 months, erratic orders
 *   --profile=growth-high       12 months, strong positive growth
 *   --profile=growth-low        12 months, declining revenue
 *   --profile=volume-high       12 months, high order frequency
 *   --profile=volume-low        12 months, sparse orders
 *
 * Options:
 *   --skip-products      Skip product creation (if already exists)
 */

const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : undefined;
};
const hasFlag = (name: string): boolean => args.includes(`--${name}`);

interface ProfileConfig {
  tenureMonths: number;
  orderFrequency: number;
  frequencyVariance: number;
  basePrice: number;
  priceVariance: number;
  growthRate: number;
  description: string;
}

// Product sets for different store types
const PRODUCT_SETS: Record<string, Array<{ title: string; price: number; description: string }>> = {
  artisan: [
    { title: 'Handcrafted Ceramic Mug', price: 28, description: 'Hand-thrown ceramic mug, glazed in ocean blue' },
    { title: 'Woven Market Basket', price: 45, description: 'Traditional woven basket, perfect for farmers market trips' },
    { title: 'Beeswax Candle Set', price: 32, description: 'Set of 3 hand-poured beeswax candles' },
    { title: 'Leather Journal', price: 55, description: 'Full-grain leather journal with handmade paper' },
    { title: 'Wooden Cutting Board', price: 68, description: 'Live edge walnut cutting board, food safe finish' },
  ],
  bakery: [
    { title: 'Sourdough Bread Loaf', price: 12, description: 'Fresh-baked sourdough with 48-hour fermentation' },
    { title: 'Pastry Box (6 pieces)', price: 24, description: 'Assorted croissants and danishes' },
    { title: 'Birthday Cake', price: 85, description: 'Custom decorated 8-inch layer cake' },
    { title: 'Cookie Dozen', price: 18, description: '12 freshly baked cookies, mix and match flavors' },
    { title: 'Weekly Bread Subscription', price: 45, description: '4 loaves delivered weekly' },
  ],
  vintage: [
    { title: 'Mid-Century Lamp', price: 125, description: 'Restored 1960s table lamp with new wiring' },
    { title: 'Vintage Denim Jacket', price: 78, description: 'Classic 80s denim, excellent condition' },
    { title: 'Antique Picture Frame', price: 45, description: 'Ornate gilded frame, circa 1920' },
    { title: 'Retro Record Player', price: 195, description: 'Fully serviced vintage turntable' },
    { title: 'Vintage Kitchenware Set', price: 55, description: 'Pyrex mixing bowls, complete set' },
  ],
  wellness: [
    { title: 'Essential Oil Blend', price: 22, description: 'Calming lavender and chamomile blend' },
    { title: 'Herbal Tea Collection', price: 35, description: '5 organic loose leaf teas in reusable tins' },
    { title: 'Yoga Mat (Cork)', price: 89, description: 'Sustainable cork yoga mat with natural rubber base' },
    { title: 'Meditation Cushion', price: 65, description: 'Buckwheat-filled zafu cushion' },
    { title: 'Self-Care Gift Box', price: 95, description: 'Curated wellness items: bath salts, oils, and tea' },
  ],
};

// Score-based profiles (for demos)
const SCORE_PROFILES: Record<string, ProfileConfig> = {
  new: {
    tenureMonths: 3,
    orderFrequency: 0.4,
    frequencyVariance: 0.1,
    basePrice: 80,
    priceVariance: 0.15,
    growthRate: 1.0,
    description: '~45 score (Developing) - New business, short history',
  },
  volatile: {
    tenureMonths: 12,
    orderFrequency: 0.35,
    frequencyVariance: 0.6,
    basePrice: 90,
    priceVariance: 0.4,
    growthRate: 0.99,
    description: '~55 score (Moderate) - Inconsistent patterns',
  },
  strong: {
    tenureMonths: 25,
    orderFrequency: 0.5,
    frequencyVariance: 0.15,
    basePrice: 100,
    priceVariance: 0.15,
    growthRate: 1.015,
    description: '~85 score (Strong) - Established, growing',
  },
  star: {
    tenureMonths: 36,
    orderFrequency: 0.7,
    frequencyVariance: 0.08,
    basePrice: 150,
    priceVariance: 0.1,
    growthRate: 1.02,
    description: '~95 score (Excellent) - Top performer',
  },
};

// Variable-testing profiles (isolate each factor)
const VARIABLE_PROFILES: Record<string, ProfileConfig> = {
  'tenure-high': {
    tenureMonths: 36,
    orderFrequency: 0.4,
    frequencyVariance: 0.2,
    basePrice: 75,
    priceVariance: 0.15,
    growthRate: 1.0,
    description: 'TENURE TEST: 36 months (high), other factors medium',
  },
  'tenure-low': {
    tenureMonths: 3,
    orderFrequency: 0.4,
    frequencyVariance: 0.2,
    basePrice: 75,
    priceVariance: 0.15,
    growthRate: 1.0,
    description: 'TENURE TEST: 3 months (low), other factors medium',
  },
  'consistency-high': {
    tenureMonths: 12,
    orderFrequency: 0.5,
    frequencyVariance: 0.05,  // Very consistent
    basePrice: 75,
    priceVariance: 0.08,      // Consistent prices too
    growthRate: 1.0,
    description: 'CONSISTENCY TEST: Very regular orders (high), other factors medium',
  },
  'consistency-low': {
    tenureMonths: 12,
    orderFrequency: 0.4,
    frequencyVariance: 0.7,   // Very erratic
    basePrice: 75,
    priceVariance: 0.5,       // Erratic prices too
    growthRate: 1.0,
    description: 'CONSISTENCY TEST: Erratic orders (low), other factors medium',
  },
  'growth-high': {
    tenureMonths: 12,
    orderFrequency: 0.4,
    frequencyVariance: 0.2,
    basePrice: 50,            // Starts low
    priceVariance: 0.15,
    growthRate: 1.03,         // 3% monthly = ~43% annual
    description: 'GROWTH TEST: Strong positive growth (high), other factors medium',
  },
  'growth-low': {
    tenureMonths: 12,
    orderFrequency: 0.4,
    frequencyVariance: 0.2,
    basePrice: 100,           // Starts higher
    priceVariance: 0.15,
    growthRate: 0.97,         // -3% monthly = declining
    description: 'GROWTH TEST: Declining revenue (low), other factors medium',
  },
  'volume-high': {
    tenureMonths: 12,
    orderFrequency: 0.75,     // Very frequent orders
    frequencyVariance: 0.15,
    basePrice: 100,           // Higher ticket items
    priceVariance: 0.15,
    growthRate: 1.0,
    description: 'VOLUME TEST: High order frequency & revenue (high), other factors medium',
  },
  'volume-low': {
    tenureMonths: 12,
    orderFrequency: 0.15,     // Sparse orders
    frequencyVariance: 0.2,
    basePrice: 50,            // Lower ticket
    priceVariance: 0.15,
    growthRate: 1.0,
    description: 'VOLUME TEST: Low order frequency & revenue (low), other factors medium',
  },
};

const ALL_PROFILES = { ...SCORE_PROFILES, ...VARIABLE_PROFILES };

// Configuration
const SHOP_DOMAIN = process.env.SHOP_DOMAIN || 'lendfriend-dev.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('Error: SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is not set.');
  console.error('\nUsage:');
  console.error('  SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx SHOP_DOMAIN=store.myshopify.com npx tsx scripts/seed-shopify-configurable.ts --profile=<profile>');
  console.error('\nProfiles:', Object.keys(ALL_PROFILES).join(', '));
  process.exit(1);
}

const profileName = getArg('profile') || 'strong';
const config = ALL_PROFILES[profileName];

if (!config) {
  console.error(`Unknown profile: ${profileName}`);
  console.error('Available profiles:', Object.keys(ALL_PROFILES).join(', '));
  process.exit(1);
}

const skipProducts = hasFlag('skip-products');

const API_VERSION = '2024-10';
const BASE_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}`;

interface OrderPayload {
  order: {
    created_at: string;
    processed_at: string;
    financial_status: string;
    total_price: string;
    currency: string;
    line_items: Array<{
      title: string;
      price: string;
      quantity: number;
    }>;
    customer?: {
      first_name: string;
      last_name: string;
      email: string;
    };
    test: boolean;
  };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function apiCall(endpoint: string, method: string, body?: object) {
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
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

async function createProducts(): Promise<string[]> {
  console.log('\n📦 Creating products...');

  // Pick a random product set
  const productSetKeys = Object.keys(PRODUCT_SETS);
  const productSetKey = productSetKeys[Math.floor(Math.random() * productSetKeys.length)];
  const products = PRODUCT_SETS[productSetKey];

  console.log(`   Using "${productSetKey}" product set`);

  const createdProducts: string[] = [];

  for (const product of products) {
    const result = await apiCall('/products.json', 'POST', {
      product: {
        title: product.title,
        body_html: `<p>${product.description}</p>`,
        vendor: 'Local Artisan',
        product_type: productSetKey,
        variants: [
          {
            price: product.price.toString(),
            inventory_management: null,
          }
        ],
        status: 'active'
      }
    });

    if (result?.product) {
      createdProducts.push(product.title);
      console.log(`   ✓ Created: ${product.title}`);
    }

    await sleep(300);
  }

  return createdProducts;
}

async function generateAndSeed() {
  console.log('\n' + '='.repeat(60));
  console.log(`🏪 Store: ${SHOP_DOMAIN}`);
  console.log(`📊 Profile: ${profileName}`);
  console.log(`📝 ${config.description}`);
  console.log('='.repeat(60));
  console.log(`📅 Tenure: ${config.tenureMonths} months`);
  console.log(`📈 Growth Rate: ${((config.growthRate - 1) * 100).toFixed(1)}% monthly`);
  console.log(`🎯 Order Frequency: ${(config.orderFrequency * 100).toFixed(0)}% daily chance`);
  console.log(`📊 Consistency: ${config.frequencyVariance < 0.15 ? 'High' : config.frequencyVariance < 0.4 ? 'Medium' : 'Low'}`);

  // Create products first
  let productNames: string[] = ['Community Product'];
  if (!skipProducts) {
    const created = await createProducts();
    if (created.length > 0) {
      productNames = created;
    }
  } else {
    console.log('\n📦 Skipping product creation (--skip-products)');
  }

  console.log('\n📝 Creating orders...\n');

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - config.tenureMonths);

  let currentDate = new Date(startDate);
  let orderCount = 0;
  let totalRevenue = 0;

  let monthlyOrders: number[] = [];
  let currentMonth = currentDate.getMonth();
  let ordersThisMonth = 0;

  while (currentDate <= endDate) {
    if (currentDate.getMonth() !== currentMonth) {
      monthlyOrders.push(ordersThisMonth);
      currentMonth = currentDate.getMonth();
      ordersThisMonth = 0;
    }

    const monthsElapsed = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    const frequencyModifier = 1 + (Math.random() - 0.5) * 2 * config.frequencyVariance;
    const effectiveFrequency = Math.max(0.05, Math.min(0.95, config.orderFrequency * frequencyModifier));

    if (Math.random() < effectiveFrequency) {
      const growthMultiplier = Math.pow(config.growthRate, monthsElapsed);
      const baseWithGrowth = config.basePrice * growthMultiplier;
      const variance = 1 + (Math.random() - 0.5) * 2 * config.priceVariance;
      const finalPrice = (baseWithGrowth * variance).toFixed(2);

      // Pick a random product
      const productTitle = productNames[Math.floor(Math.random() * productNames.length)];
      const orderDateIso = currentDate.toISOString();

      const payload: OrderPayload = {
        order: {
          created_at: orderDateIso,
          processed_at: orderDateIso,
          financial_status: 'paid',
          total_price: finalPrice,
          currency: 'USD',
          test: true,
          line_items: [
            {
              title: productTitle,
              price: finalPrice,
              quantity: 1
            }
          ],
          customer: {
            first_name: 'Test',
            last_name: 'Customer',
            email: `test-${randomBytes(4).toString('hex')}@example.com`
          }
        }
      };

      process.stdout.write(`\rCreating Order #${orderCount + 1} for ${currentDate.toISOString().split('T')[0]}...`);
      await apiCall('/orders.json', 'POST', payload);
      orderCount++;
      ordersThisMonth++;
      totalRevenue += parseFloat(finalPrice);

      await sleep(550);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  monthlyOrders.push(ordersThisMonth);

  const avgMonthlyOrders = monthlyOrders.reduce((a, b) => a + b, 0) / monthlyOrders.length;
  const orderStdDev = Math.sqrt(
    monthlyOrders.reduce((sum, val) => sum + Math.pow(val - avgMonthlyOrders, 2), 0) / monthlyOrders.length
  );
  const cv = avgMonthlyOrders > 0 ? (orderStdDev / avgMonthlyOrders * 100).toFixed(1) : '0';

  console.log('\n\n' + '='.repeat(60));
  console.log('✅ SEED COMPLETE');
  console.log('='.repeat(60));
  console.log(`📦 Total Orders: ${orderCount}`);
  console.log(`💰 Total Revenue: $${totalRevenue.toFixed(2)}`);
  console.log(`📊 Avg Orders/Month: ${avgMonthlyOrders.toFixed(1)}`);
  console.log(`📈 Coefficient of Variation: ${cv}%`);
  console.log(`🏪 Store: ${SHOP_DOMAIN}`);
  console.log(`📝 Profile: ${profileName} - ${config.description}`);
  console.log('='.repeat(60) + '\n');
}

// Show help if no arguments
if (args.length === 0 || args.includes('--help')) {
  console.log(`
Shopify Store Seeder - Create test orders with different business profiles

USAGE:
  SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx SHOP_DOMAIN=store.myshopify.com \\
    npx tsx scripts/seed-shopify-configurable.ts --profile=<profile>

SCORE PROFILES (for demos):
  new        ~45 score - 3 months, new business
  volatile   ~55 score - 12 months, inconsistent
  strong     ~85 score - 25 months, growing
  star       ~95 score - 36 months, excellent

VARIABLE TEST PROFILES (isolate each factor):
  tenure-high       36 months tenure (other factors medium)
  tenure-low        3 months tenure (other factors medium)
  consistency-high  Very consistent orders (other factors medium)
  consistency-low   Erratic orders (other factors medium)
  growth-high       Strong positive growth (other factors medium)
  growth-low        Declining revenue (other factors medium)
  volume-high       High order frequency (other factors medium)
  volume-low        Low order frequency (other factors medium)

OPTIONS:
  --skip-products   Skip creating products (use if already exist)
  --help            Show this help

EXAMPLE:
  SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx SHOP_DOMAIN=lendfriend-new.myshopify.com \\
    npx tsx scripts/seed-shopify-configurable.ts --profile=tenure-low
`);
  process.exit(0);
}

generateAndSeed();
