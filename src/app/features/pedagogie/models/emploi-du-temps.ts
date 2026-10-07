import { Salle } from './salle';
import { Classe } from './classe';

export type JourSemaine = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';

export interface EmploiDuTemps {
  id?: number;
  annee_scolaire_id: number;
  classe_id: number;
  matiere_id: number;
  enseignant_id: number;
  salle_id: number;
  jour_semaine: JourSemaine;
  heure_debut: string; // Format "HH:mm"
  heure_fin: string;   // Format "HH:mm"
  type_cours?: string; // CM, TD, TP, etc.
  
  // Relations (lors des inclusions API)
  salle?: Salle;
  classe?: Classe;
  enseignant?: any;
  matiere?: any;
}

export interface EmploiDuTempsPayload {
  annee_scolaire_id: number;
  classe_id: number;
  matiere_id: number;
  enseignant_id: number;
  salle_id: number;
  jour_semaine: JourSemaine;
  heure_debut: string;
  heure_fin: string;
  type_cours?: string;
}