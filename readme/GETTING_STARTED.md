# Getting Started with LendFriend Integration

## 🎯 Quick Overview

You have successfully deployed MicroLoan smart contracts to Base Sepolia and are ready to integrate them with your Farcaster and Web frontends. This guide will help you get started quickly.

---

## 📍 Where You Are Now

### ✅ Completed
- [x] MicroLoan contracts deployed to Base Sepolia
- [x] 11 comprehensive tests passing
- [x] TestUSDC with public faucet deployed
- [x] Complete integration documentation created
- [x] Architecture diagrams and flow charts
- [x] Deployment summary and testing guide

### 📋 Contract Addresses (Base Sepolia)
```
TestUSDC:           0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe
MicroLoanFactory:   0x747988d925e8eeC76CF1E143307630dD8BE4bFff
Deployer:           0x6F1e5BD44783327984f4723C87E0D2939524943B
```

---

## 🚀 Next Steps (In Order)

### Step 1: Read the Documentation (15 min)
Start here to understand the full integration plan:

**Primary Document**: [FRONTEND_INTEGRATION_PLAN.md](./FRONTEND_INTEGRATION_PLAN.md)
- Complete step-by-step guide
- 8 phases covering Days 1-10
- Code examples for every component
- Testing procedures

**Reference Document**: [INTEGRATION_ARCHITECTURE.md](./INTEGRATION_ARCHITECTURE.md)
- System architecture diagrams
- Data flow visualizations
- Component hierarchy
- API reference

### Step 2: Generate Contract ABIs (5 min)
```bash
# Navigate to contracts directory
cd contracts

# Build contracts with Foundry
forge build

# ABIs are now in contracts/out/ directory
```

### Step 3: Set Up Farcaster App (30 min)
```bash
# Navigate to Farcaster app
cd apps/farcaster

# Create ABI directory
mkdir -p src/abi

# Copy ABIs (from contracts/out/)
cp ../../contracts/out/MicroLoanFactory.sol/MicroLoanFactory.json src/abi/
cp ../../contracts/out/MicroLoan.sol/MicroLoan.json src/abi/
cp ../../contracts/out/TestUSDC.sol/TestUSDC.json src/abi/

# Update .env.local with new contract addresses
# (See Phase 1 in FRONTEND_INTEGRATION_PLAN.md)
```

### Step 4: Create Type Definitions (1 hour)
Follow Phase 2 in the integration plan to create TypeScript types for loans.

### Step 5: Implement Hooks (2-3 hours)
Follow Phase 3 to create:
- `useMicroLoan.ts` - Contract interactions
- `useUSDC.ts` - USDC operations
- `useLoans.ts` - Subgraph queries

### Step 6: Update Components (3-4 hours)
Follow Phase 4 to update:
- `LoanCard.tsx`
- `LoanDetails.tsx`
- `FundingForm.tsx`
- `RepaymentSchedule.tsx`

### Step 7: Test Everything (2 hours)
Follow Phase 6 testing procedures:
1. Connect wallet to Base Sepolia
2. Get test ETH from faucet
3. Mint TestUSDC (1000 USDC via faucet button)
4. Browse loans
5. Fund a loan
6. Verify transactions on Basescan

---

## 📊 Integration Timeline

### Minimum Viable Integration (3-5 days)
Focus on Farcaster app first:
- ✅ Day 1: ABIs, config, types
- ✅ Day 2: Hooks implementation
- ✅ Day 3-4: Component updates
- ✅ Day 5: Testing and bug fixes

### Full Integration (8-10 days)
Both Farcaster and Web apps:
- Days 1-5: Farcaster MVP
- Days 6-8: Web app integration
- Days 9-10: Subgraph and polish

---

## 🎨 Key Changes to Implement

### Data Model Changes
```typescript
// OLD (Campaign)
campaign: {
  goalAmount: bigint,
  totalRaised: bigint,
  revenueShare: number,  // e.g., 5%
  repaymentCap: number,  // e.g., 1.5x
}

// NEW (Loan)
loan: {
  principal: bigint,
  totalFunded: bigint,
  termPeriods: number,     // e.g., 12
  periodLength: number,    // e.g., 2592000 (30 days)
  firstDueDate: bigint,
  fundraisingDeadline: bigint,
}
```

### UI/UX Changes
- Replace "Campaign" → "Loan"
- Replace "Revenue Share %" → "Zero Interest"
- Replace "1.5x cap" → "1.0x repayment"
- Add repayment schedule visualization
- Emphasize community support over profit

---

## 💡 Pro Tips

### Start Small
1. Begin with read-only features (browsing loans)
2. Then add write features (funding)
3. Finally add creation features (create loan)

### Use the Faucet
TestUSDC has a public faucet:
```typescript
// In your navbar or settings
const { faucet } = useUSDCFaucet();

<button onClick={() => faucet(BigInt(1000e6))}>
  Get 1000 Test USDC
</button>
```

### Test Incrementally
After each phase, test that feature before moving on:
- Phase 1: Verify ABIs load correctly
- Phase 2: Check TypeScript types compile
- Phase 3: Test hooks with console.logs
- Phase 4: Verify components render
- Phase 5: Test full user flows

### Reference Working Code
The integration plan includes complete code examples for:
- Every hook you need to create
- Every component you need to update
- Every page you need to modify

---

## 🔍 Common Issues & Solutions

### Issue: ABIs Not Found
**Solution**: Make sure you ran `forge build` and copied files to correct location

### Issue: Contract Call Fails
**Solution**: Check you're connected to Base Sepolia (Chain ID: 84532)

### Issue: Insufficient Balance
**Solution**: Use TestUSDC faucet (max 1000 USDC per call)

### Issue: Transaction Stuck
**Solution**: Check if you need to approve USDC before contributing

---

## 📞 Need Help?

### Documentation
- **Integration Plan**: [FRONTEND_INTEGRATION_PLAN.md](./FRONTEND_INTEGRATION_PLAN.md)
- **Architecture**: [INTEGRATION_ARCHITECTURE.md](./INTEGRATION_ARCHITECTURE.md)
- **Contract Docs**: `../contracts/README.md`
- **Deployment**: `../contracts/DEPLOYMENT.md`

### Code Examples
Every document includes complete, working code examples you can copy.

### Testing
Use Base Sepolia testnet for all development:
- **Faucet**: https://faucet.quicknode.com/base/sepolia
- **Explorer**: https://sepolia.basescan.org/
- **RPC**: https://sepolia.base.org

---

## ✅ Pre-Flight Checklist

Before you start coding:
- [ ] Read FRONTEND_INTEGRATION_PLAN.md (at least Phases 1-3)
- [ ] Have Base Sepolia testnet configured in wallet
- [ ] Have test ETH for gas
- [ ] Contracts deployed and addresses confirmed
- [ ] Development environment running (`npm run dev`)
- [ ] Editor/IDE ready with TypeScript support

---

## 🎯 Success Criteria

You'll know the integration is successful when:
1. ✅ Users can browse loans on homepage
2. ✅ Users can view loan details (principal, term, schedule)
3. ✅ Users can mint TestUSDC via faucet
4. ✅ Users can approve USDC and fund loans
5. ✅ Funding updates UI in real-time
6. ✅ All transactions appear on Basescan
7. ✅ Zero-interest messaging is clear throughout

---

## 📈 Recommended Order

```
1. [15 min]  Read documentation
2. [5 min]   Generate ABIs
3. [30 min]  Set up Farcaster app environment
4. [1 hour]  Create type definitions
5. [3 hours] Implement hooks
6. [4 hours] Update components
7. [2 hours] Update pages
8. [2 hours] Test everything
9. [1 hour]  Fix bugs and polish
             ───────────────
             ~18 hours total for Farcaster MVP
```

---

## 🚀 Ready to Start?

**Open this now**: [FRONTEND_INTEGRATION_PLAN.md](./FRONTEND_INTEGRATION_PLAN.md)

**Start with**: Phase 1 - Contract ABIs & Configuration

**First command**:
```bash
cd /Users/andrewgoldberg/Projects/far-mca/contracts
forge build
```

---

**Good luck with your integration! 🎉**

Remember: Take it one phase at a time, test as you go, and reference the detailed plan when you need guidance.
