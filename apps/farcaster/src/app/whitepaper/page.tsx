'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import Link from 'next/link';

export default function WhitepaperPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        sdk.actions.ready();
        console.log('[WhitepaperPage] Farcaster Mini App ready signal sent');
      } catch (error) {
        console.error('[WhitepaperPage] Error sending ready signal:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">LendFriend Protocol</h1>
          <h2 className="text-xl md:text-2xl font-light mb-6">Zero-Interest Community Lending</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Version 1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>October 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>lendfriend.co</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed text-gray-800 mb-6">
              Crypto promised financial inclusion. It delivered overcollateralized lending—deposit $150 to borrow $100.
              This isn't broken DeFi. <strong>It's DeFi that never solved the actual problem.</strong>
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              True credit expansion means accessing capital you don't already have. It means a small business owner
              borrowing for inventory, a creator financing equipment, a student covering expenses—without requiring
              assets they don't possess. <strong>This is what 1.7 billion unbanked people need.</strong> This is what
              overcollateralized DeFi categorically cannot provide.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              The missing piece isn't capital—DeFi has billions in TVL. The missing piece is <strong>reputation</strong>.
              Anonymous wallets can't build credit history. Without persistent identity and verifiable social capital,
              collateral becomes the only signal of creditworthiness. This is why Aave and Compound require 150%+
              collateralization—not because it's good design, but because it's the only design possible without identity.
            </p>

            <p className="text-lg leading-relaxed text-gray-700">
              <strong>LendFriend solves this</strong> by making reputation verifiable, portable, and programmable.
              We leverage Farcaster's persistent identity (FIDs), multi-protocol reputation scoring (OpenRank, Neynar,
              Gitcoin Passport), and transparent on-chain repayment records to enable <em>actual credit expansion</em>—lending
              to people based on who they are and how they behave, not just what they already own.
            </p>
          </div>
        </section>

        {/* Manifesto */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border-l-4 border-[#3B9B7F]">
            <h2 className="text-2xl font-bold mb-6 text-[#2E7D68]">Manifesto :: From Social Trust to Sustainable Credit</h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700">
              <p>
                <strong>LendFriend starts different, then scales smart.</strong> We launch with 0% interest to build trust and gather behavioral data. As we prove the model works, we evolve to low, socially-appropriate interest (0-5% vs 10-30% predatory rates) using hybrid social + cash flow underwriting.
              </p>
              <p>
                <strong>Reputation can replace collateral.</strong> This is proven: Prosper started with social networks and auctions (2006), evolved to algorithmic pricing (2010). Branch was founded by Kiva's co-founder, evolving from social endorsements to ML models using 2,000+ data points. Tala began with mobile signals, evolved to causal inference that doubled approval rates while cutting defaults. We follow the same path.
              </p>
              <p className="text-[#2E7D68] font-semibold">
                Phase 1: Bootstrap trust at 0%. Phase 2: Scale sustainably with algorithms. The cryptoeconomy needs credit that starts with community and evolves with data.
              </p>
            </div>
          </div>
        </section>

        {/* Why Uncollateralized Lending? */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            Why Uncollateralized Lending?
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              <strong>Every existing credit model has failed.</strong> Traditional finance excludes 1.7 billion unbanked
              people and traps vulnerable borrowers with predatory rates (400% APR payday loans). Web2 P2P platforms like
              LendingClub and Prosper became rent-extracting intermediaries charging up to 12% origination fees while
              still requiring credit scores—95% of their volume shifted to institutional investors by 2020, abandoning
              the "peer" in peer-to-peer. DeFi overcollateralization (deposit $150 to borrow $100) serves leverage
              traders but solves nothing for the underbanked—it's 15x less capital efficient than traditional unsecured
              lending and only exists because anonymous wallets can't build credit history.
            </p>

            <p className="text-lg">
              <strong>Reputation-backed credit is the solution.</strong> With verifiable identity (Farcaster FIDs),
              multi-signal reputation scoring (OpenRank, Neynar, Gitcoin Passport), and transparent on-chain repayment
              records, we can finally make reputation <em>verifiable, portable, and programmable</em>. This isn't
              radical—it's how village lending worked for millennia. What's new is the infrastructure to scale it:
              persistent identity that travels across protocols, behavioral data that improves credit models network-wide,
              and transparent accountability visible to all.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
              <p className="text-blue-900 font-semibold mb-2">
                For a detailed breakdown of why traditional finance, Web2 P2P, and DeFi all failed:
              </p>
              <Link
                href="/why-uncollateralized"
                className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
              >
                Read the full analysis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* The Bootstrap Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            The Bootstrap Problem: Trust Before Algorithm
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Communities have always helped their members. Friends lend to friends every day. But these trust-based transactions create no verifiable credit history. <strong>To build algorithmic credit scoring, you first need behavioral data.</strong>
            </p>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
              <h4 className="font-bold mb-3 text-blue-800">The Cold Start Dilemma</h4>
              <p className="mb-3 text-blue-700">You can't train credit models without repayment data. You can't get repayment data without loans. You can't make loans without credit models.</p>
              <p className="font-semibold text-blue-900">Solution: Start with pure social trust (0% interest), gather data, evolve to hybrid underwriting.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold mb-4">Why Existing Solutions Can't Bootstrap Social Credit:</h4>
              <ul className="space-y-2">
                <li>• <strong>Traditional lending:</strong> Requires credit history you're trying to build</li>
                <li>• <strong>DeFi overcollateralized:</strong> Defeats the purpose of credit expansion</li>
                <li>• <strong>P2P with interest:</strong> Profit motive biases early data, attracts extractive lenders</li>
                <li>• <strong>Informal lending:</strong> No on-chain record, no network effect</li>
              </ul>
            </div>

            <p>
              Every successful fintech lender followed this path: <strong>Prosper (social auctions → algorithms), Branch (Kiva founder's evolution to ML), Tala (mobile signals → causal inference), Upstart (alt-data → ML)</strong>—all started with social/alternative proof before automating. LendFriend does the same, but on-chain and transparent.
            </p>

            <div className="bg-green-50 p-6 rounded-2xl border border-[#3B9B7F]">
              <p className="font-semibold text-[#2E7D68] text-xl text-center mb-2">
                <strong>Phase 1 (0%):</strong> Build trust graph and gather clean repayment data
              </p>
              <p className="text-center text-gray-700">
                <strong>Phase 2 (0-5%):</strong> Layer in cash flow signals and automate underwriting
              </p>
            </div>

            {/* Loan Size Ceiling with Social Signals */}
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-300 mt-6">
              <h4 className="font-bold mb-3 text-amber-900">Why Cash Flow Matters for Scale</h4>
              <p className="text-amber-800 mb-3">
                Social reputation alone has a natural ceiling on loan amounts. Research shows lenders using only
                social and behavioral signals average <strong>~$6,000 per loan</strong>, with industry practitioners
                reporting insufficient evidence that social data alone can reliably underwrite larger amounts.
              </p>
              <p className="text-amber-800">
                <strong>To scale beyond small loans ($1k-$5k) to meaningful amounts ($10k+)</strong>, cash flow
                verification becomes essential. This is why Phase 1 focuses on building trust with smaller loans,
                while Phase 2 layers in bank account data and on-chain revenue streams to enable larger, more
                impactful lending.
              </p>
            </div>
          </div>
        </section>

        {/* The Zero-Interest Primitive */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            The Zero-Interest Primitive
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              LendFriend transforms Farcaster's social graph into a zero-interest credit network through three core innovations:
            </p>

            <div className="space-y-8">
              {/* Innovation 1 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-[#2E7D68]">1. Reputation as Collateral</h3>
                <p className="mb-4">
                  When identity persists and communities witness, social capital becomes effective collateral:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong>Farcaster Identity:</strong> Persistent FIDs with verifiable social history</li>
                  <li><strong>Multi-Signal Scoring:</strong> Neynar Score, OpenRank, Gitcoin Passport, wallet activity</li>
                  <li><strong>Public Accountability:</strong> Loan requests and repayments visible to network</li>
                  <li><strong>Social Consequences:</strong> Default damages reputation across the entire ecosystem</li>
                  <li><strong>Network Vouching:</strong> Lender reputation implicitly vouches for borrowers</li>
                </ul>
              </div>

              {/* Innovation 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-[#2E7D68]">2. Zero-Interest Economics</h3>
                <p className="mb-4">
                  Removing interest fundamentally changes lending incentives and mechanics:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong>Community Motivation:</strong> Lenders help because they want to, not for profit</li>
                  <li><strong>No Debt Traps:</strong> Borrowers repay exactly what they borrowed, nothing more</li>
                  <li><strong>Aligned Incentives:</strong> Success measured by repayment, not returns</li>
                  <li><strong>Lower Risk:</strong> 1.0x repayment is achievable, compounding interest often isn't</li>
                  <li><strong>True P2P:</strong> No extractive platform taking cuts from either side</li>
                </ul>
              </div>

              {/* Innovation 3 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-[#2E7D68]">3. Protocol-First Architecture</h3>
                <p className="mb-4">
                  LendFriend operates as credibly neutral infrastructure:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong>No Custody:</strong> Smart contracts, not platforms, hold funds</li>
                  <li><strong>No Intermediation:</strong> Direct borrower-to-lenders transactions</li>
                  <li><strong>On-Chain Transparency:</strong> All loans verifiable on Base blockchain</li>
                  <li><strong>Composable:</strong> Anyone can build interfaces and integrations</li>
                  <li><strong>Decentralized:</strong> No single point of control or failure</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Credit Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            The Technical Stack
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4">Layer 0: Identity Infrastructure</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Farcaster IDs:</strong> Persistent, cryptographically-controlled identity</li>
                  <li><strong>Neynar API:</strong> Social graph, spam detection, quality scores</li>
                  <li><strong>OpenRank:</strong> EigenTrust-based reputation (0-1 scale)</li>
                  <li><strong>Gitcoin Passport:</strong> Humanity verification (threshold ≥20)</li>
                  <li><strong>ENS Integration:</strong> Optional real-name resolution</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4">Layer 2: Application Layer</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>LendFriend.co:</strong> Farcaster Frame-native interface</li>
                  <li><strong>My Loans:</strong> Borrower dashboard and fund disbursement</li>
                  <li><strong>My Investments:</strong> Lender portfolio with claim functionality</li>
                  <li><strong>Loan Discovery:</strong> Browse and filter community loans</li>
                  <li><strong>Identity Verification:</strong> Multi-signal borrower assessment</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4">Layer 1: Smart Contract Protocol</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div>MicroLoanFactory.sol (Base)</div>
                <div className="ml-4">├── createLoan(principal, termPeriods, metadataURI)</div>
                <div className="ml-4">├── getBorrowerLoans(borrower) → loan[]</div>
                <div className="ml-4">└── getLoans() → loan[]</div>
                <div className="mt-2">MicroLoan.sol</div>
                <div className="ml-4">├── contribute(amount) → USDC transfer</div>
                <div className="ml-4">├── disburse() → Transfer principal to borrower</div>
                <div className="ml-4">├── repay(amount) → Proportional distribution</div>
                <div className="ml-4">├── claim() → Lender withdraws repayments</div>
                <div className="ml-4">└── refund() → Cancel if fundraising fails</div>
                <div className="mt-2">Key Features:</div>
                <div className="ml-4">• Accumulator pattern for gas-efficient repayment</div>
                <div className="ml-4">• 0% interest hardcoded (1.0x repayment)</div>
                <div className="ml-4">• IPFS metadata storage</div>
                <div className="ml-4">• Fundraising deadline mechanism</div>
              </div>
            </div>
          </div>
        </section>

        {/* Reputation Mechanics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            Reputation Mechanics
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4">Multi-Signal Risk Assessment</h4>
              <p className="mb-4">LendFriend evaluates borrower trustworthiness using multiple independent signals:</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <strong className="text-[#2E7D68]">Neynar Score (0-1):</strong>
                    <ul className="text-sm ml-4 mt-1">
                      <li>• &gt;0.7: High quality user</li>
                      <li>• 0.4-0.7: Moderate quality</li>
                      <li>• &lt;0.4: Potential spam risk</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-[#2E7D68]">OpenRank (0-1):</strong>
                    <ul className="text-sm ml-4 mt-1">
                      <li>• EigenTrust-based</li>
                      <li>• Measures Farcaster engagement</li>
                      <li>• Updates every 2 hours</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-[#2E7D68]">Gitcoin Passport (0-100):</strong>
                    <ul className="text-sm ml-4 mt-1">
                      <li>• ≥20: Verified human</li>
                      <li>• Sybil resistance</li>
                      <li>• Multiple verification stamps</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-[#2E7D68]">Wallet Activity:</strong>
                    <ul className="text-sm ml-4 mt-1">
                      <li>• Transaction history</li>
                      <li>• On-chain activity depth</li>
                      <li>• Real value signal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4">Lending Risk Levels</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">Low Risk:</span>
                    <span>High Neynar (&gt;0.7) OR verified human + good OpenRank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">Medium:</span>
                    <span>Wallet activity + moderate social presence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">Higher:</span>
                    <span>Limited signals, new account, or sparse activity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">High Risk:</span>
                    <span>Low Neynar (&lt;0.4) indicating spam behavior</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4">Implicit Vouching</h4>
                <p className="text-sm mb-3">Lender reputation signals loan quality:</p>
                <ul className="space-y-2 text-sm">
                  <li><strong>High-reputation lenders</strong> implicitly vouch for borrowers they fund</li>
                  <li><strong>Lender diversity</strong> indicates broader community trust</li>
                  <li><strong>Contribution size</strong> weighted by lender reputation</li>
                  <li><strong>Network overlap</strong> between borrower/lenders increases trust</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Zero Interest Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            Why Zero Interest Works
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div className="bg-green-50 p-6 rounded-2xl border border-[#3B9B7F]">
              <h4 className="font-bold text-lg mb-4 text-[#2E7D68]">Economic Sustainability</h4>
              <p className="mb-4">Zero interest doesn't mean zero value. The system creates value through:</p>
              <ol className="space-y-2 text-sm">
                <li><strong>1. Reputation Building:</strong> Each successful repayment increases borrower's access to future capital</li>
                <li><strong>2. Social Capital:</strong> Helping community members strengthens network bonds</li>
                <li><strong>3. Optionality:</strong> Today's lender might be tomorrow's borrower</li>
                <li><strong>4. Risk Mitigation:</strong> Lower repayment burden means higher repayment rates</li>
                <li><strong>5. Network Effects:</strong> More participants = more liquidity for everyone</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4 text-blue-800">For Borrowers</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>✓ No interest = predictable repayment</li>
                  <li>✓ No credit check = faster access</li>
                  <li>✓ No collateral = true liquidity</li>
                  <li>✓ Build reputation = unlock larger loans</li>
                  <li>✓ Community support = aligned incentives</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4 text-purple-800">For Lenders</h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>✓ Help community members</li>
                  <li>✓ Build social capital</li>
                  <li>✓ Support ecosystem growth</li>
                  <li>✓ Future reciprocity option</li>
                  <li>✓ No platform fees</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Network Effects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            Network Effects and Growth
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
              <h4 className="font-bold text-lg mb-4 text-blue-800">The Virtuous Cycle</h4>
              <ol className="space-y-2 text-blue-700">
                <li>1. <strong>Successful loan</strong> → Builds borrower reputation</li>
                <li>2. <strong>Public repayment</strong> → Increases system trust</li>
                <li>3. <strong>Higher trust</strong> → More lenders participate</li>
                <li>4. <strong>More liquidity</strong> → Faster funding for borrowers</li>
                <li>5. <strong>Better experience</strong> → More borrowers join</li>
                <li>6. <strong>Larger network</strong> → Stronger reputation signals</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4">Growth Roadmap: Bootstrap → Scale → Automate</h4>
              <div className="space-y-4 text-sm">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <strong className="text-[#2E7D68]">v1.0 Launch: Social Trust at 0% (Q4 2025)</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• Bootstrap 500-1,000 Farcaster users</li>
                    <li>• Small loans ($100-$1,000) with pure social underwriting</li>
                    <li>• Gather repayment data and map trust networks</li>
                    <li>• Build transparent on-chain history</li>
                    <li>• Frame-native interface for viral growth</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <strong className="text-blue-800">v1.5 Evolution: Multi-Protocol Identity (Q1 2026)</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• Lens Protocol integration for broader reputation</li>
                    <li>• WorldID verification for stronger Sybil resistance</li>
                    <li>• Aggregate scores across social networks</li>
                    <li>• Cross-chain reputation bridges (Base, Optimism, Polygon)</li>
                    <li>• Train initial hybrid models on v1 repayment data</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                  <strong className="text-purple-800">v2.0 Hybrid: Cash Flow + Socially-Judged Interest (Q2 2026)</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• Plaid integration for bank account verification</li>
                    <li>• On-chain revenue streams (DEX, NFT, token income)</li>
                    <li>• Automated approval for loans &lt;$10k (AUC &gt; 0.70)</li>
                    <li>• Low interest (0-5% monthly) for larger amounts</li>
                    <li>• Creator and merchant cash advance products</li>
                    <li>• Revenue-based repayment structures (RBF)</li>
                  </ul>
                </div>
                <div className="bg-gray-100 p-3 rounded border border-gray-300">
                  <strong className="text-gray-800">v3.0+ Scale: Global Community Credit (2027+)</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• DAO treasury lending pools for members</li>
                    <li>• Regional community networks (Kenya, India, Brazil)</li>
                    <li>• Staking/vouching mechanisms (friends stake on repayment)</li>
                    <li>• Continuous ML model improvement with every loan</li>
                    <li>• $25k+ loans with full hybrid underwriting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Evolution: From Social Trust to Hybrid Underwriting */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            The Evolution: From Social Trust to Hybrid Underwriting
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              LendFriend follows the proven path pioneered by successful microfinance and fintech lenders: start with social proof, gather behavioral data, automate trust.
            </p>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 mb-6">
              <h4 className="font-bold text-lg mb-4 text-blue-800">The Proven Sequence (Prosper → Branch → Tala → Upstart)</h4>
              <ol className="space-y-3 text-blue-700">
                <li><strong>Step 1: Social Proof</strong> → Prosper social networks (2006), Branch from Kiva founder's group lending roots</li>
                <li><strong>Step 2: Digitize Signals</strong> → Mobile + social graph data (Tala: 250 points, Branch: 2,000 points, AUC ≈ 0.65-0.75)</li>
                <li><strong>Step 3: Algorithmic Models</strong> → Prosper's algorithmic pricing (2010), Tala's causal inference ML (AUC &gt; 0.70)</li>
                <li><strong>Step 4: Continuous Learning</strong> → Tala doubled approvals 40%→80% while defaults fell</li>
              </ol>
            </div>

            {/* Version 1: Current State */}
            <div className="bg-white border-2 border-[#3B9B7F] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#3B9B7F] text-white px-3 py-1 rounded-lg font-bold">Version 1.0</div>
                <h3 className="text-xl font-bold text-[#2E7D68]">Social Underwriting at 0% Interest</h3>
              </div>

              <p className="mb-4">
                <strong>Current implementation:</strong> Pure social reputation with zero interest. Build trust graph and gather behavioral data.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2 text-green-800">Trust Signals</h4>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• <strong>Neynar Score:</strong> Spam detection (0-1 scale)</li>
                    <li>• <strong>OpenRank:</strong> Social graph reputation</li>
                    <li>• <strong>Gitcoin Passport:</strong> Humanity verification</li>
                    <li>• <strong>Wallet Activity:</strong> On-chain history</li>
                    <li>• <strong>Lender Vouching:</strong> Implicit endorsement by funding</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2 text-green-800">Cash Flow Proxies</h4>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• <strong>Cast Frequency:</strong> Active = stable income signal</li>
                    <li>• <strong>Engagement Growth:</strong> Trending up = opportunity</li>
                    <li>• <strong>Network Expansion:</strong> Follower growth indicates reach</li>
                    <li>• <strong>Mutual Connections:</strong> Borrower-lender overlap = trust</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold mb-2 text-yellow-800">Data Collection Goals (v1)</h4>
                <ul className="text-sm space-y-1 text-yellow-700">
                  <li>✓ Bootstrap with 500-1,000 users to establish baseline repayment patterns</li>
                  <li>✓ Capture repayment streaks, timing, and community response</li>
                  <li>✓ Map endorsement network density and quality</li>
                  <li>✓ Measure correlation between social signals and repayment behavior</li>
                  <li>✓ Build transparent repayment history for trust reinforcement</li>
                </ul>
              </div>
            </div>

            {/* Version 2: Future State */}
            <div className="bg-white border-2 border-purple-300 rounded-2xl p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold">Version 2.0</div>
                <h3 className="text-xl font-bold text-purple-900">Hybrid Underwriting with Socially-Judged Interest</h3>
              </div>

              <p className="mb-4">
                <strong>Future evolution:</strong> Combine v1 social data with real cash flow signals. Automate larger loans with low, community-appropriate interest rates.
              </p>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                <h4 className="font-semibold mb-3 text-purple-800">Research-Backed Model</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Studies show hybrid social + cash-flow models achieve <strong>AUC ≈ 0.72-0.80</strong> vs 0.65 for social alone (Karlan & Zinman 2012; FinRegLab 2023).
                </p>
                <div className="bg-white p-3 rounded border border-purple-200 font-mono text-xs text-gray-800">
                  P(default) = f(repayment_streaks, endorsement_strength, transaction_volatility)
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold mb-2 text-purple-800">Additional Data Sources</h4>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• <strong>Plaid Integration:</strong> Real bank account cash flow</li>
                    <li>• <strong>On-Chain Revenue:</strong> DEX fees, NFT sales, token streams</li>
                    <li>• <strong>Merchant Data:</strong> Shopify/Stripe receipts</li>
                    <li>• <strong>Creator Metrics:</strong> Subscriber count, Patreon/Substack MRR</li>
                    <li>• <strong>Staking/Vouching:</strong> Friends stake tokens on repayment</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold mb-2 text-purple-800">Automation Capabilities</h4>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• <strong>Auto-Approval:</strong> Loans &lt;$10k with AUC &gt; 0.70</li>
                    <li>• <strong>Dynamic Pricing:</strong> 0-5% monthly based on risk</li>
                    <li>• <strong>Larger Tickets:</strong> Scale to $25k+ with proven model</li>
                    <li>• <strong>RBF Structure:</strong> Revenue-based repayment for merchants</li>
                    <li>• <strong>Continuous Learning:</strong> Model improves with each loan</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mt-4">
                <h4 className="font-semibold mb-2 text-orange-800">Interest Rate Philosophy (v2)</h4>
                <p className="text-sm text-orange-700">
                  Unlike v1's pure altruism, v2 introduces <strong>socially-judged, low interest</strong> (0-5% monthly) to:
                </p>
                <ul className="text-sm space-y-1 mt-2 text-orange-700">
                  <li>• Compensate lenders for risk on larger amounts</li>
                  <li>• Create sustainability for professional capital providers</li>
                  <li>• Still far below predatory rates (10-30%+ APR)</li>
                  <li>• Community voting can set max acceptable rates</li>
                  <li>• Transparent pricing based on quantified risk</li>
                </ul>
              </div>
            </div>

            {/* Research Evidence */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-6">
              <h4 className="font-bold text-lg mb-4">Research Foundations</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">Social + Cash Flow Outperforms Either Alone:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Karlan (2007): Group lending → default ↓ 7pp</li>
                    <li>• Karlan & Zinman (2012): Peer + cash flow → AUC ≈ 0.72</li>
                    <li>• Lenddo EFL (2016): Social + mobile → AUC ≈ 0.70</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Cash Flow Strongest Single Variable:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• FinRegLab (2023): Bank cash flow → AUC ≈ 0.80</li>
                    <li>• Upstart (2022): Alt-data + ML → approval ↑ 27%</li>
                    <li>• Tala/Branch: Mobile money → minutes approval</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Use Cases Evolution */}
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block mb-2">V1 Ready</div>
                <h4 className="font-bold text-lg mb-4">Friends & Community</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Small emergency loans ($100-$500)</li>
                  <li>• 0% interest, pure social trust</li>
                  <li>• Build reputation through repayment</li>
                  <li>• Transparent public accountability</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded inline-block mb-2">V2 Target</div>
                <h4 className="font-bold text-lg mb-4">Creator Working Capital</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Fan-funded advances ($1k-$10k)</li>
                  <li>• Low interest (0-3% monthly)</li>
                  <li>• Subscriber count + engagement data</li>
                  <li>• Repay from future content revenue</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded inline-block mb-2">V2 Target</div>
                <h4 className="font-bold text-lg mb-4">Merchant Cash Advances</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Business inventory funding ($5k-$25k)</li>
                  <li>• Revenue-based repayment (3-5%)</li>
                  <li>• Shopify/Stripe cash flow verified</li>
                  <li>• Automatic deductions from sales</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Vision */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            The Vision: From Altruism to Algorithm
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              LendFriend demonstrates that <strong>reputation can replace collateral</strong> when identity persists and communities witness. We start with pure altruism (0% interest) to build trust and gather data. We evolve to hybrid underwriting (social + cash flow) to scale sustainably.
            </p>

            <p>
              This is the proven path: <strong>Grameen started with village trust circles, evolved to mobile money.</strong> Kiva began with manual endorsements, now uses ML scorecards. Upstart started with alternative data, now approves 27% more borrowers than traditional models.
            </p>

            <p>
              We're not building another DeFi protocol chasing yield. We're building the <strong>data infrastructure for social credit</strong>—where every repayment strengthens the model, where community trust becomes quantifiable, where reputation becomes portable capital.
            </p>

            <div className="bg-gradient-to-r from-green-50 via-purple-50 to-blue-50 p-6 rounded-2xl border-l-4 border-[#3B9B7F]">
              <h4 className="font-bold text-lg mb-3 text-[#2E7D68]">The Evolution Path</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">v1</div>
                  <span><strong>Social Trust:</strong> Friends help friends at 0%, build reputation graph</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold">v1.5</div>
                  <span><strong>Cross-Protocol:</strong> Aggregate identity across Farcaster, Lens, WorldID</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-bold">v2</div>
                  <span><strong>Hybrid Underwriting:</strong> Social + cash flow → automate $10k loans at 0-5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-600 text-white px-2 py-0.5 rounded text-xs font-bold">v3+</div>
                  <span><strong>Global Scale:</strong> DAO pools, merchant advances, $25k+ with full ML models</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                <h4 className="font-bold text-lg mb-3 text-green-800">What v1 (0%) Enables</h4>
                <ul className="text-sm space-y-2 text-green-700">
                  <li>✓ Build trust without extraction</li>
                  <li>✓ Gather clean repayment data</li>
                  <li>✓ Map social endorsement networks</li>
                  <li>✓ Establish baseline default rates</li>
                  <li>✓ Create transparent reputation layer</li>
                  <li>✓ Bootstrap 500-1,000 user cohort</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                <h4 className="font-bold text-lg mb-3 text-purple-800">What v2 (Hybrid) Unlocks</h4>
                <ul className="text-sm space-y-2 text-purple-700">
                  <li>✓ Scale to larger loan amounts ($10k+)</li>
                  <li>✓ Attract professional capital</li>
                  <li>✓ Automate approval decisions (AUC &gt; 0.70)</li>
                  <li>✓ Sustainable low rates (0-5% vs 10-30%)</li>
                  <li>✓ Revenue-based repayment options</li>
                  <li>✓ Creator/merchant working capital</li>
                </ul>
              </div>
            </div>

            <div className="text-center text-xl font-bold text-[#2E7D68] mt-8 p-6 bg-gradient-to-r from-green-50 to-purple-50 rounded-2xl border-2 border-[#3B9B7F]">
              <p className="mb-2">Start with altruism. Gather data. Evolve to algorithm.</p>
              <p className="text-base font-normal text-gray-700 mt-3">Your reputation is your collateral. Your network is your credit history. Your community is your underwriter.</p>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            Technical Specifications
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4">Smart Contract Details</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Network:</strong> Base (Ethereum L2)</li>
                <li><strong>Currency:</strong> USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)</li>
                <li><strong>Interest Rate:</strong> 0% (hardcoded 1.0x repayment)</li>
                <li><strong>Metadata:</strong> IPFS-hosted JSON</li>
                <li><strong>Repayment Distribution:</strong> Gas-efficient accumulator pattern</li>
                <li><strong>Factory Pattern:</strong> Deterministic loan contract deployment</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4">Identity Verification APIs</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Neynar:</strong> Farcaster social graph and spam detection</li>
                <li><strong>OpenRank:</strong> graph.cast.k3l.io reputation scores</li>
                <li><strong>Gitcoin Passport:</strong> api.passport.xyz humanity verification</li>
                <li><strong>ENS:</strong> Ethereum Name Service resolution</li>
                <li><strong>Base RPC:</strong> On-chain transaction history</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
            <span>LendFriend Protocol v1.0</span>
            <span className="hidden sm:inline">•</span>
            <span>Live at lendfriend.co</span>
            <span className="hidden sm:inline">•</span>
            <span>Built on Base</span>
          </div>
          <div className="mt-4">
            <Link href="/" className="text-[#3B9B7F] hover:underline">
              Return to App
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
