export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: December 1, 2024</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
          <p className="text-gray-700">
            LendFriend ("we", "our", or "us") is a peer-to-peer micro-lending platform built on blockchain technology.
            This Privacy Policy explains how we collect, use, and protect information when you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>

          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Blockchain Data</h3>
          <p className="text-gray-700">
            We collect publicly available blockchain data including wallet addresses and transaction history
            on the Base network. This data is already public on the blockchain.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Farcaster Profile</h3>
          <p className="text-gray-700">
            If you connect via Farcaster, we access your public profile information (username, display name,
            profile picture, FID) to display your identity in the app.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Business Platform Connections (Optional)</h3>
          <p className="text-gray-700">
            If you choose to connect business platforms like Shopify, Stripe, or Square for credit scoring purposes,
            we collect <strong>aggregated business metrics only</strong>:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>Total revenue over specified periods</li>
            <li>Order/transaction counts</li>
            <li>Average order values</li>
          </ul>
          <p className="text-gray-700 mt-2">
            <strong>We do NOT collect or store:</strong> Individual customer names, email addresses,
            physical addresses, payment details, or other personally identifiable information from your customers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>To facilitate loan creation and funding on the platform</li>
            <li>To calculate creditworthiness scores for loan applications</li>
            <li>To display your profile and loan history to potential lenders</li>
            <li>To send notifications about your loans (contributions, repayments)</li>
            <li>To improve our services and user experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Storage & Security</h2>
          <p className="text-gray-700">
            Your data is stored securely using industry-standard encryption. Business connection tokens
            are encrypted at rest. We use secure, reputable cloud infrastructure providers.
          </p>
          <p className="text-gray-700 mt-2">
            Loan data and transactions are stored on the Base blockchain, which is immutable and publicly accessible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Sharing</h2>
          <p className="text-gray-700">
            We do not sell your personal information. We may share aggregated, anonymized data for
            analytics purposes. Business metrics you connect are used solely for your credit score
            calculation and are not shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h2>
          <p className="text-gray-700">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li><strong>Access:</strong> Request a copy of data we hold about you</li>
            <li><strong>Disconnect:</strong> Remove connected business platforms at any time</li>
            <li><strong>Delete:</strong> Request deletion of your off-chain data (note: blockchain data cannot be deleted)</li>
          </ul>
          <p className="text-gray-700 mt-2">
            To exercise these rights, contact us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
          <p className="text-gray-700">
            Our app integrates with third-party services including Farcaster, Shopify, Stripe, and Square.
            Your use of these services is governed by their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify users of significant
            changes through the app or via Farcaster notifications.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <p className="text-gray-700 mt-2">
            Email: privacy@lendfriend.org<br />
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
