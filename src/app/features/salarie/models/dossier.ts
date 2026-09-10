import {Metier} from '../../departement/models/metier';
import {Departement} from '../../departement/models/departement';
import {Poste} from '../../departement/models/poste';

export interface DossierAgent {
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
  metier?: Metier
  services?: Departement;
  poste?: Poste;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toDossierAgent(json: string): DossierAgent {
    return JSON.parse(json);
  }

  public static DossierAgentToJson(value: DossierAgent): string {
    return JSON.stringify(value);
  }
}
