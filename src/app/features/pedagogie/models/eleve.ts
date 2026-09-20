export interface Eleve {
  id?: number;
  nom?: string;
  prenom?: string
  sexe?: string;
  telephone?: string;
  email?: string;
  date_naissance?: boolean;
  lieu_naissance?: boolean;
  nationalite?: string
}

export class Covert {
  public static toEleve(json: string): Eleve {
    return JSON.parse(json);
  }
  public static eleveToJson(value: Eleve): string {
    return JSON.stringify(value);
  }
}
