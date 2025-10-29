'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h1>
          <p className="text-xl md:text-2xl font-light">
            The technical mechanics behind uncollateralized community lending
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Introduction */}
        <section className="mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed text-gray-800 mb-6">
              LendFriend enables uncollateralized lending by quantifying social trust. Your network doesn't just
              vouch for you—they algorithmically prove your creditworthiness through measurable social proximity.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Here's exactly how we turn relationships into credit scores.
            </p>
          </div>
        </section>

        {/* Trust Score Algorithm */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Trust Score Algorithm</h2>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Social Proximity Measurement</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We calculate social distance between borrower and lender by measuring mutual connections on Farcaster.
              The algorithm is based on research from Kiva and Grameen Bank showing that <strong>20+ friend/family lenders
              achieve 98% repayment vs 88% with 0 friend/family lenders</strong>—a 10% improvement from social proximity alone.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-3">The Exact Algorithm</h4>
            <div className="bg-white rounded-lg p-4 mb-4 font-mono text-xs overflow-x-auto">
              <pre className="text-gray-800">{`// 1. Fetch social graphs from Farcaster
const borrowerNetwork = union(borrowerFollowers, borrowerFollowing);
const lenderNetwork = union(lenderFollowers, lenderFollowing);
const mutualConnections = intersection(borrowerNetwork, lenderNetwork);

// 2. Quality weighting (filter spam/bots using Neynar scores)
const avgQuality = (borrowerScore + lenderScore) / 2;
const effectiveMutuals = mutualCount * avgQuality;

// 3. Calculate social distance score (0-100)
let socialDistance = 0;

// Base score from quality-adjusted mutuals (up to 60 points)
if (effectiveMutuals >= 18) socialDistance += 60;
else if (effectiveMutuals >= 9) socialDistance += 50;
else if (effectiveMutuals >= 4.5) socialDistance += 35;
else if (effectiveMutuals >= 2.5) socialDistance += 20;
else if (effectiveMutuals >= 0.8) socialDistance += 10;

// Bonus for high overlap percentage (up to 30 points)
if (percentOverlap > 10) {
  socialDistance += Math.min(percentOverlap * 3, 30);
}

// Bonus for mutual follows (up to 10 points)
if (lenderFollowsBorrower && borrowerFollowsLender) socialDistance += 10;
else if (lenderFollowsBorrower || borrowerFollowsLender) socialDistance += 5;

socialDistance = Math.min(socialDistance, 100);`}</pre>
            </div>

            <h4 className="font-bold text-gray-900 mb-3 mt-6">Risk Tier Determination</h4>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <div className="font-bold text-green-900">LOW RISK</div>
                <p className="text-sm text-green-800">9+ effective mutuals OR 60+ social distance score</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                <div className="font-bold text-yellow-900">MEDIUM RISK</div>
                <p className="text-sm text-yellow-800">2.5+ effective mutuals OR 30+ social distance score</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <div className="font-bold text-red-900">HIGH RISK</div>
                <p className="text-sm text-red-800">Less than 2.5 effective mutuals AND less than 30 social distance</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Loan-Level Support Strength</h4>
            <p className="text-gray-700 mb-3">
              For the entire loan, we aggregate proximity across all lenders:
            </p>
            <div className="bg-white rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-gray-800">{`const percentageFromNetwork = (lendersWithConnections / totalLenders) * 100;

if (percentageFromNetwork >= 60) supportStrength = 'STRONG';
else if (percentageFromNetwork >= 30) supportStrength = 'MODERATE';
else if (percentageFromNetwork > 0) supportStrength = 'WEAK';
else supportStrength = 'NONE';`}</pre>
            </div>
          </div>
        </section>

        {/* Smart Contract Flow */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Smart Contract Flow</h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-800">
              <strong>Important:</strong> Trust scores are calculated off-chain using the algorithm above. The smart contracts
              handle money movement, not social graph analysis. This keeps gas costs low (Base L2 fees are pennies).
            </p>
          </div>

          <div className="space-y-6">
            {/* Loan Creation */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Loan Deployed via Factory</h3>
                  <p className="text-gray-700 mb-3">
                    MicroLoanFactory deploys a new MicroLoan contract with constraints:
                  </p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-xs overflow-x-auto mb-3">
                    <pre className="text-gray-800">{`uint256 public minPrincipal = 100e6;           // $100 minimum
uint256 public minLoanDuration = 7 days;
uint256 public maxLoanDuration = 365 days;
uint256 public disbursementWindow = 14 days;

// Prevents multiple active loans per borrower
require(!hasActiveLoan[borrower], "borrower has active loan");`}</pre>
                  </div>
                  <p className="text-sm text-gray-600">
                    Each loan gets its own contract. Parameters: principal amount, maturity date, borrower address, and FID (Farcaster ID).
                  </p>
                </div>
              </div>
            </div>

            {/* Contributions */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Lenders Contribute</h3>
                  <p className="text-gray-700 mb-3">
                    Lenders send USDC to the contract. The contract tracks contributions:
                  </p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-xs overflow-x-auto mb-3">
                    <pre className="text-gray-800">{`function contribute(uint256 amount) external {
    require(isFundingOpen(), "funding closed");
    require(amount > 0, "zero amount");

    usdc.transferFrom(msg.sender, address(this), amount);
    contributions[msg.sender] += amount;
    totalRaised += amount;

    emit Contribution(msg.sender, amount, totalRaised);
}`}</pre>
                  </div>
                  <p className="text-sm text-gray-600">
                    No trust calculation here—just recording who gave what. Trust scores are shown in the UI (off-chain).
                  </p>
                </div>
              </div>
            </div>

            {/* Disbursement */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Funds Disbursed to Borrower</h3>
                  <p className="text-gray-700 mb-3">
                    Once fully funded, borrower can claim funds within the disbursement window:
                  </p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-xs overflow-x-auto mb-3">
                    <pre className="text-gray-800">{`function disburse() external {
    require(msg.sender == borrower, "only borrower");
    require(totalRaised >= principal, "not fully funded");
    require(block.timestamp <= fundingDeadline + disbursementWindow);
    require(!isDisbursed, "already disbursed");

    isDisbursed = true;
    usdc.transfer(borrower, totalRaised);

    emit Disbursed(borrower, totalRaised);
}`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Repayment */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Repayment & Claims</h3>
                  <p className="text-gray-700 mb-3">
                    Borrower repays flexibly. Lenders claim their pro-rata share using an <strong>accumulator pattern</strong> (gas-efficient):
                  </p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-xs overflow-x-auto mb-3">
                    <pre className="text-gray-800">{`// On repayment:
accRepaidPerShare += (amount * ACC_PRECISION) / principal;

// Claimable calculation per lender:
function claimableAmount(address contributor) public view returns (uint256) {
    uint256 accumulated = (contributions[contributor] * accRepaidPerShare) / ACC_PRECISION;
    return accumulated - userRewardDebt[contributor];
}

// Where ACC_PRECISION = 1e18`}</pre>
                  </div>
                  <p className="text-sm text-gray-600">
                    This distributes repayments proportionally without iterating over all lenders. If borrower overpays, lenders receive the bonus pro-rata.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vouching Mechanics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Vouching Mechanics</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How Contributions Signal Trust</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When someone contributes to your loan, they're doing two things: (1) providing capital, and (2) vouching for you with their social reputation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The UI displays each lender's social proximity to the borrower (calculated off-chain using the algorithm in Section 1).
              A $10 contribution from a mutual friend is a stronger trust signal than $100 from a stranger with zero mutual connections.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-3">Actual Implementation</h4>
            <p className="text-gray-700 mb-3">
              The social proximity algorithm runs off-chain for each lender-borrower pair. The UI shows:
            </p>
            <div className="bg-white rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-gray-800">{`// For each lender:
{
  address: "0x1234...",
  contribution: 50_000000,        // $50 in USDC (6 decimals)
  mutualConnections: 12,
  socialDistance: 75,             // 0-100 score
  riskTier: "LOW",                // LOW, MEDIUM, HIGH
  isConnected: true
}

// Aggregated for the whole loan:
{
  supportStrength: "STRONG",      // 60%+ lenders have connections
  averageMutualConnections: 8.4,
  percentageFromNetwork: 65%
}`}</pre>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Sybil Resistance</h4>
              <p className="text-sm text-gray-600 mb-2">
                Creating fake Farcaster accounts to game the system doesn't work because:
              </p>
              <ul className="text-xs text-gray-600 ml-4 space-y-1">
                <li>• Fake accounts have no mutual connections with the borrower (socialDistance = 0)</li>
                <li>• Neynar quality scores filter out spam/bot accounts (avgQuality adjustment)</li>
                <li>• Support strength requires 30%+ of lenders to be from your real network</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Cumulative Trust Display</h4>
              <p className="text-sm text-gray-600">
                Lenders can see the borrower's aggregate support strength before contributing. Higher support = lower perceived risk.
                This creates a virtuous cycle: early contributions from close friends attract broader community support.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">No On-Chain Trust Calculation</h4>
              <p className="text-sm text-gray-600">
                The smart contract only tracks addresses and amounts. Social graph analysis happens off-chain to keep gas costs minimal.
                Future versions may use zero-knowledge proofs to verify trust scores on-chain without revealing the social graph.
              </p>
            </div>
          </div>
        </section>

        {/* Reputation System */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Reputation System</h2>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-800">
              <strong>Current Status:</strong> Reputation tracking is partially implemented. All repayment behavior is recorded on-chain,
              but we're still gathering data to build a robust reputation scoring algorithm. Here's what's tracked now and planned for the future.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Trust Score vs Reputation</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h4 className="font-bold text-green-900 mb-2">Trust Score (Implemented)</h4>
                <p className="text-sm text-green-800">
                  Measures current social validation. Based on mutual connections between you and your lenders.
                  Calculated for each new loan.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h4 className="font-bold text-blue-900 mb-2">Reputation (Future)</h4>
                <p className="text-sm text-blue-800">
                  Measures historical creditworthiness. Based on past repayment behavior, timeliness, and track record.
                  Persists across all loans.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-3">What's On-Chain Now</h4>
            <p className="text-gray-700 mb-3">
              Each MicroLoan contract records:
            </p>
            <div className="bg-white rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-gray-800">{`// Per-loan tracking (on-chain):
{
  borrower: address,
  principal: uint256,
  totalRaised: uint256,
  totalRepaid: uint256,
  isDisbursed: bool,
  maturityDate: uint256,
  contributions: mapping(address => uint256),
  claims: mapping(address => uint256)
}

// Factory tracks active loans:
hasActiveLoan[borrower] = true;  // Prevents multiple active loans`}</pre>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Planned Reputation Algorithm</h3>
            <p className="text-gray-700 mb-4">
              Once we have sufficient repayment data (target: 100+ loans), we'll implement a weighted reputation score:
            </p>

            <div className="space-y-3 text-sm text-gray-800">
              <div className="flex items-start gap-2">
                <div className="font-bold min-w-[140px]">Repayment Ratio:</div>
                <div>(Total Repaid / Total Borrowed) × 40%</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="font-bold min-w-[140px]">Timeliness:</div>
                <div>Days early/late relative to maturity × 30%</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="font-bold min-w-[140px]">Loan Count:</div>
                <div>Number of successful repayments × 15%</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="font-bold min-w-[140px]">Network Quality:</div>
                <div>Avg trust scores across all loans × 10%</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="font-bold min-w-[140px]">Amount Borrowed:</div>
                <div>Total principal over time × 5%</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              This reputation score will unlock larger loan amounts, optional interest-bearing terms, and potentially traditional credit reporting integration.
            </p>
          </div>
        </section>

        {/* Risk & Defaults */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Risk & Default Handling</h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens If Someone Doesn't Repay?</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Phase 1 uses 0% interest, which means lenders are giving out of generosity, not chasing returns.
              This lets us gather behavioral data without the complexity of interest calculation or legal enforcement.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Defaults are recorded on-chain and visible to all future lenders, but we don't block borrowers from trying again.
              Redemption is possible—borrowers can rebuild their track record through smaller, successful loans.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">On-Chain Transparency</h4>
              <p className="text-sm text-gray-600 mb-2">
                All repayment behavior is permanently recorded on Base L2. Anyone can query:
              </p>
              <ul className="text-xs text-gray-600 ml-4 space-y-1">
                <li>• Total amount borrowed by an address</li>
                <li>• Total amount repaid</li>
                <li>• Number of active vs completed loans</li>
                <li>• Maturity dates vs actual repayment dates</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">No Legal Recourse (Phase 1)</h4>
              <p className="text-sm text-gray-600">
                Current loans have no legal enforcement. No collections agencies, no credit bureau reporting, no lawsuits.
                Lenders rely purely on social accountability and on-chain reputation.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Future versions may offer optional credit reporting for borrowers who want to build traditional credit history.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Future: Interest-Bearing Loans</h4>
              <p className="text-sm text-gray-600">
                Once we have 100+ completed loans, we'll have enough data to build predictive models. This enables:
              </p>
              <ul className="text-xs text-gray-600 ml-4 space-y-1 mt-2">
                <li>• Risk-adjusted interest rates (low-risk borrowers get lower rates)</li>
                <li>• Dynamic loan limits based on reputation score</li>
                <li>• Optional lender insurance pools</li>
                <li>• Integration with traditional credit systems</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Why Start at 0% Interest?</h4>
              <p className="text-sm text-gray-600">
                Zero interest aligns incentives. Lenders give because they want to help, not because they expect profit.
                This creates a pure dataset: repayments happen from gratitude and reputation-building, not financial penalty avoidance.
                That behavioral data is more valuable for future underwriting than noisy data from interest-bearing loans.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Stack</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Blockchain</h4>
              <p className="text-sm text-gray-600 mb-2">Base L2 (Ethereum)</p>
              <p className="text-xs text-gray-500">~$0.01 transaction fees, 2-second finality, Ethereum security guarantees</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Smart Contracts</h4>
              <p className="text-sm text-gray-600 mb-2">Solidity 0.8.20, Factory Pattern</p>
              <p className="text-xs text-gray-500">MicroLoanFactory.sol deploys individual MicroLoan.sol contracts per loan</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Identity & Social Graph</h4>
              <p className="text-sm text-gray-600 mb-2">Farcaster Protocol + Neynar API</p>
              <p className="text-xs text-gray-500">Verified social identities (FIDs), follower/following graph data, quality scores</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Currency</h4>
              <p className="text-sm text-gray-600 mb-2">USDC on Base</p>
              <p className="text-xs text-gray-500">Dollar-pegged stablecoin, 6 decimals, ERC-20 standard</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Frontend</h4>
              <p className="text-sm text-gray-600 mb-2">Next.js 14, Wagmi v2, Viem, Privy</p>
              <p className="text-xs text-gray-500">React Server Components, wallet abstraction, embedded wallets</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Trust Score Computation</h4>
              <p className="text-sm text-gray-600 mb-2">Off-chain TypeScript, cached results</p>
              <p className="text-xs text-gray-500">Set intersection algorithms, 30-minute cache TTL via React Query</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 mt-6">
            <h4 className="font-bold text-gray-900 mb-3">Repository Structure</h4>
            <div className="font-mono text-xs text-gray-700 space-y-1">
              <div>📁 /contracts — Solidity smart contracts (MicroLoan.sol, MicroLoanFactory.sol)</div>
              <div>📁 /apps/web — Next.js web app</div>
              <div>📁 /apps/farcaster — Farcaster Frame integration</div>
              <div>📁 /apps/web/src/lib/socialProximity.ts — Trust score algorithm</div>
              <div>📁 /apps/web/src/hooks/useLoanSocialSupport.ts — Aggregate support calculation</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-[#3B9B7F] rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Want to Go Deeper?</h2>
            <p className="text-lg mb-6 opacity-90">
              Read our whitepaper for the philosophical foundations or our vision for where we're headed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/whitepaper"
                className="inline-block px-8 py-3 bg-white text-[#3B9B7F] font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Read Whitepaper
              </Link>
              <Link
                href="/vision"
                className="inline-block px-8 py-3 bg-[#2E7D68] text-white font-bold rounded-lg hover:bg-[#255A51] transition-colors"
              >
                See the Vision
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
