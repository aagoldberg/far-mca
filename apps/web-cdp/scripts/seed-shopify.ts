import 'dotenv/config';
import { randomBytes } from 'crypto';

// Configuration
const SHOP_DOMAIN = 'lendfriend-dev.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Score Targets for "Good" (Tier B/Strong ~85)
// 1. Tenure: > 2 years (start date ~25 months ago)
// 2. Consistency: Regular orders (CV < 35%)
// 3. Growth: Positive trend (~10-30% growth recently)
// 4. Revenue: Stable flow

if (!ACCESS_TOKEN) {
  console.error('Error: SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is not set.');
  process.exit(1);
}

const API_VERSION = '2024-10';
const BASE_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}`;

interface OrderPayload {
  order: {
    created_at: string;
    processed_at: string;
    financial_status: string;
    total_price: string;
    currency: string;
    line_items: Array < {
      title: string;
      price: string;
      quantity: number;
    } > ;
    customer ? : {
      first_name: string;
      last_name: string;
      email: string;
    };
    test: boolean;
  };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function createOrder(orderData: OrderPayload) {
  try {
    const response = await fetch(`${BASE_URL}/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN!
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Handle rate limiting
      if (response.status === 429) {
        console.log('Rate limited. Waiting 2 seconds...');
        await sleep(2000);
        return createOrder(orderData); // Retry
      }
      throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

async function generateAndSeed() {
  console.log(`Starting seed for ${SHOP_DOMAIN}...`);
  console.log('Generating orders for ~85 Business Health Score...');

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 25); // 25 months history for "Strong" tenure

  let currentDate = new Date(startDate);
  let orderCount = 0;
  
  // Growth Trend:
  // Phase 1 (Months 0-12): Base revenue ~ $100/order
  // Phase 2 (Months 13-20): Base revenue ~ $120/order
  // Phase 3 (Months 21+): Base revenue ~ $145/order (Recent growth)

  const midpoint1 = new Date(startDate);
  midpoint1.setMonth(midpoint1.getMonth() + 12);
  
  const midpoint2 = new Date(startDate);
  midpoint2.setMonth(midpoint2.getMonth() + 20);

  // We'll generate batches to avoid overwhelming the console/API locally, 
  // but we run sequentially to respect rate limits.
  
  while (currentDate <= endDate) {
    // 50% chance of an order on any given day (simulates natural frequency)
    if (Math.random() < 0.5) {
      
      let basePrice = 100;
      if (currentDate > midpoint2) {
        basePrice = 145; // Recent growth
      } else if (currentDate > midpoint1) {
        basePrice = 120; // Steady growth
      }

      // Add variance (+/- 15%) to seem organic
      const variance = 0.85 + Math.random() * 0.3;
      const finalPrice = (basePrice * variance).toFixed(2);
      
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
              title: 'Community Product',
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
      await createOrder(payload);
      orderCount++;
      
      // Shopify API bucket leak rate is 2/sec, so we sleep a bit
      await sleep(550); 
    }

    // Advance 1 day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log('\n\n✅ Seed complete!');
  console.log(`Created ${orderCount} orders over 25 months.`);
  console.log('You should now see a Strong/Good business health score.');
}

generateAndSeed();
