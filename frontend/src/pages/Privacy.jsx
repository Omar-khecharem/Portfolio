import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Data Controller',
    content: 'Omar Khecharem\nAriana, Tunisia\nomar.khecharem@isimg.tn',
  },
  {
    title: '2. Information We Collect',
    content: 'When you use this website, we may collect the following information:\n\n• Contact form: name, email address, and message you submit voluntarily.\n• Newsletter: email address when you subscribe.\n• Cookies: technical cookies required for the proper functioning of the site.\n• Analytics: anonymous usage data (page views, time spent, browser type).',
  },
  {
    title: '3. How We Use Your Data',
    content: 'Your data is used exclusively for:\n\n• Responding to your inquiries and messages.\n• Sending you updates about new projects and content (only if subscribed).\n• Improving the website experience based on anonymous usage patterns.\n• Complying with legal obligations.\n\nWe do NOT sell, rent, or share your personal data with third parties.',
  },
  {
    title: '4. Legal Basis (GDPR)',
    content: 'Under the General Data Protection Regulation (GDPR), we process your data based on:\n\n• Consent: when you subscribe to the newsletter or accept cookies.\n• Contractual necessity: when you contact us through the form.\n• Legitimate interest: for website analytics and improvement.',
  },
  {
    title: '5. Data Retention',
    content: 'We retain your personal data only as long as necessary:\n\n• Contact form messages: 2 years after the last communication.\n• Newsletter subscriptions: until you unsubscribe.\n• Analytics data: 26 months.\n\nYou may request deletion of your data at any time by contacting us.',
  },
  {
    title: '6. Cookies',
    content: 'This website uses minimal cookies:\n\n• Essential cookies: required for site functionality (session management).\n• Preference cookies: store your theme selection and cookie consent choice.\n\nWe do not use advertising cookies or third-party tracking cookies. You can manage cookie preferences through your browser settings at any time.',
  },
  {
    title: '7. Your Rights',
    content: 'Under applicable data protection laws, you have the right to:\n\n• Access your personal data.\n• Rectify inaccurate data.\n• Erase your data ("right to be forgotten").\n• Restrict or object to processing.\n• Data portability.\n• Withdraw consent at any time.\n\nTo exercise these rights, contact us at omar.khecharem@isimg.tn.',
  },
  {
    title: '8. Data Security',
    content: 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. This includes HTTPS encryption, secure password hashing, and regular security audits.',
  },
  {
    title: '9. Third-Party Services',
    content: 'This website uses the following third-party services:\n\n• Cloudflare Workers AI: for the chatbot functionality. No personal data is sent to the AI model beyond your chat message.\n• UploadThing: for image hosting. Images are stored on their secure servers.\n• MongoDB Atlas: database hosting (if deployed to production).\n\nEach service provider complies with GDPR and has appropriate data processing agreements in place.',
  },
  {
    title: '10. International Transfers',
    content: 'Your data may be transferred to and processed in countries outside your country of residence. We ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) where required by GDPR.',
  },
  {
    title: '11. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. The latest version will always be available at this URL. Significant changes will be notified via the website or email if you are subscribed to the newsletter.',
  },
  {
    title: '12. Contact',
    content: 'For any questions, concerns, or requests regarding your personal data, please contact:\n\nOmar Khecharem\nEmail: omar.khecharem@isimg.tn\n\nYou also have the right to lodge a complaint with your local data protection authority.',
  },
];

export default function Privacy() {
  return (
    <div className="pt-24">
      <section className="py-section">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-label">Legal</p>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Privacy Policy</h1>
            <p className="text-sm text-text-muted mb-8">Last updated: June 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-sm max-w-none"
          >
            <p className="text-text-muted leading-relaxed mb-10">
              This Privacy Policy describes how Omar Khecharem ("I", "me", "my") collects, uses, and protects your personal data when you visit this portfolio website. I am committed to protecting your privacy and ensuring transparency in how your data is handled.
            </p>

            <div className="space-y-8">
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="border-b border-line pb-6 last:border-0"
                >
                  <h2 className="text-base font-bold text-primary mb-2">{s.title}</h2>
                  {s.content.split('\n').map((line, j) => (
                    <p key={j} className={`text-sm text-text-muted leading-relaxed ${line.startsWith('•') ? 'pl-4' : ''}`}>
                      {line || '\u00A0'}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
