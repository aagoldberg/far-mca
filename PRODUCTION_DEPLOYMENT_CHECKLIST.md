# Production Deployment Checklist

**Project:** FAR-MCA (Farcaster Micro-Credit App)
**Target:** Base Mainnet Launch
**Last Updated:** 2025-01-24

---

## PRE-DEPLOYMENT (Complete Before Going Live)

### ☐ 1. Smart Contracts - CRITICAL
- [ ] Deploy MicroLoanFactory to Base Mainnet
  - Current: Only deployed to Base Sepolia (testnet)
  - Factory Address (Sepolia): `0x66C4857774F768DB1ac7F2eE1bB943F0D86D6a34`
  - Update `contracts/deployments.json` with mainnet address
- [ ] Update USDC contract address to mainnet
  - Mainnet USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
  - Currently using TestUSDC: `0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe`
- [ ] Verify contracts on Basescan
  - Get Basescan API key
  - Run verification scripts
  - Set `"verified": true` in deployments.json
- [ ] Test mainnet deployment with small amounts
  - Create test campaign with max $10
  - Test full funding and repayment flow
  - Verify on Basescan explorer

### ☐ 2. Security - CRITICAL
- [ ] **URGENT: Rotate ALL exposed API keys**
  - [ ] PINATA_JWT (currently exposed in repo)
  - [ ] PINATA_API_KEY (exposed)
  - [ ] PINATA_SECRET_KEY (exposed)
  - [ ] NEYNAR_API_KEY (exposed)
  - [ ] SUPABASE_SERVICE_KEY (exposed)
  - [ ] TEST_WALLET_PRIVATE_KEY (exposed - NEVER use in production!)
- [ ] Remove or secure `.env.local`
  - [ ] Verify `.env*` is in .gitignore ✓ (already done)
  - [ ] Delete `.env.local` from repo history if committed
  - [ ] Create new `.env.local.example` with placeholder values
- [ ] Set up Vercel environment variables
  - [ ] Add all production secrets to Vercel dashboard
  - [ ] Never commit production secrets to git
  - [ ] Use different keys for production vs. development
- [ ] Security audit
  - [ ] Review all API endpoints for auth requirements
  - [ ] Check CORS configuration
  - [ ] Verify RLS policies in Supabase
  - [ ] Test XSS/CSRF protection

### ☐ 3. Payment Integration - CRITICAL
- [ ] Coinbase Commerce
  - [ ] Get production API key from Coinbase Commerce dashboard
  - [ ] Set `COINBASE_COMMERCE_API_KEY` in Vercel
  - [ ] Test charge creation end-to-end
- [ ] Coinbase Pay/OnRamp
  - [ ] Get production App ID from Coinbase Developer Portal
  - [ ] Set `NEXT_PUBLIC_COINBASE_APP_ID` in Vercel
  - [ ] Test card payment flow
  - [ ] Verify onramp integration works
- [ ] Stripe (if using)
  - [ ] Get production Stripe secret key
  - [ ] Set `STRIPE_SECRET_KEY` in Vercel
  - [ ] Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] Test payment flow end-to-end
  - [ ] Set up webhook endpoints
- [ ] Test all payment methods
  - [ ] Card payments (Coinbase Pay)
  - [ ] Bank transfers (Coinbase Commerce)
  - [ ] Crypto wallet payments (direct USDC)

### ☐ 4. Database & Migrations - CRITICAL
- [ ] Supabase production setup
  - [ ] Create production Supabase project (separate from development)
  - [ ] Apply migrations:
    - [ ] `20250124000000_create_social_connections.sql`
    - [ ] `20250124000001_create_social_verifications.sql`
    - [ ] Any other pending migrations
  - [ ] Verify Row Level Security policies work
  - [ ] Test with production data
- [ ] Set production Supabase credentials
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_KEY` (keep secret!)
- [ ] Set up automated backups
  - [ ] Enable point-in-time recovery
  - [ ] Schedule daily database backups
  - [ ] Test restore procedure

### ☐ 5. Environment Variables - CRITICAL
**Required for production:**

```bash
# Blockchain
NEXT_PUBLIC_ALCHEMY_KEY=                 # Base Mainnet RPC
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=    # After mainnet deployment
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# CDP / Coinbase
NEXT_PUBLIC_CDP_PROJECT_ID=              # From CDP dashboard
NEXT_PUBLIC_COINBASE_APP_ID=             # For card payments

# Payment Providers
COINBASE_COMMERCE_API_KEY=               # Production key
STRIPE_SECRET_KEY=                        # If using Stripe

# Supabase
NEXT_PUBLIC_SUPABASE_URL=                # Production instance
NEXT_PUBLIC_SUPABASE_ANON_KEY=           # Production anon key
SUPABASE_SERVICE_KEY=                    # Production service key

# Farcaster
NEYNAR_API_KEY=                          # New production key
NEXT_PUBLIC_NEYNAR_API_KEY=              # Public key (if different)
FARCASTER_CLIENT_ID=lendfriend

# Storage
PINATA_JWT=                              # New production JWT
PINATA_API_KEY=                          # New production key
PINATA_SECRET_KEY=                       # New production secret

# Monitoring (optional but recommended)
SENTRY_DSN=                              # For error tracking
NEXT_PUBLIC_SENTRY_DSN=                  # Public Sentry DSN

# App Config
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

**DO NOT SET IN PRODUCTION:**
- `TEST_WALLET_PRIVATE_KEY` - Never use in production!
- `RELAYER_PRIVATE_KEY` - Only if implementing gasless txns

### ☐ 6. Build Configuration - CRITICAL
- [x] Enable TypeScript checking (already done)
  - `ignoreBuildErrors: false` in next.config.ts
- [x] Enable ESLint checking (already done)
  - `ignoreDuringBuilds: false` in next.config.ts
- [ ] Fix any TypeScript errors
  - Run `npm run build` locally
  - Fix all compilation errors
  - Ensure build succeeds
- [ ] Fix any ESLint warnings
  - Run `npm run lint`
  - Fix critical warnings
  - Document any intentional exceptions

### ☐ 7. Monitoring & Error Tracking - HIGH PRIORITY
- [ ] Set up Sentry (or similar)
  - [ ] Create Sentry project
  - [ ] Add Sentry SDK to Next.js app
  - [ ] Configure error reporting
  - [ ] Test error capture works
- [ ] Set up alerts
  - [ ] Contract deployment alerts
  - [ ] Payment failure alerts
  - [ ] API error rate alerts
  - [ ] Database connection alerts
- [ ] Analytics
  - [ ] Add analytics tracking (Plausible/Fathom/GA4)
  - [ ] Track key user actions
  - [ ] Set up conversion funnels

### ☐ 8. Rate Limiting - HIGH PRIORITY
- [ ] Add rate limiting to API routes
  - [ ] Loan creation: 3/day per user ✓ (already implemented)
  - [ ] Payment endpoints: 10/min per IP
  - [ ] Farcaster auth: 5/hour per IP
  - [ ] All public APIs: Basic rate limiting
- [ ] Set up Redis or Upstash
  - [ ] For distributed rate limiting
  - [ ] Replace in-memory rate limiting
- [ ] Configure DDoS protection
  - [ ] Use Vercel's built-in protection
  - [ ] Consider Cloudflare if needed

### ☐ 9. Legal & Compliance - CRITICAL
- [ ] **Terms of Service**
  - [ ] Work with lawyer to draft ToS
  - [ ] Include lending terms
  - [ ] Include risk disclosures
  - [ ] Add to `/legal/terms` page
- [ ] **Privacy Policy**
  - [ ] Work with lawyer to draft privacy policy
  - [ ] GDPR compliance if serving EU
  - [ ] CCPA compliance if serving California
  - [ ] Add to `/legal/privacy` page
- [ ] User Agreement for borrowers
  - [ ] Loan terms and conditions
  - [ ] Repayment obligations
  - [ ] Default consequences
- [ ] Risk Disclosures
  - [ ] Crypto volatility risks
  - [ ] Smart contract risks
  - [ ] Platform risks
- [ ] Compliance check
  - [ ] Research lending regulations in target markets
  - [ ] Check if money transmitter license needed
  - [ ] Consult with legal counsel

---

## DEPLOYMENT DAY

### ☐ 10. Pre-Flight Checks
- [ ] Run final test suite
  - [ ] All unit tests pass
  - [ ] Integration tests pass
  - [ ] E2E tests pass (if available)
- [ ] Smoke test on staging
  - [ ] Create test campaign
  - [ ] Fund test campaign
  - [ ] Test repayment
  - [ ] Verify on Base Mainnet explorer
- [ ] Database backup
  - [ ] Manual backup before deployment
  - [ ] Verify backup is restorable
- [ ] Communication
  - [ ] Notify team of deployment window
  - [ ] Have rollback plan ready
  - [ ] Have incident response team on standby

### ☐ 11. Deploy to Production
```bash
# 1. Deploy smart contracts (if not already done)
cd contracts
npx hardhat run scripts/deploy.ts --network base-mainnet

# 2. Update contract addresses in app
# Edit apps/web-cdp/src/constants.ts with new addresses

# 3. Build and verify locally
cd apps/web-cdp
npm run build
# Fix any errors, then continue

# 4. Deploy to Vercel
git add .
git commit -m "Production deployment"
git push origin main
# Vercel will auto-deploy, or use `vercel --prod`

# 5. Verify deployment
# Open production URL
# Test wallet connection
# Test payment flow
```

### ☐ 12. Post-Deployment Verification
- [ ] Verify app loads at production URL
- [ ] Test wallet connection (MetaMask, Coinbase Wallet)
- [ ] Test authentication flow
- [ ] Test campaign creation
- [ ] Test donation flow
- [ ] Verify contracts on Basescan
- [ ] Check error monitoring dashboard
- [ ] Monitor logs for first 24 hours
- [ ] Test all payment methods
- [ ] Verify analytics tracking

### ☐ 13. Monitoring (First 24 Hours)
- [ ] Watch error rates in Sentry
- [ ] Monitor Vercel analytics
- [ ] Check Supabase metrics
- [ ] Watch for payment failures
- [ ] Monitor smart contract events
- [ ] Check user feedback/support tickets
- [ ] Have someone on-call for issues

---

## POST-DEPLOYMENT (First Week)

### ☐ 14. Soft Launch Strategy
- [ ] Start with limits
  - [ ] Max loan amount: $100-$500 initially
  - [ ] Max 10-20 beta users
  - [ ] Gradual increase over 2 weeks
- [ ] Collect feedback
  - [ ] User interviews
  - [ ] Support ticket analysis
  - [ ] Analytics review
- [ ] Monitor metrics
  - [ ] Loan default rate
  - [ ] Payment success rate
  - [ ] User retention
  - [ ] Platform revenue

### ☐ 15. Performance Optimization
- [ ] Review slow API endpoints
- [ ] Optimize database queries
- [ ] Add caching where appropriate
- [ ] Review bundle size
- [ ] Optimize images and assets

### ☐ 16. Documentation
- [ ] Update README with production setup
- [ ] Document deployment procedures
- [ ] Document rollback procedures
- [ ] Create runbook for common issues
- [ ] Document API endpoints
- [ ] Write user guides

---

## ROLLBACK PLAN

**If critical issues occur:**

1. **Immediate rollback:**
   ```bash
   # Vercel: Revert to previous deployment
   vercel rollback

   # Or via Vercel dashboard: Deployments > Previous > Promote
   ```

2. **Database rollback:**
   - Restore from point-in-time backup
   - Re-apply only tested migrations

3. **Smart contracts:**
   - Cannot be rolled back
   - Deploy new version if bugs found
   - Update app to use new contract addresses

4. **Communication:**
   - Notify users of maintenance
   - Post status on status page
   - Send email to active users

---

## KNOWN ISSUES & TODOs

### Critical TODOs to Address:
1. ✓ Fix next.config.ts (ignoreBuildErrors: false)
2. ✓ Ensure .env.local is gitignored
3. ⚠️ Smart contract deployment to mainnet
4. ⚠️ Rotate ALL exposed API keys
5. ⚠️ Configure payment provider keys
6. ⚠️ Legal documents (ToS, Privacy)
7. ⚠️ Set up error monitoring
8. ⚠️ Apply database migrations to production

### Non-Critical TODOs (Post-Launch):
- Implement Discord/LinkedIn/GitHub OAuth
- Add email/SMS authentication
- Improve test coverage (currently minimal)
- Add E2E tests for critical flows
- Optimize performance
- Add multi-language support

---

## EMERGENCY CONTACTS

**Team:**
- Lead Developer: [Your Name/Email]
- DevOps: [Name/Email]
- Legal: [Lawyer Contact]

**Service Providers:**
- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.io
- Coinbase Support: [Support URL]

**Monitoring Dashboards:**
- Vercel: https://vercel.com/[your-team]/[project]/deployments
- Sentry: [Your Sentry URL]
- Supabase: https://app.supabase.com/project/[project-id]
- Basescan: https://basescan.org/address/[factory-address]

---

## COST ESTIMATES (Monthly)

- Vercel Pro: ~$20/month (hobby tier free for testing)
- Supabase Pro: ~$25/month (free tier available)
- Sentry: $0-26/month (free tier available)
- Alchemy RPC: $0-49/month (free tier available)
- Neynar API: $0-29/month (free tier available)
- Coinbase Commerce: Transaction fees only
- Domain: ~$12/year

**Total Estimated:** $100-150/month for production + transaction fees

---

## SUCCESS METRICS

**Week 1:**
- 0 critical bugs
- < 1% payment failure rate
- 10-20 active users
- 0 security incidents

**Month 1:**
- 100+ active users
- $10,000+ in loans funded
- < 5% default rate
- 90%+ user satisfaction

**Month 3:**
- 500+ active users
- $100,000+ in loans funded
- Positive revenue (fees > costs)
- Partnerships established

---

**Last Reviewed:** 2025-01-24
**Next Review:** Before production deployment
**Status:** 🟡 In Progress (3/16 critical items completed)
