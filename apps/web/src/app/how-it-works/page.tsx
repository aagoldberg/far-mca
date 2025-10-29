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
            <h4 className="font-bold text-gray-900 mb-3">The Algorithm</h4>

            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900 mb-2">Step 1: Identify Mutual Connections</div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 mb-2">
                    Let B = borrower's social network (followers ∪ following)<br/>
                    Let L = lender's social network (followers ∪ following)<br/>
                    Let M = |B ∩ L| = count of mutual connections
                  </p>
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900 mb-2">Step 2: Quality Weighting</div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 mb-3">
                    Filter spam/bots using identity quality scores (0-1 scale):
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                    Q<sub>avg</sub> = (Q<sub>borrower</sub> + Q<sub>lender</sub>) / 2
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs mt-2">
                    M<sub>effective</sub> = M × Q<sub>avg</sub>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900 mb-2">Step 3: Calculate Social Distance Score (0-100)</div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 mb-3">The score has three components:</p>

                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="font-semibold text-blue-900 mb-1">Base Score (max 60 points)</div>
                      <div className="text-xs text-blue-800">
                        Based on effective mutual connections:<br/>
                        • M<sub>eff</sub> ≥ 18 → 60 points<br/>
                        • M<sub>eff</sub> ≥ 9 → 50 points<br/>
                        • M<sub>eff</sub> ≥ 4.5 → 35 points<br/>
                        • M<sub>eff</sub> ≥ 2.5 → 20 points<br/>
                        • M<sub>eff</sub> ≥ 0.8 → 10 points
                      </div>
                    </div>

                    <div className="bg-purple-50 p-3 rounded">
                      <div className="font-semibold text-purple-900 mb-1">Overlap Bonus (max 30 points)</div>
                      <div className="text-xs text-purple-800">
                        P<sub>overlap</sub> = (M / min(|B|, |L|)) × 100<br/>
                        Bonus = min(P<sub>overlap</sub> × 3, 30) if P<sub>overlap</sub> &gt; 10%
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded">
                      <div className="font-semibold text-green-900 mb-1">Mutual Follow Bonus (max 10 points)</div>
                      <div className="text-xs text-green-800">
                        • Both follow each other → +10 points<br/>
                        • One-way follow → +5 points
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded font-mono text-xs mt-3">
                    S<sub>total</sub> = min(S<sub>base</sub> + S<sub>overlap</sub> + S<sub>mutual</sub>, 100)
                  </div>
                </div>
              </div>
            </div>

            <h4 className="font-bold text-gray-900 mb-3 mt-6">Risk Tier Classification</h4>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <div className="font-bold text-green-900">LOW RISK</div>
                <p className="text-sm text-green-800">M<sub>eff</sub> ≥ 9 OR S<sub>total</sub> ≥ 60</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                <div className="font-bold text-yellow-900">MEDIUM RISK</div>
                <p className="text-sm text-yellow-800">M<sub>eff</sub> ≥ 2.5 OR S<sub>total</sub> ≥ 30</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <div className="font-bold text-red-900">HIGH RISK</div>
                <p className="text-sm text-red-800">M<sub>eff</sub> &lt; 2.5 AND S<sub>total</sub> &lt; 30</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Loan-Level Support Strength</h4>
            <p className="text-gray-700 mb-3">
              For the entire loan, we aggregate proximity across all lenders:
            </p>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                    N<sub>connected</sub>
                  </div>
                  <div>= number of lenders with social connections to borrower</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                    N<sub>total</sub>
                  </div>
                  <div>= total number of lenders</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                    P<sub>network</sub>
                  </div>
                  <div>= (N<sub>connected</sub> / N<sub>total</sub>) × 100</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div><strong>STRONG:</strong> P<sub>network</sub> ≥ 60%</div>
                <div><strong>MODERATE:</strong> 30% ≤ P<sub>network</sub> &lt; 60%</div>
                <div><strong>WEAK:</strong> 0% &lt; P<sub>network</sub> &lt; 30%</div>
                <div><strong>NONE:</strong> P<sub>network</sub> = 0%</div>
              </div>
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
                    A factory contract deploys individual loan contracts with the following constraints:
                  </p>
                  <div className="bg-gray-50 rounded p-4 mb-3">
                    <div className="space-y-2 text-sm text-gray-700">
                      <div>• <strong>Minimum principal:</strong> P<sub>min</sub> = $100</div>
                      <div>• <strong>Loan duration:</strong> 7 days ≤ D ≤ 365 days</div>
                      <div>• <strong>Disbursement window:</strong> 14 days after funding</div>
                      <div>• <strong>Restriction:</strong> One active loan per borrower</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Each loan gets its own smart contract with parameters: principal P, maturity date T<sub>maturity</sub>, borrower address, and verified Farcaster ID.
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
                    Lenders send funds to the contract. Each contribution updates:
                  </p>
                  <div className="bg-gray-50 rounded p-4 mb-3">
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="font-mono text-xs bg-white p-2 rounded border border-gray-200">
                        C<sub>lender</sub> ← C<sub>lender</sub> + amount
                      </div>
                      <div className="font-mono text-xs bg-white p-2 rounded border border-gray-200">
                        R<sub>total</sub> ← R<sub>total</sub> + amount
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Where C<sub>lender</sub> = cumulative contribution from this lender<br/>
                        And R<sub>total</sub> = total raised across all lenders
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Trust scores are calculated off-chain and displayed in the UI. The contract only tracks capital flow.
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
                  <div className="bg-gray-50 rounded p-4 mb-3">
                    <div className="space-y-2 text-sm text-gray-700">
                      <div><strong>Condition 1:</strong> R<sub>total</sub> ≥ P (fully funded)</div>
                      <div><strong>Condition 2:</strong> T<sub>current</sub> ≤ T<sub>deadline</sub> + 14 days</div>
                      <div><strong>Condition 3:</strong> Funds not yet disbursed</div>
                      <div className="pt-2 border-t border-gray-300 mt-2">
                        <strong>Action:</strong> Transfer R<sub>total</sub> to borrower
                      </div>
                    </div>
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
                    Borrower repays flexibly. Lenders claim their pro-rata share using an <strong>accumulator pattern</strong> for gas efficiency:
                  </p>

                  <div className="bg-gray-50 rounded p-4 mb-3">
                    <div className="font-semibold text-gray-900 mb-2">On Each Repayment:</div>
                    <div className="bg-white p-3 rounded border border-gray-200 font-mono text-xs mb-3">
                      A ← A + (r × k) / P
                    </div>
                    <div className="text-xs text-gray-600 mb-4">
                      Where:<br/>
                      • A = accumulator (tracks total repaid per $1 of principal)<br/>
                      • r = repayment amount<br/>
                      • k = precision constant (10<sup>18</sup>)<br/>
                      • P = original principal
                    </div>

                    <div className="font-semibold text-gray-900 mb-2 pt-3 border-t border-gray-300">Claimable Amount per Lender:</div>
                    <div className="bg-white p-3 rounded border border-gray-200 font-mono text-xs mb-3">
                      Claimable = (C<sub>lender</sub> × A) / k − D<sub>lender</sub>
                    </div>
                    <div className="text-xs text-gray-600">
                      Where:<br/>
                      • C<sub>lender</sub> = lender's contribution<br/>
                      • D<sub>lender</sub> = amount already claimed by lender<br/>
                      • Result is proportional to contribution share
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    This approach calculates pro-rata shares in O(1) time per lender, rather than iterating over all lenders.
                    Overpayments automatically distribute as bonuses.
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
            <h4 className="font-bold text-gray-900 mb-3">Displayed Information</h4>
            <p className="text-gray-700 mb-3">
              The UI calculates and displays for each lender-borrower pair:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">M</div>
                <div className="text-xs text-gray-600">Mutual connections count</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">S<sub>total</sub></div>
                <div className="text-xs text-gray-600">Social distance score (0-100)</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">Risk Tier</div>
                <div className="text-xs text-gray-600">LOW / MEDIUM / HIGH</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">P<sub>network</sub></div>
                <div className="text-xs text-gray-600">Loan-level support %</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              All calculations run off-chain with a 30-minute cache. Results guide lender decisions but don't affect smart contract logic.
            </p>
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
              Each loan contract permanently stores:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">P</div>
                <div className="text-xs text-gray-600">Principal requested</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">R<sub>total</sub></div>
                <div className="text-xs text-gray-600">Total raised</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">R<sub>paid</sub></div>
                <div className="text-xs text-gray-600">Total repaid</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">T<sub>maturity</sub></div>
                <div className="text-xs text-gray-600">Maturity timestamp</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">C<sub>i</sub></div>
                <div className="text-xs text-gray-600">Each lender's contribution</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-sm text-gray-900">D<sub>i</sub></div>
                <div className="text-xs text-gray-600">Each lender's claims</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Factory contract enforces: one active loan per borrower at a time
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Planned Reputation Formula</h3>
            <p className="text-gray-700 mb-4">
              Once we have sufficient repayment data (target: 100+ loans), reputation will be calculated as a weighted score:
            </p>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="font-mono text-sm mb-3">
                Rep = w₁·Ratio + w₂·Time + w₃·Count + w₄·Trust + w₅·Volume
              </div>
              <div className="text-xs text-gray-600 space-y-2">
                <div className="border-l-2 border-purple-300 pl-3">
                  <strong>Ratio</strong> = Σ(R<sub>paid</sub>) / Σ(R<sub>total</sub>) across all loans
                </div>
                <div className="border-l-2 border-purple-300 pl-3">
                  <strong>Time</strong> = avg(T<sub>repay</sub> − T<sub>maturity</sub>) normalized to [-1, 1]<br/>
                  <span className="text-[10px]">(early = positive, late = negative)</span>
                </div>
                <div className="border-l-2 border-purple-300 pl-3">
                  <strong>Count</strong> = log(N<sub>loans</sub> + 1) to reward repeated success
                </div>
                <div className="border-l-2 border-purple-300 pl-3">
                  <strong>Trust</strong> = avg(P<sub>network</sub>) across all loans
                </div>
                <div className="border-l-2 border-purple-300 pl-3">
                  <strong>Volume</strong> = log(Σ(P) + 1) total principal borrowed
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Proposed Weights (subject to tuning):</div>
              <div className="grid grid-cols-5 gap-2 text-xs text-center">
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-bold">w₁ = 40%</div>
                  <div className="text-[10px] text-gray-600">Repayment</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-bold">w₂ = 30%</div>
                  <div className="text-[10px] text-gray-600">Timing</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-bold">w₃ = 15%</div>
                  <div className="text-[10px] text-gray-600">Count</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-bold">w₄ = 10%</div>
                  <div className="text-[10px] text-gray-600">Trust</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-bold">w₅ = 5%</div>
                  <div className="text-[10px] text-gray-600">Volume</div>
                </div>
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
            <h4 className="font-bold text-gray-900 mb-3">Key Parameters</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="font-semibold text-gray-900">Cache TTL</div>
                <div className="text-xs text-gray-600">30 minutes for trust scores</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="font-semibold text-gray-900">Gas Optimization</div>
                <div className="text-xs text-gray-600">O(1) repayment distribution</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="font-semibold text-gray-900">Precision</div>
                <div className="text-xs text-gray-600">k = 10<sup>18</sup> for fixed-point math</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="font-semibold text-gray-900">Network Fees</div>
                <div className="text-xs text-gray-600">~$0.01 per transaction on Base L2</div>
              </div>
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
