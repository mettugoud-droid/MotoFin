import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'MotoFin privacy policy. How we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://motofin.in/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="pt-24">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-slate-400 mt-2 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate prose-sm">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                MotoFin Technologies Pvt. Ltd. (&ldquo;MotoFin,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting
                your personal information. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your data when you use our platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed mb-3">We collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong>Loan Details:</strong> Current EMI, outstanding amount, interest rate, and tenure — used to calculate your savings.</li>
                <li><strong>Contact Information:</strong> Name, mobile number, city, and current bank — collected only when you request a callback.</li>
                <li><strong>Usage Data:</strong> Browser type, device information, pages visited, and interaction patterns — collected automatically via cookies.</li>
                <li><strong>IP Address:</strong> For security, fraud prevention, and approximate geographic location.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Calculate and display your EMI savings estimates</li>
                <li>Generate pre-approval probability indications</li>
                <li>Connect you with partner banks when you request a callback</li>
                <li>Send service-related communications (callback confirmations, etc.)</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Data Sharing</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                We do <strong>not</strong> sell your personal data. We share information only in the following cases:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong>Partner Banks:</strong> When you explicitly request a callback, we share your contact details and loan information with relevant banks.</li>
                <li><strong>Service Providers:</strong> Analytics, hosting, and communication services that help us operate the platform (bound by confidentiality agreements).</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government authority.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Data Security</h2>
              <p className="text-slate-600 leading-relaxed">
                We use 256-bit SSL encryption (bank-grade security) for all data in transit.
                Data at rest is encrypted using AES-256. We follow industry best practices for
                access control, monitoring, and incident response.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Data Retention</h2>
              <p className="text-slate-600 leading-relaxed">
                Calculator session data is retained for 90 days. Lead information is retained
                for 2 years or until you request deletion. You can request deletion of your
                data at any time by contacting us at privacy@motofin.in.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Access your personal data we hold</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                We use essential cookies to operate the platform and analytics cookies to
                understand usage patterns. You can control cookie preferences through your
                browser settings. Disabling essential cookies may affect platform functionality.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                For privacy-related questions or data requests, contact our Data Protection Officer at:
              </p>
              <p className="text-slate-600 mt-2">
                Email: privacy@motofin.in<br />
                Phone: +91-8000000000<br />
                Address: MotoFin Technologies Pvt. Ltd., Hyderabad, Telangana, India
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
