import {Eleve} from './eleve';

export interface Parent {
  id?: number;
  nom?: string;
  prenom?: string
  relation?: string;
  telephone?: string;
  email?: string;
  responsable_principal?: boolean;
  responsable_financier?: boolean;
  eleves?: Eleve;
  nombre_enfants?: string;
}

export class Covert {
  public static toParent(json: string): Parent {
    return JSON.parse(json);
  }
  public static parentToJson(value: Parent): string {
    return JSON.stringify(value);
  }
}
