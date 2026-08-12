import { Producteur } from '../core/types/producteur';

export const REGIONS: string[] = ['Agnéby-Tiassa', 'Bélier', 'Cavally', 'Gôh', 'Guémon', 'Haut-Sassandra', 'Lôh-Djiboua', 'Marahoué', 'Mé', 'Nawa', 'San-Pédro', 'Sud-Comoé', 'Tonkpi'];

export const DEPARTEMENTS: Record<string, string[]> = {
  'Nawa': ['Soubré', 'Méagui', 'Buyo', 'Guéyo'],
  'San-Pédro': ['San-Pédro', 'Tabou', 'Grand-Béréby'],
  'Haut-Sassandra': ['Daloa', 'Issia', 'Vavoua', 'Zoukougbeu'],
  'Cavally': ['Guiglo', 'Bloléquin', 'Toulépleu', 'Taï'],
  'Guémon': ['Duékoué', 'Bangolo', 'Kouibly', 'Facobly'],
  'Gôh': ['Gagnoa', 'Oumé', 'Bayota'],
  'Marahoué': ['Bouaflé', 'Sinfra', 'Zuénoula'],
  'Agnéby-Tiassa': ['Agboville', 'Tiassalé', 'Sikensi', 'Taabo'],
  'Lôh-Djiboua': ['Divo', 'Lakota', 'Guitry', 'Fresco'],
  'Mé': ['Adzopé', 'Akoupé', 'Yakassé-Attobrou', 'Alépé'],
  'Sud-Comoé': ['Aboisso', 'Adiaké', 'Grand-Bassam', 'Tiapoum'],
  'Tonkpi': ['Man', 'Biankouma', 'Danané', 'Sipilou'],
  'Bélier': ['Yamoussoukro', 'Toumodi', 'Didiévi', 'Tiébissou'],
};

export const ENTITES: string[] = [
  'CARGILL', 'BARRY CALLEBAUT', 'OLAM', 'SACO', 'CEMOI',
  'TOUTON', 'SUCDEN', 'ECOM', 'ZAMACOM', 'COOP-CA'
];

export const SOURCES_MATERIEL: string[] = [
  '1. SATMACI / ANADER / CNRA',
  '2. Tout venant',
  '3. Pépiniériste privé'
];

export const STATUT_FAMILLE: string[] = ['Chef de ménage', 'Conjoint', 'Enfant', 'Autre'];
export const STATUT_PLANTATION: string[] = ['Aucun', 'Propriétaire', 'Gérant', 'Mo permanent', 'Mo Temporaire', 'Autres'];
export const STATUT_SCOLAIRE: string[] = ['Scolarisé', 'Déscolarisé'];
export const NIVEAU_INSTRUCTION: string[] = ['Aucun', 'Préscolaire', 'Primaire', 'Secondaire', 'Supérieur', 'Autres'];
export const CATEGORIE_ETHNIQUE: string[] = ['Autochtone', 'Allochtone', 'Allogène'];

export const MALADIES: string[] = [
  'Attaques de mirides',
  'Attaques de Pourriture Brune',
  'Présence de plantes épiphytes',
  'Attaque Foreurs',
  'Attaque CSSVD'
];

export const SEVERITES: string[] = ['Aucun', 'Faible', 'Moyen', 'Fort'];

export const INITIAL_PRODUCTEURS: Producteur[] = [
  {
    id: 'demo-001',
    nom: '⭐ YAPI AKISSI FLORENCE [DEMO]',
    contact: '07 77 88 99 00',
    codeNational: 'CI-CAC-2024-00001',
    codeGroupe: 'GRP-NAW-DEMO',
    nomEntite: 'CARGILL',
    codeEntite: 'ENT-CAR-001',
    delegation: 'Nawa',
    departement: 'Soubré',
    sousPrefecture: 'Soubré',
    village: 'Gnalion',
    campement: 'Campement Baoulé N°3',
    menage: [
      { nom: 'YAPI AKISSI FLORENCE', statutFamille: 'Chef de ménage', statutPlantation: 'Propriétaire', statutScolaire: 'Déscolarisé', contact: '07 77 88 99 00', anneeNaissance: 1978, sexe: 'F', niveauInstruction: 'Primaire', categorieEthnique: 'Autochtone' },
      { nom: 'YAPI KOUAKOU JEAN', statutFamille: 'Conjoint', statutPlantation: 'Gérant', statutScolaire: 'Déscolarisé', contact: '05 11 22 33 44', anneeNaissance: 1975, sexe: 'M', niveauInstruction: 'Secondaire', categorieEthnique: 'Autochtone' },
      { nom: 'YAPI ADJOUA SALOMÉ', statutFamille: 'Enfant', statutPlantation: 'Aucun', statutScolaire: 'Scolarisé', contact: '', anneeNaissance: 2005, sexe: 'F', niveauInstruction: 'Secondaire', categorieEthnique: 'Autochtone' },
      { nom: 'YAPI KOUASSI MARC', statutFamille: 'Enfant', statutPlantation: 'Aucun', statutScolaire: 'Scolarisé', contact: '', anneeNaissance: 2008, sexe: 'M', niveauInstruction: 'Primaire', categorieEthnique: 'Autochtone' },
    ],
    supTotale: 15, supCultivee: 11, supCacao: 8, supForet: 2.5, supJachere: 1.5, sourceEau: 'Rivière',
    cultures: [
      { nom: 'Cacao — Parcelle A', superficie: 4, annee: 2000, source: '1. SATMACI / ANADER / CNRA', production: 1800, revenu: 2160000 },
      { nom: 'Cacao — Parcelle B', superficie: 2.5, annee: 2009, source: '3. Pépiniériste privé', production: 1100, revenu: 1320000 },
      { nom: 'Cacao — Parcelle C', superficie: 1.5, annee: 2015, source: '1. SATMACI / ANADER / CNRA', production: 600, revenu: 720000 },
      { nom: 'Hévéa', superficie: 2, annee: 2012, source: '', production: 1200, revenu: 840000 },
      { nom: 'Maraîchage (Tomate)', superficie: 1, annee: 2020, source: '', production: 3000, revenu: 450000 },
    ],
    cacaoyere: {
      dispositif: 'En lignes', densite: '1100', tiges: '3', plagesVides: 'Peu', etenduePlages: '0.5 ha',
      ombrage: 'Moyen', canopee: 'Normal',
      maladies: [
        { nom: 'Attaques de mirides', severite: 'Moyen', observations: 'Présence sur 25% des arbres, traitements insuffisants' },
        { nom: 'Attaques de Pourriture Brune', severite: 'Faible', observations: 'Quelques foyers en saison humide' },
        { nom: 'Présence de plantes épiphytes', severite: 'Faible', observations: 'Loranthacées sur 10% des pieds' },
        { nom: 'Attaque Foreurs', severite: 'Aucun', observations: '' },
        { nom: 'Attaque CSSVD', severite: 'Aucun', observations: '' },
      ],
      sol: { position: 'Mi versant', couvert: 'Beaucoup', matiere: 'Beaucoup', profondeur: 'Beaucoup', texture: 'Moyen', hydromorphie: 'Faible', erosion: 'Non', risqueErosion: 'Non' },
    },
    profilSocioEconomique: {
      accessCredit: 'Oui', sourceCredit: 'Coopérative CARGILL', formationRecue: 'BPA Cacao, Gestion financière',
      besoinsFormation: 'Greffage, Taille en gobelet, Agroforesterie',
      autresRevenus: 'Maraîchage, Hévéa', montantAutresRevenus: 1290000,
    },
    epargneFinancement: [
      { nom: 'Mobile Money', compte: 'Oui', argent: 'Oui', financement: 'Non', montant: '' },
      { nom: 'Microfinance', compte: 'Oui', argent: 'Oui', financement: 'Oui', montant: '350 000 FCFA' },
      { nom: 'Banque', compte: 'Non', argent: 'Non', financement: 'Non', montant: '' },
      { nom: 'Autres, précisez', precision: 'Tontine', compte: 'Oui', argent: 'Oui', financement: 'Non', montant: '' },
    ],
    productionCacaoAncienne: [
      { annee: 'Année N-1 :', prod: '3 500', revenu: '4 200 000' },
      { annee: 'Année N-2 :', prod: '3 200', revenu: '3 840 000' },
      { annee: 'Année N-3 :', prod: '2 900', revenu: '3 480 000' },
    ],
    sourcesRevenusAutres: [
      { activite: 'Hévéa (latex)', prod: '1 200 kg/an', revenu: '840 000 FCFA' },
      { activite: 'Maraîchage (tomate, gombo)', prod: '3 000 kg/an', revenu: '450 000 FCFA' },
    ],
    depensesFoyer: [
      { depense: 'Scolarité', periodicite: 'année', montant: '180 000', fixed: true },
      { depense: 'Nourriture', periodicite: 'mois', montant: '45 000', fixed: true },
      { depense: 'Santé', periodicite: 'année', montant: '120 000', fixed: true },
      { depense: 'Electricité', periodicite: '2 mois', montant: '8 000', fixed: true },
      { depense: 'Eau courante', periodicite: 'mois', montant: '3 500', fixed: true },
      { depense: 'Charges sociales (Funérailles, mariage, baptême...)', periodicite: 'année', montant: '200 000', fixed: true },
      { depense: 'Crédit microfinance', periodicite: 'mois', montant: '15 000', fixed: false },
      { depense: 'Transport / carburant', periodicite: 'mois', montant: '12 000', fixed: false },
    ],
    mainOeuvre: [
      { nom: 'Travailleur 1', statut: 'Mo permanente', sexe: 'M', cout: '480 000', temps: '240', fixed: true },
      { nom: 'Travailleur 2', statut: 'Mo occasionnel', sexe: 'M', cout: '180 000', temps: '60', fixed: true },
      { nom: 'Travailleur 3', statut: 'Mo occasionnel', sexe: 'F', cout: '90 000', temps: '30', fixed: true },
      { nom: 'Groupe de travail', statut: 'Non rémunérée (familiale)', sexe: 'M', cout: '0', temps: '45', fixed: true },
    ],
    analyseProblemes: [
      { theme: 'Peuplement du verger', problemes: 'Densité faible sur parcelle A, plages vides importantes', causes: 'Mortalité des plants, pas de replantation systématique', consequences: 'Perte de rendement estimée à 20%', solutions: 'Replantation des plages vides avec matériel CNRA' },
      { theme: 'Entretien du verger', problemes: 'Présence de cabosses momifiées et gourmands non taillés', causes: 'Manque de main d\'œuvre en période de pointe', consequences: 'Foyers de contamination de pourriture brune', solutions: 'Organisation de groupements de travail, taille annuelle' },
      { theme: 'Etat sanitaire du verger', problemes: 'Attaques de mirides sur 25% des pieds', causes: 'Traitements irréguliers, produits inadaptés', consequences: 'Réduction du rendement, dessèchement des cabosses', solutions: 'Formation sur les traitements, calendrier phytosanitaire' },
      { theme: 'Arbres d\'ombrage', problemes: 'Ombrage trop dense sur parcelle B', causes: 'Pas de taille des arbres forestiers', consequences: 'Favorise l\'humidité et la pourriture brune', solutions: 'Taille d\'éclaircie des arbres d\'ombrage' },
      { theme: 'Etat du sol', problemes: 'Tassement du sol sur pistes de récolte', causes: 'Passage répété des porteurs', consequences: 'Réduction de la porosité, drainage insuffisant', solutions: 'Paillage des pistes, rotation des passages' },
      { theme: 'Cours/sources d\'eau', problemes: 'Aucun problème majeur identifié', causes: 'Rivière à proximité bien entretenue', consequences: 'Situation favorable', solutions: 'Maintien du couvert végétal en bordure de rivière' },
      { theme: 'Terre/Jachères disponibles', problemes: '1,5 ha de jachère sous-utilisée', causes: 'Manque de financement pour la mise en valeur', consequences: 'Perte de potentiel productif', solutions: 'Plantation d\'hévéa ou agroforesterie cacaoyère' },
      { theme: 'Matériel et équipement', problemes: 'Pulvérisateur vétuste (8 ans)', causes: 'Ressources financières limitées', consequences: 'Traitements inefficaces, gaspillage de produits', solutions: 'Acquisition d\'un nouveau pulvérisateur (crédit coopérative)' },
      { theme: 'Gestion de l\'exploitation', problemes: 'Absence de tenue de comptabilité', causes: 'Niveau d\'instruction limité, habitude', consequences: 'Méconnaissance de la rentabilité réelle', solutions: 'Formation en gestion simplifiée, utilisation de cahier de bord' },
      { theme: 'Autres cultures/activités', problemes: 'Maraîchage non structuré, ventes irrégulières', causes: 'Manque de débouchés stables', consequences: 'Revenus complémentaires faibles et incertains', solutions: 'Groupement de commercialisation, contrat avec acheteurs locaux' },
    ],
    fiche7: [
      {
        id: 'axe1', nom: 'Axe 1 : Réhabilitation et entretien du verger',
        activites: [
          { obj: 'Améliorer la densité du verger', act: 'Replantation des plages vides avec plants CNRA', cout: '320 000', a1: 'bg-green-500', a2: 'bg-green-500', a3: '', a4: '', a5: '', resp: 'Producteur', part: 'ANADER / CARGILL' },
          { obj: 'Réduire les foyers de maladie', act: 'Taille des cabosses momifiées et des gourmands', cout: '80 000', a1: 'bg-orange-500', a2: 'bg-orange-500', a3: 'bg-orange-500', a4: 'bg-orange-500', a5: 'bg-orange-500', resp: 'Producteur', part: 'Famille' },
          { obj: 'Contrôler les loranthacées', act: 'Taille de toutes les plantes épiphytes', cout: '60 000', a1: 'bg-blue-500', a2: '', a3: '', a4: '', a5: '', resp: 'Producteur', part: 'MO occasionnelle' },
        ]
      },
      {
        id: 'axe2', nom: 'Axe 2 : Protection phytosanitaire',
        activites: [
          { obj: 'Réduire les attaques de mirides', act: 'Application insecticide selon calendrier', cout: '150 000', a1: 'bg-orange-500', a2: 'bg-orange-500', a3: 'bg-orange-500', a4: 'bg-orange-500', a5: 'bg-orange-500', resp: 'Producteur', part: 'CARGILL / ANADER' },
          { obj: 'Limiter la pourriture brune', act: 'Traitements fongicides en période humide', cout: '90 000', a1: 'bg-blue-500', a2: 'bg-blue-500', a3: 'bg-blue-500', a4: 'bg-blue-500', a5: 'bg-blue-500', resp: 'Producteur', part: 'Coopérative' },
        ]
      },
      {
        id: 'axe3', nom: 'Axe 3 : Diversification et renforcement des revenus',
        activites: [
          { obj: 'Valoriser la jachère disponible', act: 'Plantation agroforestière sur 1,5 ha', cout: '480 000', a1: 'bg-green-500', a2: 'bg-green-500', a3: '', a4: '', a5: '', resp: 'Producteur', part: 'ONG / Projet' },
          { obj: 'Structurer le maraîchage', act: 'Adhésion à un groupement de commercialisation', cout: '25 000', a1: 'bg-yellow-500', a2: '', a3: '', a4: '', a5: '', resp: 'Producteur', part: 'Mairie / ONG' },
        ]
      },
    ],
    fiche8: [
      {
        id: 'axe1', nom: 'Axe 1 : Réhabilitation du verger',
        activites: [
          { act: 'Replantation plages vides (plants CNRA)', ind: 'Superficie replantée ≥ 0,5 ha', t1: 'bg-green-500', t2: 'bg-green-500', t3: '', t4: '', resp: 'Producteur + ANADER', cout: '320 000' },
          { act: 'Taille des cabosses momifiées', ind: 'Nombre de pieds traités', t1: '', t2: 'bg-orange-500', t3: 'bg-orange-500', t4: '', resp: 'Producteur', cout: '80 000' },
          { act: 'Taille des loranthacées', ind: '100% des pieds atteints taillés', t1: 'bg-blue-500', t2: '', t3: '', t4: '', resp: 'MO occasionnelle', cout: '60 000' },
        ]
      },
      {
        id: 'axe2', nom: 'Axe 2 : Protection phytosanitaire',
        activites: [
          { act: 'Traitement insecticide anti-mirides (2 passages)', ind: 'Taux d\'infestation < 10%', t1: 'bg-orange-500', t2: '', t3: 'bg-orange-500', t4: '', resp: 'Producteur', cout: '150 000' },
          { act: 'Traitement fongicide anti-pourriture brune', ind: 'Taux de cabosses malades < 5%', t1: '', t2: 'bg-blue-500', t3: 'bg-blue-500', t4: '', resp: 'Producteur', cout: '90 000' },
        ]
      },
      {
        id: 'axe3', nom: 'Axe 3 : Gestion et diversification',
        activites: [
          { act: 'Tenue du cahier de bord de l\'exploitation', ind: 'Cahier rempli tous les mois', t1: 'bg-yellow-500', t2: 'bg-yellow-500', t3: 'bg-yellow-500', t4: 'bg-yellow-500', resp: 'Producteur', cout: '0' },
          { act: 'Récolte et post-récolte cacao', ind: 'Rendement ≥ 3 500 kg', t1: '', t2: '', t3: 'bg-green-500', t4: 'bg-green-500', resp: 'Producteur + MO', cout: '180 000' },
        ]
      },
    ],
    moyensCouts: [
      {
        id: 'inv', nom: 'Investissement',
        items: [
          { moyen: 'Atomiseur', unite: 'Nombre', a1q: '1', a1c: '85 000', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
          { moyen: 'Sécateur professionnel', unite: 'Nombre', a1q: '3', a1c: '12 000', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '2', a5c: '8 000', fixed: false },
        ]
      },
      {
        id: 'int', nom: 'Intrants',
        items: [
          { moyen: 'Engrais NPK 12-12-17', unite: 'kg', a1q: '200', a1c: '80 000', a2q: '200', a2c: '80 000', a3q: '200', a3c: '80 000', a4q: '200', a4c: '80 000', a5q: '200', a5c: '80 000', fixed: true },
          { moyen: 'Insecticide (Confidor)', unite: 'Litre', a1q: '5', a1c: '75 000', a2q: '5', a2c: '75 000', a3q: '5', a3c: '75 000', a4q: '5', a4c: '75 000', a5q: '5', a5c: '75 000', fixed: true },
          { moyen: 'Fongicide (Ridomil)', unite: 'kg', a1q: '4', a1c: '60 000', a2q: '4', a2c: '60 000', a3q: '4', a3c: '60 000', a4q: '4', a4c: '60 000', a5q: '4', a5c: '60 000', fixed: false },
          { moyen: 'Plants cacao CNRA', unite: 'Plants', a1q: '350', a1c: '105 000', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: false },
        ]
      },
      {
        id: 'mo', nom: "Main d'œuvre",
        items: [
          { moyen: 'M.O permanente', unite: 'Jours/an', a1q: '240', a1c: '480 000', a2q: '240', a2c: '480 000', a3q: '240', a3c: '480 000', a4q: '240', a4c: '480 000', a5q: '240', a5c: '480 000', fixed: true },
          { moyen: 'M.O. Occasionnelle (récolte)', unite: 'Jours', a1q: '30', a1c: '90 000', a2q: '30', a2c: '90 000', a3q: '30', a3c: '90 000', a4q: '30', a4c: '90 000', a5q: '30', a5c: '90 000', fixed: true },
        ]
      },
      {
        id: 'act', nom: 'Activités spécifiques',
        items: [
          { moyen: 'Transport récolte (mototaxi)', unite: 'Saisons', a1q: '2', a1c: '40 000', a2q: '2', a2c: '40 000', a3q: '2', a3c: '40 000', a4q: '2', a4c: '40 000', a5q: '2', a5c: '40 000', fixed: false },
        ]
      },
    ],
    historiqueProduction: [
      { annee: 2020, production: 2400, revenu: 2880000 },
      { annee: 2021, production: 2750, revenu: 3300000 },
      { annee: 2022, production: 3000, revenu: 3900000 },
      { annee: 2023, production: 3200, revenu: 3840000 },
      { annee: 2024, production: 3500, revenu: 4200000 },
    ],
    problemes: [
      { domaine: 'Phytosanitaire', probleme: 'Attaques de mirides', cause: 'Traitements irréguliers', solution: 'Calendrier phytosanitaire' },
      { domaine: 'Entretien', probleme: 'Cabosses momifiées non ramassées', cause: 'Manque de MO', solution: 'Groupements de travail' },
    ],
    planificationStrategique: [
      { objectif: 'Augmenter le rendement', strategie: 'Replantation + traitement', indicateur: 'Production ≥ 4 000 kg', echeance: '2027' },
      { objectif: 'Améliorer la qualité', strategie: 'Formation BPA', indicateur: 'Grade 1 > 80%', echeance: '2026' },
    ],
    programmeAnnuel: [
      { activite: 'Traitement insecticide', periode: 'Mars et Septembre', responsable: 'Producteur', moyens: 'Atomiseur, Confidor', cout: 150000, statut: 'Planifié' },
      { activite: 'Récolte principale', periode: 'Octobre — Décembre', responsable: 'Producteur + MO', moyens: 'MO, Cabosseuse', cout: 180000, statut: 'Planifié' },
    ],
    couts: [
      { rubrique: 'Intrants', designation: 'Engrais NPK', quantite: 200, unite: 'kg', prixUnitaire: 400, total: 80000 },
      { rubrique: 'Intrants', designation: 'Insecticide', quantite: 5, unite: 'litres', prixUnitaire: 15000, total: 75000 },
      { rubrique: 'Investissement', designation: 'Atomiseur', quantite: 1, unite: 'unité', prixUnitaire: 85000, total: 85000 },
      { rubrique: "Main d'œuvre", designation: 'MO permanente', quantite: 240, unite: 'jours', prixUnitaire: 2000, total: 480000 },
    ],
    dateCreation: '2024-01-15',
  },
  {
    id: '1',
    nom: 'KOUAKOU KOUADIO HENRI',
    contact: '07 08 09 10 11',
    codeNational: 'CI-CAC-2024-00125',
    codeGroupe: 'GRP-NAW-001',
    nomEntite: 'CARGILL',
    codeEntite: 'ENT-CAR-042',
    delegation: 'Nawa',
    departement: 'Soubré',
    sousPrefecture: 'Méagui',
    village: 'Petit-Bondoukou',
    campement: 'Campement Dioulabougou',
    menage: [
      { nom: 'KOUAKOU KOUADIO HENRI', statutFamille: 'Chef de ménage', statutPlantation: 'Propriétaire', statutScolaire: '', contact: '07 08 09 10 11', anneeNaissance: 1965, sexe: 'M', niveauInstruction: 'Primaire', categorieEthnique: 'Autochtone' },
      { nom: 'YAO AFFOUE MARIE', statutFamille: 'Conjoint', statutPlantation: 'Aucun', statutScolaire: '', contact: '05 12 34 56 78', anneeNaissance: 1972, sexe: 'F', niveauInstruction: 'Aucun', categorieEthnique: 'Autochtone' },
    ],
    supTotale: 8.5, supCultivee: 6.0, supCacao: 4.5, supForet: 1.5, supJachere: 1.0, sourceEau: 'Rivière',
    cultures: [
      { nom: 'Cacao — Parcelle 1', superficie: 2.5, annee: 1996, source: 'Tout venant', production: 1200, revenu: 1440000 },
      { nom: 'Cacao — Parcelle 2', superficie: 2.0, annee: 2005, source: 'CNRA', production: 900, revenu: 1080000 },
      { nom: 'Hévéa', superficie: 1.0, annee: 2010, source: '', production: 500, revenu: 300000 },
      { nom: 'Vivrier', superficie: 0.5, annee: 2015, source: '', production: 200, revenu: 100000 },
    ],
    cacaoyere: {
      dispositif: 'En lignes', densite: '1200', tiges: '3', plagesVides: 'Peu', etenduePlages: '0.3 ha', ombrage: 'Moyen', canopee: 'Normal',
      maladies: [
        { nom: 'Attaques de mirides', severite: 'Moyen', observations: 'Présence sur 30% des arbres' },
        { nom: 'Attaques de Pourriture Brune', severite: 'Faible', observations: '' },
      ],
      sol: { position: 'Mi versant', couvert: 'Moyen', matiere: 'Beaucoup', profondeur: 'Beaucoup', texture: 'Moyen', hydromorphie: 'Faible', erosion: 'Non', risqueErosion: 'Non' },
    },
    profilSocioEconomique: {
      accessCredit: 'Oui', sourceCredit: 'Coopérative', formationRecue: 'BPA Cacao', besoinsFormation: 'Greffage, Taille',
      autresRevenus: 'Commerce de vivrier', montantAutresRevenus: 250000,
    },
    problemes: [
      { domaine: 'Production', probleme: 'Vieillissement du verger', cause: 'Arbres de plus de 25 ans', solution: 'Replantation progressive' },
      { domaine: 'Phytosanitaire', probleme: 'Attaques de mirides', cause: 'Manque de traitement', solution: 'Application insecticide' },
    ],
    planificationStrategique: [
      { objectif: 'Augmenter la production', strategie: 'Replantation', indicateur: 'Superficie replantée', echeance: '2026' },
      { objectif: 'Améliorer la qualité', strategie: 'Formation BPA', indicateur: 'Taux de fèves grade 1', echeance: '2025' },
    ],
    programmeAnnuel: [
      { activite: 'Taille des cacaoyers', periode: 'Janvier-Février', responsable: 'Producteur', moyens: 'Sécateur, Main d\'œuvre', cout: 50000, statut: 'Réalisé' },
      { activite: 'Traitement phytosanitaire', periode: 'Mars-Avril', responsable: 'Producteur', moyens: 'Insecticide, Pulvérisateur', cout: 75000, statut: 'En cours' },
      { activite: 'Récolte principale', periode: 'Octobre-Décembre', responsable: 'Producteur + MO', moyens: 'Main d\'œuvre, Outils', cout: 120000, statut: 'Planifié' },
    ],
    couts: [
      { rubrique: 'Intrants', designation: 'Engrais NPK', quantite: 5, unite: 'sacs', prixUnitaire: 15000, total: 75000 },
      { rubrique: 'Intrants', designation: 'Insecticide', quantite: 3, unite: 'litres', prixUnitaire: 8000, total: 24000 },
      { rubrique: 'Main d\'œuvre', designation: 'Récolte', quantite: 10, unite: 'jours', prixUnitaire: 3000, total: 30000 },
      { rubrique: 'Équipement', designation: 'Pulvérisateur', quantite: 1, unite: 'unité', prixUnitaire: 35000, total: 35000 },
    ],
    historiqueProduction: [
      { annee: 2020, production: 800, revenu: 960000 },
      { annee: 2021, production: 950, revenu: 1140000 },
      { annee: 2022, production: 1100, revenu: 1430000 },
      { annee: 2023, production: 1050, revenu: 1365000 },
      { annee: 2024, production: 1200, revenu: 1680000 },
    ],
    dateCreation: '2024-03-15',
  },
  {
    id: '2',
    nom: 'BAMBA SEYDOU',
    contact: '01 23 45 67 89',
    codeNational: 'CI-CAC-2024-00248',
    codeGroupe: 'GRP-HSA-003',
    nomEntite: 'BARRY CALLEBAUT',
    codeEntite: 'ENT-BCL-018',
    delegation: 'Haut-Sassandra',
    departement: 'Daloa',
    sousPrefecture: 'Daloa',
    village: 'Zaïbo',
    campement: '',
    menage: [
      { nom: 'BAMBA SEYDOU', statutFamille: 'Chef de ménage', statutPlantation: 'Propriétaire', statutScolaire: '', contact: '01 23 45 67 89', anneeNaissance: 1970, sexe: 'M', niveauInstruction: 'Secondaire', categorieEthnique: 'Allochtone' },
    ],
    supTotale: 12, supCultivee: 9, supCacao: 7, supForet: 2, supJachere: 1, sourceEau: 'Puits',
    cultures: [
      { nom: 'Cacao — Parcelle 1', superficie: 4, annee: 1998, source: 'Tout venant', production: 2000, revenu: 2400000 },
      { nom: 'Cacao — Parcelle 2', superficie: 3, annee: 2008, source: 'CNRA', production: 1500, revenu: 1800000 },
    ],
    cacaoyere: { dispositif: 'En désordre', densite: '900', tiges: '4', plagesVides: 'Beaucoup', etenduePlages: '1.2 ha', ombrage: 'Dense', canopee: 'Peu dégradé', maladies: [], sol: { position: 'Bas de pente', couvert: 'Faible', matiere: 'Moyen', profondeur: 'Moyen', texture: 'Moyen', hydromorphie: 'Moyen', erosion: 'Oui', risqueErosion: 'Oui' } },
    profilSocioEconomique: { accessCredit: 'Non', sourceCredit: '', formationRecue: 'Aucune', besoinsFormation: 'BPA, Gestion financière', autresRevenus: 'Néant', montantAutresRevenus: 0 },
    problemes: [{ domaine: 'Sol', probleme: 'Érosion', cause: 'Pente forte', solution: 'Aménagement anti-érosif' }],
    planificationStrategique: [{ objectif: 'Réduire les pertes', strategie: 'Traitement régulier', indicateur: 'Taux de perte', echeance: '2025' }],
    programmeAnnuel: [{ activite: 'Désherbage', periode: 'Toute l\'année', responsable: 'Producteur', moyens: 'Main d\'œuvre', cout: 80000, statut: 'En cours' }],
    couts: [{ rubrique: 'Main d\'œuvre', designation: 'Désherbage annuel', quantite: 20, unite: 'jours', prixUnitaire: 3000, total: 60000 }],
    historiqueProduction: [
      { annee: 2020, production: 1800, revenu: 2160000 },
      { annee: 2021, production: 2100, revenu: 2520000 },
      { annee: 2022, production: 1900, revenu: 2470000 },
      { annee: 2023, production: 2200, revenu: 2860000 },
      { annee: 2024, production: 2400, revenu: 3360000 },
    ],
    dateCreation: '2024-05-20',
  },
  {
    id: '3',
    nom: 'KONÉ AMINATA',
    contact: '05 67 89 01 23',
    codeNational: 'CI-CAC-2024-00312',
    codeGroupe: 'GRP-NAW-002',
    nomEntite: 'CARGILL',
    codeEntite: 'ENT-CAR-043',
    delegation: 'Nawa',
    departement: 'Méagui',
    sousPrefecture: 'Méagui',
    village: 'Grand-Zattry',
    campement: 'Campement Baoulé',
    menage: [
      { nom: 'KONÉ AMINATA', statutFamille: 'Chef de ménage', statutPlantation: 'Propriétaire', statutScolaire: '', contact: '05 67 89 01 23', anneeNaissance: 1980, sexe: 'F', niveauInstruction: 'Primaire', categorieEthnique: 'Allochtone' },
    ],
    supTotale: 5, supCultivee: 3.5, supCacao: 3, supForet: 1, supJachere: 0.5, sourceEau: 'Rivière',
    cultures: [
      { nom: 'Cacao — Parcelle 1', superficie: 3, annee: 2010, source: 'CNRA', production: 900, revenu: 1080000 },
    ],
    cacaoyere: { dispositif: 'En lignes', densite: '1100', tiges: '2', plagesVides: 'Peu', etenduePlages: '0.2 ha', ombrage: 'Moyen', canopee: 'Normal', maladies: [], sol: { position: 'Haut de pente', couvert: 'Beaucoup', matiere: 'Beaucoup', profondeur: 'Beaucoup', texture: 'Beaucoup', hydromorphie: 'Faible', erosion: 'Non', risqueErosion: 'Non' } },
    profilSocioEconomique: { accessCredit: 'Oui', sourceCredit: 'Microfinance', formationRecue: 'BPA', besoinsFormation: 'Transformation', autresRevenus: 'Maraîchage', montantAutresRevenus: 180000 },
    problemes: [],
    planificationStrategique: [],
    programmeAnnuel: [],
    couts: [],
    historiqueProduction: [
      { annee: 2021, production: 600, revenu: 720000 },
      { annee: 2022, production: 750, revenu: 975000 },
      { annee: 2023, production: 850, revenu: 1105000 },
      { annee: 2024, production: 900, revenu: 1260000 },
    ],
    dateCreation: '2024-07-10',
  },
];

export function createEmptyProducteur(): Producteur {
  return {
    id: Date.now().toString(),
    nom: '', contact: '', codeNational: '', codeGroupe: '',
    nomEntite: '', codeEntite: '', delegation: '', departement: '',
    sousPrefecture: '', village: '', campement: '',
    menage: [],
    supTotale: 0, supCultivee: 0, supCacao: 0, supForet: 0, supJachere: 0, sourceEau: '',
    cultures: [{ nom: 'Cacao — Parcelle 1', superficie: 0, annee: '', source: '', production: 0, revenu: 0 }],
    cacaoyere: {
      dispositif: '', densite: '', tiges: '', plagesVides: '', etenduePlages: '', ombrage: '', canopee: '',
      maladies: [],
      sol: { position: '', couvert: '', matiere: '', profondeur: '', texture: '', hydromorphie: '', erosion: '', risqueErosion: '' },
    },
    profilSocioEconomique: { accessCredit: '', sourceCredit: '', formationRecue: '', besoinsFormation: '', autresRevenus: '', montantAutresRevenus: 0 },
    problemes: [],
    planificationStrategique: [],
    programmeAnnuel: [],
    couts: [],
    historiqueProduction: [],
    dateCreation: new Date().toISOString().split('T')[0],
  };
}
