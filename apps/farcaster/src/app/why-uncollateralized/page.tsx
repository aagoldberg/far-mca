'use client';

import Link from 'next/link';

export default function WhyUncollateralizedPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/whitepaper"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-4 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Whitepaper
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The Credit Access Gap
          </h1>
          <p className="text-xl md:text-2xl font-light">
            Why Uncollateralized Lending?
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-6 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <p className="text-xl text-gray-700 leading-relaxed border-l-4 border-[#3B9B7F] pl-6">
            Access to credit is a fundamental economic primitive. Yet <strong>every existing model—traditional finance,
            Web2 P2P, and DeFi overcollateralization—has failed to provide fair, accessible, capital-efficient credit</strong> to
            those who need it most. Here's why.
          </p>
        </section>

        {/* Traditional Finance Failures */}
        <section className="mb-16">
          <div className="border-b-2 border-gray-200 pb-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Traditional Finance Failed</h2>
            <p className="text-gray-600 mt-2">Credit scores exclude billions. Predatory rates trap the vulnerable.</p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Credit Bureau Gatekeeping Problem</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>1.7 billion adults globally are "unbanked"</strong> with no access to formal financial services
                (World Bank, 2021). In the U.S. alone, <strong>45 million adults are "credit invisible"</strong>—they
                have no credit file at all (CFPB, 2015). Another <strong>19 million are "unscorable"</strong> due to
                insufficient credit history.
              </p>
              <p className="text-gray-600 leading-relaxed">
                These aren't inherently risky borrowers—they're systematically excluded by a system that requires
                credit history to build credit history. The poorest are locked out by design.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Predatory Interest Rates</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                For those who <em>do</em> qualify, the rates are often extractive:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 mb-4">
                <li>• <strong>Payday loans:</strong> 400% APR average (CFPB data)</li>
                <li>• <strong>Subprime credit cards:</strong> 25-30% APR + fees</li>
                <li>• <strong>Installment loans:</strong> 200-300% APR for small amounts</li>
                <li>• <strong>Buy Now Pay Later:</strong> 10-30% effective monthly rates when fees compound</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                These rates don't reflect risk—they reflect <strong>market power over desperate borrowers</strong>.
                The very people who need affordable credit the most pay the highest prices.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collateral Requirements</h3>
              <p className="text-gray-700 leading-relaxed">
                Traditional secured loans require assets most people don't have: homes, cars, investment portfolios.
                <strong> Unsecured loans require pristine credit history</strong>, creating a Catch-22. The result:
                those with assets get cheap capital; those without pay usury or are excluded entirely.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 pl-6 py-4 mt-8">
              <p className="text-gray-800 font-semibold italic">
                Verdict: Traditional finance optimizes for institutions and the wealthy, not accessibility or fairness.
              </p>
            </div>
          </div>
        </section>

        {/* Web2 P2P Failures */}
        <section className="mb-16">
          <div className="border-b-2 border-gray-200 pb-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Web2 P2P Lending Failed</h2>
            <p className="text-gray-600 mt-2">Platforms extracted value. Lenders got intermediated. Borrowers still paid high rates.</p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Rent Extraction</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Platforms like LendingClub and Prosper were supposed to disintermediate banks and connect
                borrowers directly to lenders. Instead, they became <strong>new intermediaries extracting massive fees</strong>:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 mb-4">
                <li>• <strong>LendingClub:</strong> 1-6% origination fee to borrowers + 1% annual service fee to lenders</li>
                <li>• <strong>Prosper:</strong> 2.4-5% origination fee + 1% annual servicing fee</li>
                <li>• <strong>Upstart:</strong> Up to 12% origination fee on some loans</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                A $5,000 loan could cost $250-$600 in fees before interest. These platforms kept 20-40% of the
                interest spread. <strong>Disintermediation became re-intermediation.</strong>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Still Credit Score Dependent</h3>
              <p className="text-gray-700 leading-relaxed">
                P2P platforms didn't solve the accessibility problem—they <em>replicated it</em>. LendingClub requires
                a minimum 600 FICO score. Prosper requires 640. The credit-invisible were still excluded. These platforms
                became <strong>marketplaces for the already creditworthy</strong>, not solutions for the underbanked.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Institutional Takeover</h3>
              <p className="text-gray-700 leading-relaxed">
                By 2020, <strong>institutional investors (hedge funds, banks) accounted for 95%+ of lending volume</strong>
                on major P2P platforms (WSJ, 2019). The "peer" in peer-to-peer disappeared. Individual lenders were
                crowded out by sophisticated capital seeking yield. The platforms became <em>institutional lending
                marketplaces with P2P branding</em>.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 pl-6 py-4 mt-8">
              <p className="text-gray-800 font-semibold italic">
                Verdict: Web2 P2P promised disintermediation but delivered centralized rent-seeking with better UX.
              </p>
            </div>
          </div>
        </section>

        {/* DeFi Overcollateralization Failures */}
        <section className="mb-16">
          <div className="border-b-2 border-gray-200 pb-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">DeFi Overcollateralized Lending Failed</h2>
            <p className="text-gray-600 mt-2">Requiring 150% collateral isn't lending—it's capital inefficiency masquerading as DeFi.</p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Fundamental Paradox</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Aave, Compound, and similar protocols require you to deposit <strong>$150-200 worth of crypto to
                borrow $100</strong>. This isn't credit expansion—it's <strong>collateralized borrowing for tax
                optimization and leverage trading</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If you already have 150% of the value you want to borrow, <em>you don't need a loan</em>. True credit
                means accessing capital you don't already have. Overcollateralization solves smart contract risk, not
                the credit access problem.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Who This Actually Serves</h3>
              <p className="text-gray-700 mb-3 leading-relaxed">Overcollateralized DeFi lending is useful for:</p>
              <ul className="space-y-2 text-gray-700 ml-6 mb-4">
                <li>• <strong>Leverage traders:</strong> Borrow stablecoins against ETH to go long more ETH</li>
                <li>• <strong>Tax optimizers:</strong> Access liquidity without triggering capital gains</li>
                <li>• <strong>Yield farmers:</strong> Recursive borrowing/lending for APY</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                These are <em>legitimate use cases for crypto-native users</em>, but they're not solving credit access
                for the underbanked, small businesses, or anyone who needs to borrow <em>more</em> than they have.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Capital Efficiency: -50%</h3>
              <p className="text-gray-700 leading-relaxed">
                At 150% collateralization, <strong>every dollar lent requires $1.50 locked</strong>. This is
                capital inefficiency by design. Compare to traditional unsecured lending where every dollar in reserves
                can support $10+ in loans (via fractional reserve banking). DeFi's overcollateralization is
                <strong> 15x less capital efficient</strong>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">No Identity, No Trust, No Progress</h3>
              <p className="text-gray-700 leading-relaxed">
                Overcollateralization exists because DeFi has lacked robust identity and reputation primitives.
                Anonymous addresses can't build credit history. Without reputation, collateral is the only signal
                of creditworthiness. <strong>This is a technical limitation being mistaken for a feature.</strong>
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 pl-6 py-4 mt-8">
              <p className="text-gray-800 font-semibold italic">
                Verdict: DeFi overcollateralization is useful for leverage but useless for credit expansion.
                It's a temporary stopgap until identity and reputation mature.
              </p>
            </div>
          </div>
        </section>

        {/* The Path Forward */}
        <section className="mb-16">
          <div className="border-b-2 border-[#3B9B7F] pb-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">The Path Forward: Reputation-Backed Credit</h2>
          </div>

          <div className="space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Uncollateralized lending isn't radical—it's <strong>how most credit worked for millennia</strong> before
              industrialization. Village lending, trade credit, and community mutual aid all operated on reputation and
              social accountability.
            </p>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">What's Changed</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We now have the tools to make reputation <em>verifiable, portable, and programmable</em>:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Persistent identity:</strong> Farcaster FIDs, ENS, on-chain history
                </li>
                <li>
                  <strong>Multi-signal reputation:</strong> Social graphs (OpenRank), humanity verification
                  (Gitcoin Passport), activity patterns (Neynar scores)
                </li>
                <li>
                  <strong>Transparent accountability:</strong> On-chain repayment records visible to all
                </li>
                <li>
                  <strong>Network effects:</strong> Your reputation travels with you across protocols
                </li>
                <li>
                  <strong>Behavioral data:</strong> Every repayment improves credit models for the entire network
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border-l-4 border-[#3B9B7F] pl-6 py-6">
              <p className="text-xl font-bold text-gray-900 mb-3">
                LendFriend proves that reputation can replace collateral
              </p>
              <p className="text-gray-700 leading-relaxed">
                We're starting with pure social trust at 0% interest to bootstrap behavioral data, then scaling to
                hybrid algorithmic models that combine social reputation with cash flow verification. This is the
                proven path from Prosper, Branch, and Tala—now on-chain, transparent, and community-governed.
              </p>
            </div>
          </div>
        </section>

        {/* The Vision from Ethereum's Founders */}
        <section className="mb-16">
          <div className="border-b-2 border-[#3B9B7F] pb-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">The Vision from Ethereum's Founders</h2>
            <p className="text-gray-600 mt-2">Why reputation-backed credit is the missing primitive of Web3</p>
          </div>

          <div className="space-y-8">
            {/* Quote 1: The Core Problem */}
            <div className="bg-gray-50 border-l-4 border-[#3B9B7F] pl-6 py-6">
              <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                "Web3 today centers around expressing transferable, financialized assets, rather than encoding
                social relationships of trust. Yet <strong>many core economic activities—such as uncollateralized
                lending and building personal brands—are built on persistent, non-transferable relationships</strong>."
              </p>
              <p className="text-sm text-gray-600">
                — Vitalik Buterin & E. Glen Weyl, <em>Decentralized Society: Finding Web3's Soul</em> (2022)
              </p>
            </div>

            {/* Quote 2: The Largest Untapped Market */}
            <div className="bg-gray-50 border-l-4 border-[#3B9B7F] pl-6 py-6">
              <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                "<strong>Perhaps the largest financial value built directly on reputation is credit and
                uncollateralized lending.</strong> Currently, the Web 3 ecosystem cannot replicate even the
                most primitive forms of uncollateralized lending, because all assets are transferable and
                saleable – thus simply forms of collateral."
              </p>
              <p className="text-sm text-gray-600">
                — Vitalik Buterin & E. Glen Weyl, <em>Decentralized Society: Finding Web3's Soul</em> (2022)
              </p>
            </div>

            {/* Quote 3: Reputation as Collateral */}
            <div className="bg-gray-50 border-l-4 border-[#3B9B7F] pl-6 py-6">
              <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                "Education credentials, work history, and rental contracts could serve as a persistent record
                of credit-relevant history... <strong>to seek an undercollateralized loan, reputation will be
                the collateral</strong>."
              </p>
              <p className="text-sm text-gray-600">
                — Vitalik Buterin & E. Glen Weyl, <em>Decentralized Society: Finding Web3's Soul</em> (2022)
              </p>
            </div>

            {/* Quote 4: Portable Reputation */}
            <div className="bg-gray-50 border-l-4 border-[#3B9B7F] pl-6 py-6">
              <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                "Crypto allows you to <strong>earn pseudonymously, and with a recent innovation...would let
                you transfer reputation from one pseudonym to another</strong>."
              </p>
              <p className="text-sm text-gray-600">
                — Balaji Srinivasan, <em>The Tim Ferriss Show</em> (2021)
              </p>
            </div>

            {/* Connection to LendFriend */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-[#2E7D68] pl-6 py-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">LendFriend: Implementing the Vision Today</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Ethereum's founders identified the problem in 2022. LendFriend is building the solution in 2025.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Using <strong>Farcaster's persistent identity (FIDs)</strong>, multi-signal reputation scoring
                (<strong>OpenRank, Neynar, Gitcoin Passport</strong>), and transparent on-chain repayment records,
                we're proving that reputation can replace collateral—starting with pure social trust at 0% interest,
                then scaling to hybrid algorithmic models as behavioral data accumulates.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-[#3B9B7F] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Learn More?</h2>
            <p className="text-lg mb-6 opacity-90">
              See how LendFriend is building reputation-backed credit on Farcaster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/whitepaper"
                className="inline-block px-8 py-3 bg-white text-[#3B9B7F] font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Read Full Whitepaper
              </Link>
              <Link
                href="/about"
                className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-[#3B9B7F] transition-colors"
              >
                About LendFriend
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">LendFriend</h3>
              <p className="text-sm text-gray-400">
                Reputation-backed credit on Farcaster. Start with 0% interest, scale with algorithms.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Learn More</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/whitepaper" className="hover:text-white transition-colors">
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/why-uncollateralized" className="hover:text-white transition-colors">
                    Why Uncollateralized?
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Get Started</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Browse Loans
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="hover:text-white transition-colors">
                    Create Loan
                  </Link>
                </li>
                <li>
                  <Link href="/supporting" className="hover:text-white transition-colors">
                    My Investments
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>Built on Base • Powered by USDC • Secured by Smart Contracts</p>
            <p className="mt-2">Open source • Transparent • Community-governed</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
