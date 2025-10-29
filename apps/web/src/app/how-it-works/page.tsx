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
              Your trust score is calculated from the social distance between you and your lenders.
              The closer your relationship, the stronger the signal.
            </p>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border-l-4 border-[#3B9B7F]">
                <div className="font-bold text-gray-900 mb-2">1st Degree Connections (Direct)</div>
                <p className="text-sm text-gray-600">
                  People who follow you and you follow back. Mutual connections on Farcaster.
                  <strong> Highest trust weight.</strong>
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border-l-4 border-[#2E8B8B]">
                <div className="font-bold text-gray-900 mb-2">2nd Degree Connections (Friends-of-Friends)</div>
                <p className="text-sm text-gray-600">
                  People connected to your 1st degree network. The network effect.
                  <strong> Medium trust weight.</strong>
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border-l-4 border-[#2C7DA0]">
                <div className="font-bold text-gray-900 mb-2">3rd Degree+ Connections (Extended Network)</div>
                <p className="text-sm text-gray-600">
                  Broader community members. Still valuable but weaker signal.
                  <strong> Lower trust weight.</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-3">The Algorithm</h4>
            <p className="text-gray-700 mb-4">
              When someone contributes to your loan, we calculate their social distance from you using graph traversal
              algorithms. Each contribution is weighted by:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>• <strong>Social proximity</strong> (closer = higher weight)</li>
              <li>• <strong>Contribution amount</strong> (larger = stronger signal)</li>
              <li>• <strong>Lender's reputation</strong> (established lenders carry more weight)</li>
              <li>• <strong>Recency</strong> (recent activity signals active trust)</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed">
            The result: a quantified trust score that reflects genuine social validation, not just wallet addresses
            clicking buttons.
          </p>
        </section>

        {/* Smart Contract Flow */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Smart Contract Flow</h2>

          <div className="space-y-6">
            {/* Loan Creation */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Loan Request Deployed</h3>
                  <p className="text-gray-700 mb-3">
                    Borrower creates a loan request. A unique smart contract is deployed on Base L2 with:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Funding goal (up to $5,000)</li>
                    <li>• Maturity date (repayment timeline)</li>
                    <li>• Borrower's verified Farcaster identity</li>
                    <li>• Story/use case (stored on-chain)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contributions */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Community Contributes</h3>
                  <p className="text-gray-700 mb-3">
                    Lenders contribute USDC to the contract. Each contribution:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Records lender's address and contribution amount</li>
                    <li>• Calculates social distance from borrower (on-chain oracle)</li>
                    <li>• Updates trust score in real-time</li>
                    <li>• Mints proportional claim tokens to lender</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Funding Complete */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Funds Disbursed</h3>
                  <p className="text-gray-700 mb-3">
                    When funding goal is reached:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Smart contract releases USDC to borrower</li>
                    <li>• Loan terms locked on-chain</li>
                    <li>• Repayment schedule activated</li>
                    <li>• Trust score recorded to borrower's reputation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Repayment */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Repayment & Claims</h3>
                  <p className="text-gray-700 mb-3">
                    Borrower repays at their own pace:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Repayments deposited to contract</li>
                    <li>• Lenders claim proportional shares using claim tokens</li>
                    <li>• Successful repayments boost borrower's reputation score</li>
                    <li>• Partial defaults tracked but don't prevent future borrowing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vouching Mechanics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Vouching Mechanics</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens When You Contribute</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Contributing isn't just transferring money—it's a verifiable on-chain signal that you trust this person.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your contribution is weighted by your social proximity to the borrower. A $10 contribution from a close
              friend carries more trust signal than $100 from a stranger. This prevents Sybil attacks and gaming.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">🎯 Algorithmic Weighting</h4>
              <p className="text-sm text-gray-600">
                Each contribution's trust value = (Amount × Social Proximity Factor × Lender Reputation)
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">🔗 Cumulative Trust</h4>
              <p className="text-sm text-gray-600">
                Trust scores accumulate across all contributions. More vouchers from your close network = higher total trust.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">🛡️ Sybil Resistance</h4>
              <p className="text-sm text-gray-600">
                Creating fake accounts doesn't work—they have no social proximity to you and carry zero weight.
              </p>
            </div>
          </div>
        </section>

        {/* Reputation System */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Reputation System</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Your reputation score is separate from trust scores. Trust scores measure your current social validation.
            Reputation measures your historical creditworthiness over time.
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How Reputation Accrues</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📈</div>
                <div>
                  <div className="font-bold text-gray-900">Successful Repayments</div>
                  <p className="text-sm text-gray-600">
                    On-time or early repayments boost your reputation significantly. This unlocks larger loan amounts
                    and better terms in the future.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⏱️</div>
                <div>
                  <div className="font-bold text-gray-900">Partial Repayments</div>
                  <p className="text-sm text-gray-600">
                    Repaying even part of a loan maintains positive reputation. We understand life happens.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🔄</div>
                <div>
                  <div className="font-bold text-gray-900">Multiple Loans</div>
                  <p className="text-sm text-gray-600">
                    Each successful loan compounds your reputation. Borrowers who consistently repay become eligible
                    for larger amounts and potentially interest-bearing loans in the future.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">The Formula</h4>
            <p className="text-gray-700 mb-3">
              Reputation Score = Weighted sum of:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>• Total amount borrowed over time</li>
              <li>• Repayment ratio (amount repaid / amount borrowed)</li>
              <li>• Timeliness of repayments</li>
              <li>• Number of unique lenders who've trusted you</li>
              <li>• Network effects (how your borrowers/lenders perform)</li>
            </ul>
          </div>
        </section>

        {/* Risk & Defaults */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Risk & Default Handling</h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens If Someone Doesn't Repay?</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We're starting with 0% interest and pure community trust. This means lenders are giving, not investing.
              Defaults hurt, but they're part of building the data set needed for algorithmic risk assessment.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Defaults are tracked on-chain and impact borrower reputation, but we don't prevent future borrowing.
              Redemption is possible—borrowers can rebuild reputation through smaller, successful loans.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">📊 Default Tracking</h4>
              <p className="text-sm text-gray-600">
                All repayment behavior is permanently on-chain. Future lenders can see your full history before
                contributing.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">⚖️ No Legal Recourse (Yet)</h4>
              <p className="text-sm text-gray-600">
                Phase 1 (now) is pure community lending. No collections, no credit bureaus. As we scale, we may
                integrate optional credit reporting for borrowers who want to build traditional credit.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">🔮 Future: Hybrid Underwriting</h4>
              <p className="text-sm text-gray-600">
                As we gather repayment data, we'll build predictive models that enable sustainable interest-bearing
                loans. Social trust + behavioral data = accurate risk pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Stack</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">🔗 Blockchain</h4>
              <p className="text-sm text-gray-600 mb-2">Base L2 (Ethereum)</p>
              <p className="text-xs text-gray-500">Low fees, fast finality, Ethereum security</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">💎 Smart Contracts</h4>
              <p className="text-sm text-gray-600 mb-2">Solidity, Factory Pattern</p>
              <p className="text-xs text-gray-500">One contract per loan, trustless execution</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">🪪 Identity</h4>
              <p className="text-sm text-gray-600 mb-2">Farcaster Protocol</p>
              <p className="text-xs text-gray-500">Verifiable social identities, graph traversal</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">💰 Stablecoin</h4>
              <p className="text-sm text-gray-600 mb-2">USDC on Base</p>
              <p className="text-xs text-gray-500">Dollar-denominated, low volatility</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">🌐 Frontend</h4>
              <p className="text-sm text-gray-600 mb-2">Next.js, Wagmi, Viem</p>
              <p className="text-xs text-gray-500">Modern React, wallet connections</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">📊 Trust Scoring</h4>
              <p className="text-sm text-gray-600 mb-2">Off-chain computation, on-chain verification</p>
              <p className="text-xs text-gray-500">Graph algorithms, cryptographic proofs</p>
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
