

export interface Annee {
  id?: number;
  libelle?: string;
  annee_debut?: string
  annee_fin?: string;

}

export class Covert {
  public static toAnnee(json: string): Annee {
    return JSON.parse(json);
  }
  public static anneeToJson(value: Annee): string {
    return JSON.stringify(value);
  }
}
