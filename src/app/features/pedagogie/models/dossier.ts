import {Parent} from './parent';

export interface DossierEleve {

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
  public static toDossierEleve(json: string): DossierEleve {
    return JSON.parse(json);
  }
  public static dossierEleveToJson(value: DossierEleve): string {
    return JSON.stringify(value);
  }
}
