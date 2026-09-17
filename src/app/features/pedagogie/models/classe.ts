import {Cycle} from './cycle';
import {Serie} from './serie';
import {Annee} from './annee';

export interface Classe {
  id?: number;
  nom?: string;
  capacite?: string;
  nombre_eleves?: number;
  places_disponibles?: number;
  cycle?: Cycle;
  serie?: Serie;
  annee_scolaire?: Annee;
  professeur_principal?: string;
  description?: string;
  actif?: boolean;
}

export class Covert {
  public static toClasse(json: string): Classe {
    return JSON.parse(json);
  }
  public static classeToJson(value: Classe): string {
    return JSON.stringify(value);
  }
}
