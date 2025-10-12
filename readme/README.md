# LendFriend Documentation

This directory contains comprehensive documentation for the LendFriend platform integration and architecture.

## 📚 Documentation Index

### 🚀 [Getting Started Guide](./GETTING_STARTED.md) ← **START HERE!**
**Quick start guide for developers beginning the integration**

**Perfect for:**
- First-time readers
- Quick overview of what's been done
- Step-by-step next actions
- Timeline and checklist
- Common issues and solutions

**Time to read:** 10 minutes

---

### 1. [Frontend Integration Plan](./FRONTEND_INTEGRATION_PLAN.md)
**Complete step-by-step guide for integrating MicroLoan contracts with the frontend applications**

**What's inside:**
- 8 Phases of integration (Days 1-10 timeline)
- Detailed task checklist with checkboxes
- Code examples for every component and hook
- Migration strategy from RBF campaigns to MicroLoans
- Testing procedures and commands
- UI/UX updates for zero-interest model

**Key sections:**
- Phase 1: Contract ABIs & Configuration
- Phase 2: TypeScript Types
- Phase 3: Contract Interaction Hooks
- Phase 4: Update Components
- Phase 5: Update Pages
- Phase 6: Testing & Faucet Integration
- Phase 7: Subgraph Integration
- Phase 8: Web App Integration

**Estimated time:** 8-10 days for full integration

---

### 2. [Integration Architecture](./INTEGRATION_ARCHITECTURE.md)
**Visual architecture documentation with diagrams and system design**

**What's inside:**
- System architecture diagram
- Data flow diagrams (browsing, funding, creating loans)
- Component hierarchy with dependencies
- Transaction flow with state management
- Technology stack breakdown
- Contract API reference

**Key diagrams:**
- Contract → Subgraph → Frontend architecture
- Loan browsing flow
- Loan funding flow
- Loan creation flow
- Component hierarchy tree
- State management overview

---

## 🚀 Quick Start

### For Developers Starting Integration

1. **Read first:** [FRONTEND_INTEGRATION_PLAN.md](./FRONTEND_INTEGRATION_PLAN.md)
   - Start with Phase 1: Contract ABIs & Configuration
   - Follow the checklist sequentially

2. **Reference:** [INTEGRATION_ARCHITECTURE.md](./INTEGRATION_ARCHITECTURE.md)
   - Use for understanding system design
   - Reference API docs while coding

3. **Begin coding:**
   ```bash
   cd contracts
   forge build
   # Follow Phase 1 steps from integration plan
   ```

---

## 📊 Contract Addresses (Base Sepolia)

| Contract | Address |
|----------|---------|
| TestUSDC | `0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe` |
| MicroLoanFactory | `0x747988d925e8eeC76CF1E143307630dD8BE4bFff` |
| Deployer | `0x6F1e5BD44783327984f4723C87E0D2939524943B` |

See `../contracts/deployments.json` for more details.

---

## 🎯 Integration Status

### ✅ Completed
- [x] Smart contracts deployed to Base Sepolia
- [x] Comprehensive test suite (11/11 tests passing)
- [x] Contract ABIs generated
- [x] Deployment documentation
- [x] Integration plan created

### ⏳ In Progress / Todo
- [ ] Frontend integration (follow plan)
- [ ] Subgraph deployment
- [ ] End-to-end testing
- [ ] Production deployment

---

## 📖 Additional Documentation

### In Root Directory
- `../README.md` - Main project README
- `../OVERVIEW.md` - Project overview
- `../SETUP.md` - Setup instructions

### In Contracts Directory
- `../contracts/README.md` - Contracts overview
- `../contracts/DEPLOYMENT.md` - Full deployment guide
- `../contracts/QUICKSTART.md` - Quick reference
- `../contracts/DEPLOYMENT_SUMMARY.md` - Latest deployment results

### In Apps Directories
- `../apps/farcaster/` - Farcaster Mini App
- `../apps/web/` - Main Web App

---

## 🔑 Key Concepts

### Zero-Interest Model
LendFriend uses a zero-interest microloan model where:
- Funders contribute USDC to help businesses
- Businesses repay exactly 1.0x the contribution (no interest)
- Repayments happen in fixed periods (e.g., 12 months)
- All transactions are on-chain and transparent

### Migration from RBF
The integration plan covers migration from:
- **Old:** Revenue-Based Financing (1.5x repayment cap)
- **New:** Zero-Interest Microloans (1.0x repayment)

Key changes:
| Feature | Old | New |
|---------|-----|-----|
| Model | Campaign | Loan |
| Repayment | Revenue share % | Fixed periods |
| Cap | 1.5x | 1.0x |
| Terms | goalAmount, revenueShare | principal, termPeriods |

---

## 🛠️ Technology Stack

### Contracts
- Solidity 0.8.20
- Foundry framework
- OpenZeppelin libraries
- Base Sepolia testnet

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Wagmi 2.x + Viem
- OnchainKit (Coinbase)
- TailwindCSS 3.x

### Data & Indexing
- The Graph (subgraph)
- IPFS (metadata storage)
- Apollo Client (GraphQL)

---

## 📞 Support & Questions

### For Integration Help
- Read: [FRONTEND_INTEGRATION_PLAN.md](./FRONTEND_INTEGRATION_PLAN.md)
- Check: Phase-specific code examples
- Reference: [INTEGRATION_ARCHITECTURE.md](./INTEGRATION_ARCHITECTURE.md)

### For Contract Questions
- See: `../contracts/README.md`
- Check: `../contracts/DEPLOYMENT.md`
- Review: Test files in `../contracts/test/`

### For Testing
- Faucet: Use TestUSDC faucet (1000 USDC max per call)
- RPC: Public Base Sepolia RPC or use Alchemy
- Explorer: https://sepolia.basescan.org/

---

## 🎯 Next Steps

1. **Start Integration:**
   - Open [FRONTEND_INTEGRATION_PLAN.md](./FRONTEND_INTEGRATION_PLAN.md)
   - Begin with Phase 1
   - Check off tasks as you complete them

2. **Deploy Subgraph:**
   - Follow Phase 7 in integration plan
   - Index MicroLoan events
   - Test queries

3. **Test End-to-End:**
   - Create test loan
   - Fund with TestUSDC
   - Verify all UI updates

4. **Production Ready:**
   - Deploy to mainnet
   - Update contract addresses
   - Launch! 🚀

---

**Last Updated:** October 12, 2025
**Status:** Ready for Integration
**Version:** MVP v1.0
