import {Departement} from './departement';
import {Metier} from './metier';


export interface Poste {
  id?: number;
  code?: string;
  libelle?: string;
  slug?: string;
  description?: string;
  actif?: boolean;
  metier?: Metier
  services?: Departement;
}

export class Convert {
  public static toPoste(json: string): Poste {
    return JSON.parse(json);
  }
  public static posteToJson(value: Poste): string {
    return JSON.stringify(value);
  }
}
