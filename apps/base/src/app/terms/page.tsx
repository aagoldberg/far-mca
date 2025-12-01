export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: December 1, 2024</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing or using LendFriend, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
          <p className="text-gray-700">
            LendFriend is a peer-to-peer micro-lending platform that enables users to create loan requests
            and contribute to loans using cryptocurrency (USDC) on the Base blockchain network.
            We facilitate connections between borrowers and lenders but do not provide financial advice
            or guarantee any loan outcomes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Eligibility</h2>
          <p className="text-gray-700">
            You must be at least 18 years old and legally able to enter into contracts to use LendFriend.
            You are responsible for ensuring your use of the platform complies with all applicable laws
            in your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. User Responsibilities</h2>
          <p className="text-gray-700">As a user of LendFriend, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>Provide accurate information in loan requests</li>
            <li>Make good faith efforts to repay loans according to stated terms</li>
            <li>Not use the platform for fraudulent or illegal purposes</li>
            <li>Secure your wallet and private keys</li>
            <li>Understand the risks of cryptocurrency and DeFi lending</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Risks and Disclaimers</h2>
          <p className="text-gray-700">
            <strong>Lending Risk:</strong> Contributing to loans carries risk. Borrowers may fail to repay,
            and you may lose some or all of your contribution. LendFriend does not guarantee repayment.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Smart Contract Risk:</strong> Our platform uses smart contracts on the Base blockchain.
            While we strive for security, smart contracts may contain bugs or vulnerabilities.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Cryptocurrency Volatility:</strong> While USDC is a stablecoin, cryptocurrency markets
            carry inherent risks including regulatory changes and technical failures.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>No Financial Advice:</strong> LendFriend does not provide financial, investment, or legal advice.
            Consult appropriate professionals before making financial decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Credit Scoring</h2>
          <p className="text-gray-700">
            Our optional credit scoring feature uses connected business data to help lenders assess
            creditworthiness. Credit scores are informational only and do not guarantee loan approval
            or repayment. Users connecting business accounts consent to aggregated data collection
            as described in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Fees</h2>
          <p className="text-gray-700">
            LendFriend may charge platform fees on loans. Current fees are displayed during loan creation.
            Users are responsible for blockchain gas fees (though we may sponsor some transactions).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
          <p className="text-gray-700">
            The LendFriend platform, brand, and associated materials are our intellectual property.
            You may not copy, modify, or distribute our platform without permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
          <p className="text-gray-700">
            We reserve the right to suspend or terminate access to users who violate these terms
            or engage in fraudulent activity. Outstanding loan obligations survive termination.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the maximum extent permitted by law, LendFriend and its operators shall not be liable
            for any indirect, incidental, special, or consequential damages arising from your use
            of the platform, including but not limited to loss of funds, data, or profits.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
          <p className="text-gray-700">
            We may update these Terms of Service at any time. Continued use of the platform after
            changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact</h2>
          <p className="text-gray-700">
            For questions about these Terms of Service, contact us:
          </p>
          <p className="text-gray-700 mt-2">
            Email: support@lendfriend.org<br />
            Farcaster: @andrewg
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <a href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to LendFriend
        </a>
      </div>
    </div>
  );
}
