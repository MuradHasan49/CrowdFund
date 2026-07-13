export interface User {
  id: string;
  name: string;
  email: string;
  role: 'supporter' | 'creator' | 'admin';
  credits: number;
  isActive: boolean;
  photoURL?: string;
  createdAt: string;
}
