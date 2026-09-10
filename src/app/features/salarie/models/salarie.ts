export interface Salarie {
  id?: number;
  matricule?: string;
  prenom?: string;
  nom?: string;
  date_naissance?: string;
  lieu_naissance?: string;
  sexe?: string;
  niveau_etude?: string;
  age?: number;
  annee_embauche?: string;
  anciennete?: number;
  contrat?: string;
}

export class Covert {
  public static toSalarie(json: string): Salarie {
    return JSON.parse(json);
  }
  public static salarieToJson(value: Salarie): string {
    return JSON.stringify(value);
  }
}
