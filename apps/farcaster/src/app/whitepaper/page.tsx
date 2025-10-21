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
        {/* Manifesto */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border-l-4 border-[#3B9B7F]">
            <h2 className="text-2xl font-bold mb-6 text-[#2E7D68]">Manifesto :: Community Over Profit</h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700">
              <p>
                <strong>True community support requires no interest.</strong> When friends help friends, when communities uplift members, profit has no place in the equation.
              </p>
              <p>
                Traditional finance failed—extractive interest rates trap borrowers in debt cycles. Web2 P2P failed—platforms took huge cuts while pretending to connect peers. DeFi overcollateralized lending failed—requiring 150% collateral isn't lending, it's inefficiency.
              </p>
              <p>
                <strong>LendFriend is different.</strong> We're building credit native to social trust. Where your reputation is your collateral. Where your community is your credit union. Where returning principal, not earning interest, is the goal.
              </p>
              <p className="text-[#2E7D68] font-semibold">
                The cryptoeconomy needs real credit expansion. Not through interest—that extracts value from borrowers. Through reputation—that creates new opportunities from social capital.
              </p>
            </div>
          </div>
        </section>

        {/* The Zero-Interest Gap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            The Zero-Interest Gap
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Communities have always helped their members. ROSCAs (rotating savings and credit associations) have existed for centuries across cultures. Friends lend to friends every day. But these trust-based systems remain invisible to the modern financial infrastructure.
            </p>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold mb-4">The problem with existing solutions:</h4>
              <ul className="space-y-2">
                <li>• <strong>Traditional lending:</strong> Credit checks exclude billions, interest rates trap borrowers</li>
                <li>• <strong>DeFi overcollateralized:</strong> Requires more capital than you borrow</li>
                <li>• <strong>P2P platforms:</strong> High fees, no reputation portability, platform risk</li>
                <li>• <strong>Informal lending:</strong> No transparency, no accountability, no credit building</li>
              </ul>
            </div>

            <p>
              Every day, people Venmo friends expecting repayment. Every week, communities support members through tough times. These transactions build trust but create no verifiable credit history. No reputation accrues. No access unlocks.
            </p>

            <div className="bg-green-50 p-6 rounded-2xl border border-[#3B9B7F]">
              <p className="font-semibold text-[#2E7D68] text-xl text-center">
                <strong>LendFriend makes social lending transparent, accountable, and reputation-building.</strong>
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
              <h4 className="font-bold text-lg mb-4">Growth Strategy</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <strong className="text-[#2E7D68]">Phase 1: Farcaster Native (Now)</strong>
                  <ul className="ml-4 mt-1">
                    <li>• 350K+ addressable Farcaster users</li>
                    <li>• Frame-native interface for viral distribution</li>
                    <li>• Build core reputation data</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-[#2E7D68]">Phase 2: Cross-Protocol Identity (Q1 2026)</strong>
                  <ul className="ml-4 mt-1">
                    <li>• Lens Protocol integration</li>
                    <li>• WorldID verification option</li>
                    <li>• Aggregate reputation across networks</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-[#2E7D68]">Phase 3: Community Scaling (Q2 2026)</strong>
                  <ul className="ml-4 mt-1">
                    <li>• DAO treasury lending pools</li>
                    <li>• Creator fan funding</li>
                    <li>• Regional community networks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Directions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            Future Directions
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              As social identity becomes economic identity, LendFriend unlocks new categories of community credit:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4">Creator Funding</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Fan-funded working capital</li>
                  <li>• Reputation from engagement metrics</li>
                  <li>• Advances against future content</li>
                  <li>• Community investment without equity</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4">DAO Treasury Pools</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Transform treasuries into member credit unions</li>
                  <li>• Programmatic lending based on contribution</li>
                  <li>• Governance token holders as lenders</li>
                  <li>• Build within-community financial resilience</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-4">Cash Flow Estimation</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Social activity as income proxy</li>
                  <li>• Engagement trends predict stability</li>
                  <li>• Network growth indicates opportunity</li>
                  <li>• On-chain history validates capacity</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Vision */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-[#3B9B7F] pb-4">
            The Vision
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              LendFriend demonstrates that <strong>reputation can replace both collateral and interest</strong> when identity persists and communities witness. As social graphs become economic graphs, as trust becomes verifiable, as reputation becomes portable—every community becomes a credit union, every social network becomes a mutual aid society.
            </p>

            <p>
              We're not building another DeFi protocol chasing yield. We're building the primitive that makes community-first finance possible. Where a teacher in Kenya can borrow for classroom supplies based on community standing. Where a developer in India can get conference funding from open-source contributions. Where a creator in Brazil can advance working capital from fan support.
            </p>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-[#3B9B7F]">
              <div className="text-center space-y-2">
                <div>Stage 1: Friends lending on Farcaster ✓</div>
                <div>Stage 2: Multi-protocol reputation aggregation</div>
                <div>Stage 3: DAO and creator community pools</div>
                <div>Stage 4: Global zero-interest social credit</div>
              </div>
            </div>

            <div className="text-center text-xl font-bold text-[#2E7D68] mt-8">
              <strong>The infrastructure for community credit now exists. Your reputation is your collateral. Your network is your safety net.</strong>
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
