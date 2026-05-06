import { MapPin, Phone, Mail } from 'lucide-react';
import { ReactNode } from 'react';

export interface ContactInfoItem {
  icon: ReactNode;
  label: string;
  value: string;
}

export const contactInfo: ContactInfoItem[] = [
  { 
    icon: <MapPin className="w-5 h-5" />, 
    label: 'Address', 
    value: '37, Old Mechanic Road, Off Siluko Road Egor, Benin City, Edo State, Nigeria.' 
  },
  { 
    icon: <Phone className="w-5 h-5" />, 
    label: 'Phone', 
    value: '+234 705 944 3788' 
  },
  { 
    icon: <Mail className="w-5 h-5" />, 
    label: 'Email', 
    value: 'thebenedictineacademy@gmail.com' 
  },
];