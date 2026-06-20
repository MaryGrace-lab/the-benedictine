export interface ContactInfoItem {
  iconKey: string;
  label: string;
  value: string;
}

export const contactInfo: ContactInfoItem[] = [
  { 
    iconKey: 'mapPin',
    label: 'Address', 
    value: '37, Old Mechanic Road, Off Siluko Road Egor, Benin City, Edo State, Nigeria.' 
  },
  { 
    iconKey: 'phone',
    label: 'Phone', 
    value: '+234 705 944 3788' 
  },
  { 
    iconKey: 'mail',
    label: 'Email', 
    value: 'thebenedictineacademy@gmail.com' 
  },
];