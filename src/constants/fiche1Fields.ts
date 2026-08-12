export const FICHE1_FIELDS = [
  { id: 'nom', label: 'Nom et prénoms', type: 'text', required: true },
  { id: 'contact', label: 'Contact (Tél)', type: 'phone', required: true },
  { id: 'codeNational', label: 'Code National du producteur (Le Conseil du Café-Cacao)', type: 'text', required: true },
  { id: 'codeGroupe', label: 'Code groupe', type: 'text', required: true },
  { id: 'nomEntite', label: 'Nom Entité reconnue', type: 'select', optionsSource: 'ENTITES', required: true },
  { id: 'codeEntite', label: 'Code Entité reconnue', type: 'text', required: true },
  { id: 'delegation', label: 'Délégation Régionale du Conseil du Café-Cacao', type: 'select', optionsSource: 'REGIONS', required: false },
  { id: 'departement', label: 'Département', type: 'select', optionsSource: 'DEPARTEMENTS', required: false, dependsOn: 'delegation' },
  { id: 'sousPrefecture', label: 'Sous-Préfecture', type: 'text', required: false },
  { id: 'village', label: 'Village', type: 'text', required: false },
  { id: 'campement', label: 'Campement', type: 'text', required: false },
];
