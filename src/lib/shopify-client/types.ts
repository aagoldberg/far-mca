export interface ShopifyStore {
  id: number;
  name: string;
  email: string;
  domain: string;
  province: string;
  country: string;
  address1: string;
  zip: string;
  city: string;
  source: string;
  phone: string;
  latitude: number;
  longitude: number;
  primary_location_id: number;
  primary_locale: string;
  address2: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  country_name: string;
  currency: string;
  customer_email: string;
  timezone: string;
  iana_timezone: string;
  shop_owner: string;
  money_format: string;
  money_with_currency_format: string;
  weight_unit: string;
  province_code: string;
  taxes_included: boolean;
  auto_configure_tax_inclusivity: boolean;
  tax_shipping: boolean;
  county_taxes: boolean;
  plan_display_name: string;
  plan_name: string;
  has_discounts: boolean;
  has_gift_cards: boolean;
  myshopify_domain: string;
  google_apps_domain: string;
  google_apps_login_enabled: boolean;
  money_in_emails_format: string;
  money_with_currency_in_emails_format: string;
  eligible_for_payments: boolean;
  requires_extra_payments_agreement: boolean;
  password_enabled: boolean;
  has_storefront: boolean;
  eligible_for_card_reader_giveaway: boolean;
  finances: boolean;
  primary_location: {
    id: number;
    name: string;
    address1: string;
    address2: string;
    city: string;
    zip: string;
    province: string;
    country: string;
    phone: string;
    created_at: string;
    updated_at: string;
    country_code: string;
    country_name: string;
    province_code: string;
    legacy: boolean;
    active: boolean;
  };
}

export interface ShopifyOrder {
  id: number;
  admin_graphql_api_id: string;
  app_id: number;
  browser_ip: string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string | null;
  cancelled_at: string | null;
  cart_token: string;
  checkout_id: number;
  checkout_token: string;
  closed_at: string | null;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: PriceSet;
  current_total_discounts: string;
  current_total_discounts_set: PriceSet;
  current_total_duties_set: PriceSet | null;
  current_total_price: string;
  current_total_price_set: PriceSet;
  current_total_tax: string;
  current_total_tax_set: PriceSet;
  customer_locale: string;
  device_id: number | null;
  discount_codes: any[];
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string | null;
  gateway: string;
  landing_site: string;
  landing_site_ref: string | null;
  location_id: number | null;
  name: string;
  note: string | null;
  note_attributes: any[];
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_duties_set: PriceSet | null;
  payment_gateway_names: string[];
  phone: string | null;
  presentment_currency: string;
  processed_at: string;
  processing_method: string;
  reference: string | null;
  referring_site: string;
  source_identifier: string | null;
  source_name: string;
  source_url: string | null;
  subtotal_price: string;
  subtotal_price_set: PriceSet;
  tags: string;
  tax_lines: any[];
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: PriceSet;
  total_line_items_price: string;
  total_line_items_price_set: PriceSet;
  total_outstanding: string;
  total_price: string;
  total_price_set: PriceSet;
  total_price_usd: string;
  total_shipping_price_set: PriceSet;
  total_tax: string;
  total_tax_set: PriceSet;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: number | null;
  billing_address: Address;
  customer: Customer;
  discount_applications: any[];
  fulfillments: any[];
  line_items: LineItem[];
  payment_terms: any | null;
  refunds: any[];
  shipping_address: Address;
  shipping_lines: ShippingLine[];
}

export interface PriceSet {
  shop_money: Money;
  presentment_money: Money;
}

export interface Money {
  amount: string;
  currency_code: string;
}

export interface Address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: string;
  company: string;
  latitude: number;
  longitude: number;
  name: string;
  country_code: string;
  province_code: string;
}

export interface Customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: number | null;
  note: string | null;
  verified_email: boolean;
  multipass_identifier: string | null;
  tax_exempt: boolean;
  phone: string | null;
  tags: string;
  last_order_name: string | null;
  currency: string;
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: string | null;
  tax_exemptions: any[];
  sms_marketing_consent: any | null;
  admin_graphql_api_id: string;
  default_address: Address;
}

export interface LineItem {
  id: number;
  admin_graphql_api_id: string;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: string | null;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: PriceSet;
  product_exists: boolean;
  product_id: number;
  properties: any[];
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: PriceSet;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: string;
  vendor: string;
  tax_lines: any[];
  duties: any[];
  discount_allocations: any[];
}

export interface ShippingLine {
  id: number;
  carrier_identifier: string | null;
  code: string;
  delivery_category: string | null;
  discounted_price: string;
  discounted_price_set: PriceSet;
  phone: string | null;
  price: string;
  price_set: PriceSet;
  requested_fulfillment_service_id: string | null;
  source: string;
  title: string;
  tax_lines: any[];
  discount_allocations: any[];
}

export interface CreditScore {
  score: number;
  revenueInCents: number;
  timestamp: Date;
  shop: string;
}