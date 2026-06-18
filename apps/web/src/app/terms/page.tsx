import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'MotoFin terms and conditions for using our car loan comparison platform.',
  alternates: { canonical: 'https://motofin.in/terms' },
};

export default function TermsPage() {
  return (
    <div className="pt-24">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          <p className="text-slate-400 mt-2 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing and using the MotoFin platform (motofin.in), you agree to be bound
                by these Terms of Service. If you do not agree with any part of these terms, you
                must not use our platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Service Description</h2>
              <p className="text-slate-600 leading-relaxed">
                MotoFin is a car loan comparison platform that provides indicative savings estimates,
                pre-approval probability indications, and connects users with partner banks for
                refinancing. MotoFin is not a bank, NBFC, or financial institution. We act as
                a technology platform facilitating comparison and connection.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Disclaimer</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>All savings estimates are <strong>indicative only</strong> and based on publicly available rate data.</li>
                <li>Actual rates, eligibility, and approval are subject to bank evaluation, documentation, and credit assessment.</li>
                <li>Pre-approval probabilities are statistical estimates and do not guarantee loan approval.</li>
                <li>MotoFin does not guarantee any specific savings amount or approval outcome.</li>
                <li>Final terms and conditions are determined by the lending bank, not MotoFin.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>You must provide accurate and truthful information when using the calculator.</li>
                <li>You must be at least 18 years of age to use our services.</li>
                <li>You must not misuse the platform or attempt unauthorized access.</li>
                <li>You are responsible for maintaining the confidentiality of any communications with partner banks.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                All content, design, logos, and technology on the MotoFin platform are owned by
                MotoFin Technologies Pvt. Ltd. and protected by intellectual property laws. You
                may not copy, reproduce, or distribute any part of our platform without written consent.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                MotoFin shall not be liable for any direct, indirect, incidental, or consequential
                damages arising from your use of the platform. Our liability is limited to the
                extent permitted by applicable Indian law. We are not liable for any decisions
                you make based on our indicative estimates.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Third-Party Services</h2>
              <p className="text-slate-600 leading-relaxed">
                Our platform connects you with third-party banks and financial institutions.
                Your relationship with these banks is governed by their respective terms and
                conditions. MotoFin is not responsible for the actions, policies, or services
                of partner banks.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Communication Consent</h2>
              <p className="text-slate-600 leading-relaxed">
                By submitting a callback request, you consent to receiving phone calls and SMS
                from MotoFin and/or partner banks regarding your refinancing inquiry. You can
                opt out at any time by informing the caller or contacting support@motofin.in.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Modifications</h2>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be posted
                on this page with an updated date. Continued use of the platform after changes
                constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">10. Governing Law</h2>
              <p className="text-slate-600 leading-relaxed">
                These terms are governed by the laws of India. Any disputes shall be subject to
                the exclusive jurisdiction of courts in Hyderabad, Telangana.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">11. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                For questions about these terms, contact us at:<br />
                Email: legal@motofin.in<br />
                Address: MotoFin Technologies Pvt. Ltd., Hyderabad, Telangana, India
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
