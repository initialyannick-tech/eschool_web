export interface Matiere {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string;
  actif?: boolean;
  enseignants?: Array<{
    id: number;
    nom: string;
    prenom: string;
    email: string;
  }>;
}

export class MatiereHelper {
  static toMatiere(json: string): Matiere {
    return JSON.parse(json);
  }

  static toJson(value: Matiere): string {
    return JSON.stringify(value);
  }
}
