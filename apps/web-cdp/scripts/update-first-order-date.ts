import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function updateFirstOrderDate() {
  const walletAddress = '0xF520C0e96A4aF6d35Bc1D69D31c11A0ccc287CEa'.toLowerCase();

  // Get current record
  const { data: conn, error: fetchError } = await supabase
    .from('business_connections')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('platform', 'shopify')
    .single();

  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }

  console.log('Current firstOrderDate:', conn.revenue_data.firstOrderDate);

  // Calculate 13 months ago
  const firstOrderDate = new Date();
  firstOrderDate.setMonth(firstOrderDate.getMonth() - 13);

  // Update revenue_data with new firstOrderDate
  const updatedRevenueData = {
    ...conn.revenue_data,
    firstOrderDate: firstOrderDate.toISOString(),
  };

  const { error: updateError } = await supabase
    .from('business_connections')
    .update({ revenue_data: updatedRevenueData })
    .eq('id', conn.id);

  if (updateError) {
    console.error('Update error:', updateError);
    return;
  }

  console.log('Updated firstOrderDate to:', firstOrderDate.toISOString());
  console.log('Done! Refresh the page to see updated Business Tenure score.');
}

updateFirstOrderDate();
