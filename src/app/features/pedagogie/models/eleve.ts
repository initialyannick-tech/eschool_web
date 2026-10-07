import {Parent} from './parent';

export interface Eleve {
  id?: number;
  matricule?: string;
  nom?: string;
  prenom?: string
  sexe?: string;
  date_naissance?: Date;
  lieu_naissance?: string;
  nationalite?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  user_id?: number | null;
  compte?: {
    id: number;
    email: string;
    role_id: number;
  } | null;
  photo?: string;
  situation_particuliere?: string;
  statut?: string;
  parent?: Parent
  parents?: Parent[]
  relation?: string;
  responsable_principal?: boolean;
  responsable_financier?: boolean;
}

export class Covert {
  public static toEleve(json: string): Eleve {
    return JSON.parse(json);
  }
  public static eleveToJson(value: Eleve): string {
    return JSON.stringify(value);
  }
}
