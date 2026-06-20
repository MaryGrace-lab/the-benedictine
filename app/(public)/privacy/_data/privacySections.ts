export interface PrivacySection {
  iconKey: string;
  title: string;
  content: string[];
}

export const privacySections: PrivacySection[] = [
  {
    iconKey: 'shield',
    title: 'Information We Collect',
    content: [
      'Personal information (name, email address, phone number, home address)',
      'Academic records and student performance data',
      'Payment and transaction history',
      'Technical data (IP address, browser type, device information)',
      'Communication preferences and correspondence',
    ],
  },
  {
    iconKey: 'lock',
    title: 'How We Use Your Information',
    content: [
      'To process admissions and enrollment applications',
      'To communicate school updates, announcements, and emergency notifications',
      'To maintain academic records and generate reports',
      'To process fees and other financial transactions',
      'To improve our educational services and website experience',
    ],
  },
  {
    iconKey: 'eye',
    title: 'Information Sharing & Disclosure',
    content: [
      'We do not sell or rent personal information to third parties',
      'Information may be shared with teachers and staff for educational purposes',
      'We may disclose information to comply with legal obligations',
      'Third-party service providers (payment processors, cloud storage) under confidentiality agreements',
    ],
  },
  {
    iconKey: 'database',
    title: 'Data Security',
    content: [
      'We implement industry-standard security measures to protect your data',
      'All sensitive information is encrypted during transmission',
      'Regular security audits and updates are performed',
      'Access to personal data is restricted to authorized personnel only',
    ],
  },
  {
    iconKey: 'cookie',
    title: 'Cookies & Tracking',
    content: [
      'We use cookies to enhance website functionality and user experience',
      'Analytics cookies help us understand how visitors use our site',
      'You can disable cookies through your browser settings',
      'Essential cookies cannot be disabled as they enable core site functions',
    ],
  },
  {
    iconKey: 'mail',
    title: 'Your Rights',
    content: [
      'Access and review your personal information',
      'Request corrections to inaccurate data',
      'Request deletion of your data (subject to legal retention requirements)',
      'Opt-out of marketing communications',
      'Data portability in a structured format',
    ],
  },
];

export const contactInfo = {
  email: 'thebenedictineacademy@gmail.com',
  phone: '+234 705 944 3788',
  address: '37, Old Mechanic Road, Off Siluko Road, Benin City.',
};

export const privacyMetadata = {
  lastUpdated: 'April 2026',
};