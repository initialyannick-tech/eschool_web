import {Departement} from './departement';

export interface Metier {
  id?: number;
  code?: string;
  libelle?: string;
  slug?: string;
  famille?: string;
  actif?: boolean;
  services?: Departement;
}

export class Convert {
  public static toMetier(json: string): Metier {
    return JSON.parse(json);
  }
  public static metierToJson(value: Metier): string {
    return JSON.stringify(value);
  }
}
