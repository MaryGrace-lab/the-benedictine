export interface CoreValue {
  name: string;
  iconKey: string;   // plain string, not a component
}

export const coreValues: CoreValue[] = [
  { name: 'Faith',      iconKey: 'heart' },
  { name: 'Discipline', iconKey: 'shield' },
  { name: 'Excellence', iconKey: 'star' },
  { name: 'Integrity',  iconKey: 'handshake' },
  { name: 'Service',    iconKey: 'heartHandshake' },
];