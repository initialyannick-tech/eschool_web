export interface Salle {
  id?: number;
  code: string;
  nom: string;
  capacite: number;
  type?: string;
  actif?: boolean;
  created_at?: string;
  updated_at?: string;
}
