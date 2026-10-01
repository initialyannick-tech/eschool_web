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
  photo?: string;
  situation_particuliere?: string;
  statut?: string;
  parents?: Parent
}

export class Covert {
  public static toEleve(json: string): Eleve {
    return JSON.parse(json);
  }
  public static eleveToJson(value: Eleve): string {
    return JSON.stringify(value);
  }
}
