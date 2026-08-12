import { Producteur } from '../core/types/producteur';

export const calculateFicheCompletion = (data: Producteur, ficheNumber: number): number => {
  if (!data) return 0;
  
  switch (ficheNumber) {
    case 1:
      // Fiche 1 : Profil et Mnage
      let f1Filled = 0;
      let f1Total = 3; // nom, contact, village
      if (data.nom) f1Filled++;
      if (data.contact) f1Filled++;
      if (data.village) f1Filled++;
      
      // Mnage
      if (data.menage && data.menage.length > 0) {
        f1Filled++;
      }
      f1Total++;
      
      return Math.round((f1Filled / f1Total) * 100);

    case 2:
      // Fiche 2 : Profil exploitation
      let f2Filled = 0;
      let f2Total = 4;
      if (data.coordonnees?.waypointO || data.coordonnees?.waypointN) f2Filled++;
      if (data.cultures && data.cultures.length > 0) f2Filled++;
      if (data.materiels && data.materiels.length > 0) f2Filled++;
      if (data.diagnosticArbres && data.diagnosticArbres.length > 0) f2Filled++;
      return Math.round((f2Filled / f2Total) * 100);

    case 3:
      // Fiche 3 : Infos cacaoyre
      let f3Filled = 0;
      let f3Total = 4;
      if (data.cacaoyere?.dispositif) f3Filled++;
      if (data.cacaoyere?.ombrage) f3Filled++;
      if (data.maladiesRows && data.maladiesRows.length > 0) f3Filled++;
      if (data.historiqueProduction && data.historiqueProduction.length > 0) f3Filled++;
      return Math.round((f3Filled / f3Total) * 100);

    case 4:
      // Fiche 4 : Dpenses & Revenus
      let f4Filled = 0;
      let f4Total = 4;
      if (data.depensesFoyer && data.depensesFoyer.length > 0) f4Filled++;
      if (data.sourcesRevenusAutres && data.sourcesRevenusAutres.length > 0) f4Filled++;
      if (data.epargneFinancement && data.epargneFinancement.length > 0) f4Filled++;
      if (data.mainOeuvre && data.mainOeuvre.length > 0) f4Filled++;
      return Math.round((f4Filled / f4Total) * 100);

    case 5:
      // Fiche 5 : Analyse problmes
      let f5Filled = 0;
      let f5Total = 1;
      if (data.analyseProblemes && data.analyseProblemes.length > 0) f5Filled++;
      return Math.round((f5Filled / f5Total) * 100);

    case 6:
    case 7:
      // Fiche 6/7 : Planification
      let f6Filled = 0;
      let f6Total = 1;
      if (data.fiche7 && data.fiche7.length > 0) f6Filled++;
      return Math.round((f6Filled / f6Total) * 100);

    case 8:
      // Fiche 8 : Moyens/Cots
      let f8Filled = 0;
      let f8Total = 1;
      if (data.moyensCouts && data.moyensCouts.length > 0) {
        f8Filled++;
      }
      return Math.round((f8Filled / f8Total) * 100);

    default:
      return 0;
  }
};
