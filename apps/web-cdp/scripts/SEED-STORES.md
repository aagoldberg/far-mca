# Shopify Test Stores Reference

## Store Configurations

| Store Domain | Profile | Business Type | Expected Score | Product Set |
|--------------|---------|---------------|----------------|-------------|
| lendfriend-dev.myshopify.com | strong | General Store | ~85 (Strong) | Community Product |
| lendfriend-volume-low.myshopify.com | volume-low | Wellness Studio | ~55-65 | wellness |
| lendfriend-volume-high.myshopify.com | volume-high | Artisan Marketplace | ~70-80 | artisan |
| lendfriend-tenure-high.myshopify.com | tenure-high | Established Crafts | ~75-85 | artisan |
| lendfriend-tenure-low.myshopify.com | tenure-low | New Artisan Shop | ~45-55 | artisan |
| lendfriend-consistency-high.myshopify.com | consistency-high | Wellness Boutique | ~75-85 | wellness |
| lendfriend-consistency-low.myshopify.com | consistency-low | Wellness Pop-up | ~50-60 | wellness |
| lendfriend-growth-high.myshopify.com | growth-high | Growing Crafts Biz | ~75-85 | artisan |
| lendfriend-growth-low.myshopify.com | growth-low | Declining Crafts | ~45-55 | artisan |

## Product Sets

### Artisan (artisan)
- Handcrafted Ceramic Mug
- Woven Market Basket
- Beeswax Candle Set
- Leather Journal
- Wooden Cutting Board

### Wellness (wellness)
- Essential Oil Blend
- Herbal Tea Collection
- Yoga Mat (Cork)
- Meditation Cushion
- Self-Care Gift Box

### Bakery (bakery)
- Sourdough Bread Loaf
- Croissant Box (6)
- Custom Birthday Cake
- Artisan Cookie Assortment
- Cinnamon Rolls (4)

### Vintage (vintage)
- Vintage Denim Jacket
- Retro Band Tee
- Antique Brass Lamp
- Mid-Century Coffee Table
- Vinyl Record Collection

---

## Business Personas (for Loan Cards)

### lendfriend-volume-low (COMPLETED)
- **Business Name**: Serenity Scents Co.
- **Owner**: Maya Chen
- **Business Type**: Handmade candles & aromatherapy products
- **Products**: Essential oil blends, herbal teas, cork yoga mats, meditation cushions
- **Stats**: 53 orders, $2,619 revenue, 4.1 orders/month
- **Loan Request**: $2,500
- **Use of Funds**: Purchase wax and fragrance oils for holiday inventory
- **Score Highlight**: Low volume but consistent small sales

### lendfriend-volume-high
- **Business Name**: Luxe Pet Supplies
- **Owner**: Marcus Rivera
- **Business Type**: Premium pet products & accessories
- **Products**: Organic dog treats, custom collars, pet beds, grooming kits
- **Stats**: (seeding - 75% daily order rate, $200+ avg order)
- **Loan Request**: $15,000
- **Use of Funds**: Expand product line with cat accessories
- **Score Highlight**: High volume, strong revenue

### lendfriend-tenure-high
- **Business Name**: Oakwood Leather Goods
- **Owner**: Eleanor Mitchell
- **Business Type**: Handcrafted leather wallets & bags (3+ years)
- **Products**: Leather wallets, messenger bags, belts, card holders
- **Stats**: (seeding - 36 months history, started Dec 2022)
- **Loan Request**: $10,000
- **Use of Funds**: Purchase industrial sewing machine for production
- **Score Highlight**: Long-established track record

### lendfriend-tenure-low
- **Business Name**: Neon Dreams Apparel
- **Owner**: Jordan Park
- **Business Type**: Streetwear brand (just launched)
- **Products**: Graphic tees, hoodies, snapback hats, stickers
- **Stats**: (seeding - 3 months history, started Sept 2025)
- **Loan Request**: $3,000
- **Use of Funds**: First bulk order from manufacturer
- **Score Highlight**: Brand new business, limited history

### lendfriend-consistency-high
- **Business Name**: Bean & Brew Coffee Co.
- **Owner**: Sofia Nguyen
- **Business Type**: Small-batch coffee roaster with subscriptions
- **Products**: Coffee beans, pour-over kits, mugs, coffee subscriptions
- **Stats**: (seeding - 50% daily orders, very regular pattern)
- **Loan Request**: $7,500
- **Use of Funds**: Launch new single-origin subscription tier
- **Score Highlight**: Very predictable, steady revenue stream

### lendfriend-consistency-low
- **Business Name**: Throwback Threads Vintage
- **Owner**: Alex Turner
- **Business Type**: Curated vintage clothing & accessories
- **Products**: Vintage band tees, denim jackets, retro sneakers, accessories
- **Stats**: (seeding - erratic order pattern, high variance)
- **Loan Request**: $4,000
- **Use of Funds**: Purchase estate collection for resale
- **Score Highlight**: Unpredictable sales, feast-or-famine pattern

### lendfriend-growth-high
- **Business Name**: Bloom Botanicals
- **Owner**: Priya Sharma
- **Business Type**: Indoor plants & planters (viral growth)
- **Products**: Rare houseplants, ceramic planters, plant care kits, soil mixes
- **Stats**: (seeding - +3% monthly growth rate)
- **Loan Request**: $12,000
- **Use of Funds**: Lease greenhouse space to meet demand
- **Score Highlight**: Strong upward trajectory, expanding fast

### lendfriend-growth-low
- **Business Name**: Retro Game Vault
- **Owner**: David Kim
- **Business Type**: Vintage video games & consoles
- **Products**: Retro game cartridges, refurbished consoles, controllers, cases
- **Stats**: (seeding - -3% monthly decline)
- **Loan Request**: $5,000
- **Use of Funds**: Marketing campaign to reach new collectors
- **Score Highlight**: Declining trend, needs turnaround

---

## Seed Commands

```bash
# Source the tokens first
source .env.shopify-seeds

# Run any profile
SHOPIFY_ADMIN_ACCESS_TOKEN=$SHOPIFY_TOKEN_VOLUME_LOW \
SHOP_DOMAIN=lendfriend-volume-low.myshopify.com \
npx tsx scripts/seed-shopify-configurable.ts --profile=volume-low

# Available profiles:
# tenure-high, tenure-low
# consistency-high, consistency-low
# growth-high, growth-low
# volume-high, volume-low
# new, volatile, strong, star (demo scores)
```

## Profile Details

| Profile | Tenure | Growth | Frequency | Consistency | Avg Price |
|---------|--------|--------|-----------|-------------|-----------|
| tenure-high | 36 mo | 0% | 40% | Medium | $100 |
| tenure-low | 3 mo | 0% | 40% | Medium | $100 |
| consistency-high | 12 mo | 0% | 50% | High | $100 |
| consistency-low | 12 mo | 0% | 40% | Low | $100 |
| growth-high | 12 mo | +3%/mo | 40% | Medium | $100 |
| growth-low | 12 mo | -3%/mo | 40% | Medium | $100 |
| volume-high | 12 mo | 0% | 75% | Medium | $200 |
| volume-low | 12 mo | 0% | 15% | Medium | $25 |
