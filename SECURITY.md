# Security Policy

## Overview

This document outlines the security measures, known limitations, and responsible disclosure policy for the Far-MCA (Micro-Credit via Farcaster) smart contracts.

## Audit Status

- **Last Audit:** Not yet audited
- **Audit Firm:** N/A
- **Audit Report:** N/A
- **Target Audit Date:** Before mainnet deployment

**Current Status:** Testnet deployment only (Base Sepolia). Do NOT use on mainnet until professionally audited.

## Security Measures

### 1. Built-in Protections

- ✅ **ReentrancyGuard**: All state-changing functions protected against reentrancy attacks
- ✅ **SafeERC20**: Safe token transfer handling (prevents approval front-running, handles non-standard tokens)
- ✅ **Immutable Critical Variables**: `principal`, `dueAt`, `borrower`, `fundingToken` cannot be changed after deployment
- ✅ **Custom Errors**: Gas-efficient error handling
- ✅ **No Upgradability**: Contracts are not upgradeable (reduces admin attack surface)
- ✅ **OpenZeppelin Libraries**: Industry-standard, battle-tested dependencies (v5.x)

### 2. Access Controls

- **Borrower-only functions**: `disburse()`, `cancelFundraise()`
- **Anyone can call**: `contribute()`, `repay()`, `claim()`, `refund()` (by design for flexibility)
- **No admin/owner**: MicroLoan contracts have NO privileged roles after deployment
- **Factory owner**: Can pause new loan creation (emergency circuit breaker)

### 3. Economic Security

- **Minimum Principal**: $100 USDC (prevents spam/griefing)
- **Duration Bounds**: 7-365 days (prevents extremely short/long loans)
- **One Active Loan per Borrower**: Enforced by factory (prevents sybil attacks on reputation)
- **Disbursement Window**: 48 hours to claim funds after fully funded (prevents indefinite lock)

### 4. Testing & CI/CD

- **Unit Tests**: 20+ Foundry tests covering core functionality
- **Fuzz Testing**: Random input testing for edge cases
- **Gas Snapshots**: Automated gas usage monitoring
- **Static Analysis**: Slither + Mythril on every commit
- **Coverage Threshold**: Minimum 70% code coverage enforced

## Known Limitations & Assumptions

### 1. Trust Assumptions

- **USDC Trust**: Assumes USDC contract on Base is legitimate and non-malicious
- **IPFS Availability**: Loan metadata stored on IPFS (can become unavailable if not pinned)
- **Subgraph Reliability**: Frontend depends on The Graph subgraph (off-chain indexing)

### 2. Economic Risks

- **No Collateral**: Loans are unsecured (social reputation is the only collateral)
- **No Legal Recourse**: Smart contracts ≠ legal contracts (no enforcement in traditional courts)
- **Default Risk**: Lenders can lose 100% of principal if borrower doesn't repay
- **No Interest**: Zero-interest loans (lenders earn no yield, only help borrowers)

### 3. Technical Limitations

- **No Partial Refunds**: If loan isn't fully funded, contributors get full refund or nothing
- **Gas Price Risk**: High gas prices can make small contributions uneconomical
- **No Pause Button**: Once a loan is disbursed, it cannot be paused/stopped (by design)
- **No Loan Modification**: Principal, duration, deadline cannot be changed after creation

### 4. Reputation System

- **Off-chain**: Borrower reputation is tracked off-chain via subgraph (not enforced on-chain)
- **Sybil Attacks**: One address per loan, but users can create multiple addresses
- **No Slashing**: No on-chain penalties for defaulters (only reputation damage)

## Supported Chains & Tokens

### Mainnet (Not Yet Deployed)
- **Chain**: Base (Chain ID: 8453)
- **Supported Token**: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)

### Testnet (Current Deployment)
- **Chain**: Base Sepolia (Chain ID: 84532)
- **Supported Token**: TestUSDC (deployed by us for testing)
- **Factory**: See `contracts/deployments.json`

## Responsible Disclosure

We take security seriously. If you discover a vulnerability, please:

### 1. Do NOT:
- Publicly disclose the vulnerability before we've had a chance to fix it
- Exploit the vulnerability on mainnet (testnet is fine for demonstrating impact)
- Demand payment before disclosure (we'll reward responsibly after verification)

### 2. DO:
- Email security reports to: **security@far-mca.xyz** (PGP key available on request)
- Include detailed steps to reproduce
- Suggest a fix if possible
- Give us reasonable time to respond (48 hours for critical, 7 days for medium/low)

### 3. Severity Classification

| Severity | Description | Example | Response Time |
|----------|-------------|---------|---------------|
| **Critical** | Direct loss of funds, contract brick | Reentrancy allowing theft | < 24 hours |
| **High** | Indirect loss of funds, major functionality break | Integer overflow in accounting | < 48 hours |
| **Medium** | Griefing, DoS, minor fund lock | Gas griefing attack | < 7 days |
| **Low** | Informational, best practices | Missing event emission | < 30 days |

### 4. Bug Bounty Program

**Status**: Not yet active (will launch post-audit)

**Planned Rewards** (subject to change):
- Critical: $5,000 - $20,000
- High: $1,000 - $5,000
- Medium: $500 - $1,000
- Low: $100 - $500

**Eligibility**: Must follow responsible disclosure, cannot be known issues, must be in deployed contracts.

## Security Checklist (Pre-Mainnet)

Before deploying to mainnet, ensure:

- [ ] Professional audit completed by reputable firm
- [ ] All critical/high findings from audit remediated
- [ ] Bug bounty program launched
- [ ] Multisig wallet for factory owner (3-of-5 recommended)
- [ ] Emergency pause tested
- [ ] Frontend security audit (separate from smart contracts)
- [ ] Subgraph security review
- [ ] IPFS pinning strategy implemented (multiple pinning services)
- [ ] Legal review completed
- [ ] Insurance/coverage explored (Nexus Mutual, etc.)

## Security Roadmap

### Phase 1: Testnet (Current)
- ✅ Foundry test suite
- ✅ GitHub Actions CI/CD
- ✅ Slither + Mythril static analysis
- ⏳ Fuzz testing expansion
- ⏳ Invariant tests

### Phase 2: Pre-Audit
- ⏳ Code freeze
- ⏳ Self-audit checklist
- ⏳ Community review period
- ⏳ Bug bounty soft launch (testnet only)

### Phase 3: Audit
- ⏳ Select auditor (Trail of Bits, ConsenSys Diligence, or Code4rena)
- ⏳ Audit execution (2-4 weeks)
- ⏳ Remediation period
- ⏳ Publish audit report

### Phase 4: Mainnet
- ⏳ Deploy to mainnet
- ⏳ Bug bounty launch
- ⏳ Monitoring & incident response plan
- ⏳ Insurance coverage

## Contact

- **Email**: security@far-mca.xyz
- **GitHub**: https://github.com/aagoldberg/far-mca
- **Discord**: [Coming soon]

## Additional Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Slither Documentation](https://github.com/crytic/slither)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

---

**Last Updated**: 2025-11-30
**Version**: 1.0.0
