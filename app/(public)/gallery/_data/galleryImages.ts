export interface GalleryImage {
  id: number;
  title: string;
  category: string;
  src: string;
}

export const galleryImages: GalleryImage[] = [
  { id: 1, title: 'Main School Building', category: 'School', src: '/1.jpg' },
  { id: 2, title: 'Science Laboratory', category: 'Academic', src: '/science.png' },
  { id: 3, title: 'Annual Excursion', category: 'Events', src: '/excursion1.jpg' },
  { id: 4, title: 'Annual Excursion', category: 'Events', src: '/excursion2.jpg' },
  { id: 5, title: 'Annual Excursion', category: 'Events', src: '/excursion3.jpg' },
  { id: 6, title: 'Home Economics Practical', category: 'Academic', src: '/econs-practical-1.jpg' },
  { id: 7, title: 'Home Economics Practical', category: 'Academic', src: '/econs-practical-2.jpg' },
  { id: 8, title: 'Soap Production Practical', category: 'Academic', src: '/soap-practical.jpg' },
  { id: 9, title: 'Classroom', category: 'Facilities', src: '/classroom.jpg' },
  { id: 10, title: 'Computer Lab', category: 'Facilities', src: '/computer-lab.jpg' },
  { id: 11, title: 'Computer Lab Practical', category: 'Facilities', src: '/computer-lab-2.jpg' },
  { id: 12, title: 'Music Room', category: 'Facilities', src: '/music.jpg' },
];

export const categories = ['All', 'School', 'Academic', 'Facilities', 'Events'];