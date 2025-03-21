export interface User {
  id?: number; // Assurez-vous que ce champ est un nombre et non `undefined`
  name: string;
  contactNumber: string;
  email: string;
  status?: string;
  role?: string;
}
export interface UserData {
  user: User; // Contient l'objet utilisateur
}
