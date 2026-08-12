export interface MenageMember {
  nom: string;
  statutFamille: string;
  statutPlantation: string;
  statutScolaire: string;
  contact: string;
  anneeNaissance: number | string;
  sexe: 'M' | 'F' | string;
  niveauInstruction: string;
  categorieEthnique: string;
}

export interface Culture {
  nom?: string;
  libelle?: string;
  superficie?: number | string;
  sup?: number | string;
  annee?: number | string;
  source?: string;
  production?: number | string;
  revenu?: number | string;
  precedent?: string;
  origine?: string;
  enProduction?: string;
  isAutre?: boolean;
  id?: string;
}

export interface Materiel {
  id: string;
  type?: string;
  rowSpan?: number;
  designation?: string;
  designationValue?: string;
  qte?: string;
  annee?: string;
  cout?: string;
  bon?: string;
  acc?: string;
  mauv?: string;
  isCustomType?: boolean;
  isCustomRow?: boolean;
  groupId?: string;
}

export interface ArbreDiagnostic {
  id: string;
  nomBotanique?: string;
  nomLocal?: string;
  circonference?: string;
  origine?: string;
  organe?: string;
  utilite?: string;
  decision?: string;
  raisons?: string;
}

export interface Maladie {
  nom: string;
  severite: string;
  observations: string;
}

export interface Sol {
  position?: string;
  couvert?: string;
  matiere?: string;
  profondeur?: string;
  texture?: string;
  hydromorphie?: string;
  erosion?: string;
  risqueErosion?: string;
}

export interface Cacaoyere {
  dispositif?: string;
  densite?: string;
  tiges?: string;
  plagesVides?: string;
  etenduePlages?: string;
  ombrage?: string;
  canopee?: string;
  maladies?: Maladie[];
  sol?: Sol;
}

export interface ProfilSocioEconomique {
  accessCredit?: string;
  sourceCredit?: string;
  formationRecue?: string;
  besoinsFormation?: string;
  autresRevenus?: string;
  montantAutresRevenus?: number | string;
}

export interface EpargneFinancement {
  nom: string;
  compte: string;
  argent: string;
  financement: string;
  montant: string;
  precision?: string;
}

export interface ProductionAncienne {
  annee: string;
  prod: string;
  revenu: string;
}

export interface SourceRevenusAutres {
  activite: string;
  prod: string;
  revenu: string;
}

export interface DepenseFoyer {
  depense: string;
  periodicite: string;
  montant: string;
  fixed: boolean;
}

export interface MainOeuvre {
  nom: string;
  statut: string;
  sexe: string;
  cout: string;
  temps: string;
  fixed: boolean;
}

export interface AnalyseProbleme {
  theme: string;
  problemes: string;
  causes: string;
  consequences: string;
  solutions: string;
}

export interface ActivitePlanification {
  obj?: string;
  act?: string;
  cout?: string;
  a1?: string;
  a2?: string;
  a3?: string;
  a4?: string;
  a5?: string;
  resp?: string;
  part?: string;
  ind?: string;
  t1?: string;
  t2?: string;
  t3?: string;
  t4?: string;
}

export interface AxePlanification {
  id: string;
  nom: string;
  activites: ActivitePlanification[];
}

export interface ItemMoyenCout {
  moyen: string;
  unite: string;
  a1q?: string;
  a1c?: string;
  a2q?: string;
  a2c?: string;
  a3q?: string;
  a3c?: string;
  a4q?: string;
  a4c?: string;
  a5q?: string;
  a5c?: string;
  fixed: boolean;
}

export interface CategorieMoyenCout {
  id: string;
  nom: string;
  items: ItemMoyenCout[];
}

export interface HistoriqueProduction {
  annee: number;
  production: number;
  revenu: number;
}

export interface Coordonnees {
  waypointO?: string;
  waypointN?: string;
  sousPrefecture?: string;
  village?: string;
  campement?: string;
}

export interface RowValueOb {
  nom?: string;
  hint?: string;
  valeur?: string;
  observations?: string;
}

export interface RecGauche {
  val?: string;
}
export interface RecDroite {
  nom?: string;
  val?: string;
}

export interface ApplicationEngraisPhyto {
  type?: string;
  nom?: string;
  qte?: string;
  periode?: string;
  mode?: string;
  applicateur?: string;
}

export interface Producteur {
  id: string;
  nom: string;
  contact: string;
  codeNational: string;
  codeGroupe: string;
  nomEntite: string;
  codeEntite: string;
  delegation: string;
  departement: string;
  sousPrefecture: string;
  village: string;
  campement: string;
  
  menage: MenageMember[];
  
  supTotale?: number;
  supCultivee?: number;
  supCacao?: number;
  supForet?: number;
  supJachere?: number;
  sourceEau?: string;
  
  cultures?: Culture[];
  donneesCultures?: Culture[];
  
  cacaoyere?: Cacaoyere;
  
  profilSocioEconomique?: ProfilSocioEconomique;
  
  epargneFinancement?: EpargneFinancement[];
  productionCacaoAncienne?: ProductionAncienne[];
  sourcesRevenusAutres?: SourceRevenusAutres[];
  depensesFoyer?: DepenseFoyer[];
  mainOeuvre?: MainOeuvre[];
  analyseProblemes?: AnalyseProbleme[];
  
  fiche7?: AxePlanification[];
  fiche8?: AxePlanification[];
  moyensCouts?: CategorieMoyenCout[];
  historiqueProduction?: HistoriqueProduction[];
  
  // Nouveaux champs pour match la DB originelle
  coordonnees?: Coordonnees;
  materiels?: Materiel[];
  diagnosticArbres?: ArbreDiagnostic[];
  maladiesRows?: Maladie[];
  parametresRows?: RowValueOb[];
  solGauche?: RowValueOb[];
  solDroite?: RowValueOb[];
  positionParcelle?: string;
  recGauche?: RecGauche[];
  recDroite?: RecDroite[];
  applicationEngrais?: ApplicationEngraisPhyto[];
  applicationPhyto?: ApplicationEngraisPhyto[];
  emballagesReponse?: string;
  
  // Legacy / Mocks
  couts?: any[];
  problemes?: any[];
  planificationStrategique?: any[];
  planification?: any[];
  programmeAnnuel?: any[];
  
  dateCreation: string;
}
