export interface TermsSection {
  iconKey: string;
  title: string;
  content: string[];
}

export const termsSections: TermsSection[] = [
  {
    iconKey: 'bookOpen',
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using The Benedictine Academy website, you agree to be bound by these Terms of Service.',
      'If you do not agree with any part of these terms, please do not use our website or services.',
      'These terms apply to all visitors, users, parents, guardians, and students.',
    ],
  },
  {
    iconKey: 'users',
    title: 'User Accounts & Registration',
    content: [
      'You must provide accurate and complete information when creating an account.',
      'You are responsible for maintaining the confidentiality of your login credentials.',
      'You agree to notify us immediately of any unauthorized use of your account.',
      'We reserve the right to suspend or terminate accounts that violate these terms.',
      'Each user is responsible for all activities that occur under their account.',
    ],
  },
  {
    iconKey: 'creditCard',
    title: 'Payments & Fees',
    content: [
      'School fees and other charges are due according to the published schedule.',
      'All payments must be made through approved payment channels.',
      'Late payments may result in additional fees or suspension of services.',
      'Refunds are governed by our refund policy as outlined in the school handbook.',
      'We reserve the right to modify fees with reasonable advance notice.',
    ],
  },
  {
    iconKey: 'shieldCheck',
    title: 'Code of Conduct',
    content: [
      'Users must treat all school community members with respect and dignity.',
      'Harassment, bullying, or discriminatory behavior is strictly prohibited.',
      'Students must adhere to the school`s dress code and behavioral standards.',
      'Parents are expected to communicate respectfully with staff and faculty.',
      'Violations may result in disciplinary action including account termination.',
    ],
  },
  {
    iconKey: 'scale',
    title: 'Intellectual Property',
    content: [
      'All content on this website is the property of The Benedictine Academy.',
      'You may not reproduce, distribute, or modify content without written permission.',
      'The school logo, name, and branding are protected trademarks.',
      'Educational materials are for personal, non-commercial use only.',
      'Unauthorized use of intellectual property may result in legal action.',
    ],
  },
  {
    iconKey: 'alertCircle',
    title: 'Limitation of Liability',
    content: [
      'The Benedictine Academy is not liable for indirect or consequential damages.',
      'We do not guarantee uninterrupted or error-free access to our services.',
      'You assume all risks associated with using our website and services.',
      'Our liability is limited to the maximum extent permitted by law.',
      'We are not responsible for third-party content or links on our site.',
    ],
  },
  {
    iconKey: 'messageSquare',
    title: 'Communication & Notifications',
    content: [
      'By using our services, you consent to receive electronic communications from us.',
      'Important notifications will be sent via email, SMS, or through the parent portal.',
      'You agree to keep your contact information current.',
      'Emergency notifications may be sent to registered phone numbers.',
      'It is your responsibility to regularly check for updates and announcements.',
    ],
  },
  {
    iconKey: 'globe',
    title: 'Governing Law',
    content: [
      'These terms are governed by the laws of the Federal Republic of Nigeria.',
      'Any disputes shall be resolved in the courts of Benin City, Nigeria.',
      'We reserve the right to modify these terms at any time.',
      'Continued use of our services constitutes acceptance of modified terms.',
      'If any provision is found unenforceable, remaining provisions remain in effect.',
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