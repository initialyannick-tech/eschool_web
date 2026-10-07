import {Eleve} from './eleve';

export interface Parent {
  id?: number;
  user_id?: number | null;
  nom?: string;
  prenom?: string;
  relation?: string;
  responsable_principal?: boolean;
  responsable_financier?: boolean;
  telephone?: string;
  telephone_secondaire?: string;
  email?: string;
  adresse?: string;
  profession?: string;
  lieu_travail?: string;
  statut?: 'actif' | 'inactif';
  observation?: string;
  compte?: {
    id: number;
    email: string;
    role_id: number;
  } | null;
  eleves?: Eleve[];
  nombre_enfants?: number;
}

export class Covert {
  public static toParent(json: string): Parent {
    return JSON.parse(json);
  }
  public static parentToJson(value: Parent): string {
    return JSON.stringify(value);
  }
}
