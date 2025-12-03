import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | LendFriend",
  description: "LendFriend Privacy Policy - How we collect, use, and protect your data",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: December 3, 2025</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              LendFriend ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our community lending platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Wallet Information</h3>
            <p className="text-gray-600 mb-4">
              When you connect your wallet, we collect your public wallet address. This is used to identify your account and track your lending and borrowing activity on the platform.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Connected Platform Data</h3>
            <p className="text-gray-600 mb-4">
              When you connect third-party platforms (such as Shopify, Stripe, or Square), we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Aggregated revenue totals</li>
              <li>Order/transaction counts</li>
              <li>Account connection status</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>We do not collect or store personal customer information</strong> from your connected platforms, such as customer names, emails, addresses, or payment details.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Farcaster Profile</h3>
            <p className="text-gray-600 mb-4">
              If you connect your Farcaster account, we may display your public profile information (username, display name, profile picture) on the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Calculate your Trust Score based on business revenue metrics</li>
              <li>Display your profile and lending history on the platform</li>
              <li>Facilitate loan creation, funding, and repayment</li>
              <li>Improve our services and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-600 mb-4">
              Your data is stored securely using industry-standard encryption:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li><strong>At rest:</strong> Data is encrypted in our database (Supabase)</li>
              <li><strong>In transit:</strong> All connections use HTTPS/TLS encryption</li>
              <li><strong>Access tokens:</strong> Platform OAuth tokens are encrypted before storage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We retain your data for as long as your account is active. When you disconnect a platform or delete your account:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Platform connection data is deleted immediately</li>
              <li>On-chain transaction history remains on the blockchain (immutable)</li>
              <li>Aggregated, anonymized data may be retained for analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Sharing</h2>
            <p className="text-gray-600 mb-4">
              <strong>We do not sell your personal data.</strong> We may share data only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Access the data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Disconnect any connected platforms at any time</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-600 mb-4">
              Our platform integrates with third-party services including Shopify, Stripe, Square, and Farcaster. Each service has its own privacy policy, and we encourage you to review them. We only access the minimum data necessary to calculate your Trust Score.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: privacy@lendfriend.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
