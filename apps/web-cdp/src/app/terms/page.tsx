import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | LendFriend",
  description: "LendFriend Terms of Service - Rules and guidelines for using our platform",
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: December 3, 2025</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using LendFriend ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              LendFriend is a community lending platform that facilitates interest-free loans between community members. The Platform:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Allows users to create loan requests</li>
              <li>Enables community members to fund loans</li>
              <li>Calculates Trust Scores based on connected business data</li>
              <li>Facilitates loan repayments through smart contracts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Eligibility</h2>
            <p className="text-gray-600 mb-4">
              To use LendFriend, you must:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Be at least 18 years of age</li>
              <li>Have legal capacity to enter into contracts</li>
              <li>Have a compatible cryptocurrency wallet</li>
              <li>Comply with all applicable laws in your jurisdiction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Borrowers</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Provide accurate information in loan requests</li>
              <li>Use borrowed funds for stated purposes</li>
              <li>Make timely repayments according to loan terms</li>
              <li>Maintain accurate connected platform data</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Lenders</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Understand the risks of lending (see Section 7)</li>
              <li>Only lend amounts you can afford to lose</li>
              <li>Conduct your own due diligence on borrowers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Trust Score</h2>
            <p className="text-gray-600 mb-4">
              The Trust Score is calculated based on data from connected business platforms. It is provided for informational purposes only and:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Is not a credit score or credit rating</li>
              <li>Does not guarantee loan repayment</li>
              <li>Should not be the sole factor in lending decisions</li>
              <li>May not reflect current financial circumstances</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Smart Contracts</h2>
            <p className="text-gray-600 mb-4">
              Loans on LendFriend are facilitated through smart contracts on the blockchain. By using the Platform, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Smart contract transactions are irreversible</li>
              <li>You are responsible for verifying transaction details before confirming</li>
              <li>Gas fees and network costs are your responsibility</li>
              <li>Smart contracts may contain bugs despite our best efforts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Risk Disclosure</h2>
            <p className="text-gray-600 mb-4 font-semibold">
              LENDING ON LENDFRIEND CARRIES SIGNIFICANT RISKS:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li><strong>Default Risk:</strong> Borrowers may fail to repay loans</li>
              <li><strong>Smart Contract Risk:</strong> Technical vulnerabilities could result in loss of funds</li>
              <li><strong>Cryptocurrency Risk:</strong> Value of USDC or other tokens may fluctuate</li>
              <li><strong>Regulatory Risk:</strong> Laws governing cryptocurrency lending may change</li>
              <li><strong>No Insurance:</strong> Funds are not insured by any government agency</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Only lend amounts you can afford to lose entirely.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Prohibited Activities</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Provide false or misleading information</li>
              <li>Use the Platform for money laundering or illegal activities</li>
              <li>Manipulate Trust Scores or platform data</li>
              <li>Interfere with the Platform&apos;s operation</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LENDFRIEND AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF FUNDS, DATA, OR PROFITS, ARISING FROM YOUR USE OF THE PLATFORM.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Not Financial Advice</h2>
            <p className="text-gray-600 mb-4">
              Nothing on this Platform constitutes financial, investment, legal, or tax advice. You should consult with appropriate professionals before making any financial decisions. We are not a bank, financial institution, or licensed lender.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Modifications</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting to the Platform. Your continued use of the Platform constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may suspend or terminate your access to the Platform at any time for violation of these Terms or for any other reason at our discretion. Outstanding loan obligations survive termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which LendFriend operates, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">15. Contact</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: legal@lendfriend.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
