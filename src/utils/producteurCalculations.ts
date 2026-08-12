import { Producteur } from '../core/types/producteur';

export const parseNum = (s: any): number => {
  return parseFloat(String(s || '').replace(/[\s]/g, '')) || 0;
};

export const getSupCacao = (p: Producteur): number => {
  return (p?.cultures || [])
    .filter(c => (c.nom || '').toLowerCase().includes('cacao'))
    .reduce((s, c) => s + (parseFloat(String(c.superficie)) || 0), 0);
};

export const getSupTotale = (p: Producteur): number => {
  return (p?.cultures || []).reduce((s, c) => s + (parseFloat(String(c.superficie)) || 0), 0);
};

export const getMaladiesActives = (p: Producteur) => {
  return (p?.cacaoyere?.maladies || []).filter(m => m.severite && m.severite !== 'Aucun');
};

export function getFicheStatus(p: Producteur) {
  return [
    { label: 'Fiche 1 – Profil', step: 1, ok: !!(p.nom && p.contact && p.codeNational && p.codeGroupe && p.codeEntite), partial: !!(p.nom || p.contact) },
    { label: 'Fiche 2 – Exploitation', step: 2, ok: (p.cultures || []).some(c => parseFloat(String(c.superficie)) > 0), partial: !!(p.supTotale || p.supCacao || (p.cultures||[]).length > 0) },
    { label: 'Fiche 3 – Cacaoyère', step: 3, ok: !!(p.cacaoyere?.dispositif && p.cacaoyere?.densite), partial: !!(p.cacaoyere?.dispositif || p.cacaoyere?.maladies?.length) },
    { label: 'Fiche 4 – Socio-éco', step: 4, ok: !!(p.productionCacaoAncienne?.[0]?.prod), partial: !!(p.profilSocioEconomique?.accessCredit || (p.depensesFoyer||[]).length > 0) },
    { label: 'Fiche 5 – Problèmes', step: 5, ok: (p.analyseProblemes || []).some(r => r.problemes), partial: (p.analyseProblemes || []).some(r => r.problemes || r.causes) },
    { label: 'Fiche 6 – Planification', step: 6, ok: (p.fiche7 || []).some(a => a.activites?.some(ac => ac.obj || ac.act)), partial: !!(p.fiche7?.length) },
    { label: 'Fiche 7 – Moyens/Coûts', step: 7, ok: (p.moyensCouts || []).some(g => g.items?.some(i => i.a1q || i.a1c)), partial: !!(p.moyensCouts?.length) },
  ];
}

export function getFinance(p: Producteur) {
  const revCacao = parseNum(p?.productionCacaoAncienne?.[0]?.revenu);
  const revAutres = (p?.sourcesRevenusAutres || []).reduce((s, r) => s + parseNum(r.revenu), 0);
  const depFoyer = (p?.depensesFoyer || []).reduce((s, d) => s + parseNum(d.montant), 0);
  const depMO = (p?.mainOeuvre || []).reduce((s, m) => s + parseNum(m.cout), 0);
  
  const revTotal = revCacao + revAutres;
  const depTotal = depFoyer + depMO;
  
  return { revCacao, revAutres, revTotal, depFoyer, depMO, depTotal, solde: revTotal - depTotal };
}

export function getAggregateStats(producteurs: Producteur[]) {
  return {
    totalProducteurs: producteurs.length,
    supTotale: producteurs.reduce((s, p) => s + getSupTotale(p), 0),
    supCacao: producteurs.reduce((s, p) => s + getSupCacao(p), 0),
    prodEstimee: producteurs.reduce((s, p) => s + (p.cultures||[]).reduce((cs: number, c: any) => cs + parseNum(c.production), 0), 0),
    revenus: producteurs.reduce((s, p) => s + (p.cultures||[]).reduce((cs: number, c: any) => cs + parseNum(c.revenu), 0), 0),
    couts: producteurs.reduce((s, p) => s + (p.couts?.reduce((cs: number, c: any) => cs + (parseNum(c.total) || 0), 0) || 0), 0) // fallback from legacy
  };
}

export function getAvancementPDCGlobal(producteurs: Producteur[]): number {
  if (producteurs.length === 0) return 0;
  const totalFiches = producteurs.length * 7;
  let okCount = 0;
  producteurs.forEach(p => {
    const fiches = getFicheStatus(p);
    okCount += fiches.filter(f => f.ok).length;
  });
  return Math.round((okCount / totalFiches) * 100);
}

export function getAvancementParFiche(producteurs: Producteur[]) {
  if (producteurs.length === 0) return [];
  const result: Record<number, { label: string, count: number }> = {};
  
  producteurs.forEach(p => {
    const fiches = getFicheStatus(p);
    fiches.forEach(f => {
      if (!result[f.step]) {
        result[f.step] = { label: f.label, count: 0 };
      }
      if (f.ok) result[f.step].count++;
    });
  });
  
  return Object.values(result).map(r => ({
    label: r.label,
    percent: Math.round((r.count / producteurs.length) * 100)
  }));
}

export function getAlertes(producteurs: Producteur[]) {
  let pdcIncomplets = 0;
  let maladiesActives = 0;
  let missingFinancials = 0;

  producteurs.forEach(p => {
    const fiches = getFicheStatus(p);
    if (fiches.some(f => !f.ok)) pdcIncomplets++;
    if (getMaladiesActives(p).length > 0) maladiesActives++;
    
    const finance = getFinance(p);
    if (finance.revTotal === 0 && finance.depTotal === 0) {
      missingFinancials++;
    }
  });

  const alertes = [];
  if (pdcIncomplets > 0) alertes.push({ type: 'warning', message: `${pdcIncomplets} PDC incomplets`, count: pdcIncomplets });
  if (maladiesActives > 0) alertes.push({ type: 'error', message: `${maladiesActives} plantations avec maladies actives`, count: maladiesActives });
  if (missingFinancials > 0) alertes.push({ type: 'info', message: `${missingFinancials} bilans financiers vides`, count: missingFinancials });

  return alertes;
}

export function getPerformanceCultures(producteurs: Producteur[]) {
  const prodMap: Record<string, number> = {};
  let total = 0;

  producteurs.forEach(p => {
    const allCultures = [...(p.cultures || []), ...(p.donneesCultures || [])];
    allCultures.forEach(c => {
      let nom = (c.nom || c.libelle || 'Autre').trim();
      if (nom.toLowerCase() === 'autre' || !nom) nom = 'Autres';
      const val = parseNum(c.production);
      if (val > 0) {
        prodMap[nom] = (prodMap[nom] || 0) + val;
        total += val;
      }
    });
  });

  return Object.entries(prodMap)
    .sort((a, b) => b[1] - a[1])
    .map(([nom, production]) => ({
      nom,
      production,
      percent: total > 0 ? Math.round((production / total) * 100) : 0
    }));
}

export function getDashboardScores(producteurs: Producteur[]) {
  if (producteurs.length === 0) return 0;
  return getAvancementPDCGlobal(producteurs);
}

export function getTopProgressions(producteurs: Producteur[]) {
  const progs = producteurs.map(p => {
    const hist = p.productionCacaoAncienne || [];
    if (hist.length < 2) return null;
    
    // hist[0] is typically the most recent (N-1)
    // We compare with the oldest available in the history (hist[hist.length - 1], usually N-3)
    const rN1 = parseNum(hist[0]?.revenu);
    const rOld = parseNum(hist[hist.length - 1]?.revenu);
    
    if (rOld <= 0 || rN1 <= rOld) return null;
    
    const pct = Math.round(((rN1 - rOld) / rOld) * 100);
    return {
      producteur: p,
      rOld,
      rN1,
      pct
    };
  }).filter(Boolean) as any[];

  progs.sort((a, b) => b.pct - a.pct);
  return progs.slice(0, 3);
}

export function getImpactMetrics(producteurs: Producteur[]) {
  const intMap: Record<string, number> = {
    'Investissement': 0,
    'Intrants': 0,
    'Main d\'œuvre': 0,
    'Activités spécifiques': 0
  };
  
  let replantedArea = 0;
  let formationsCount = 0;

  producteurs.forEach(p => {
    // 1. Equipements/Intrants from Fiche 8
    (p.moyensCouts || []).forEach(g => {
      let qteForGroup = 0;
      (g.items || []).forEach(i => {
         // sum a1q, a2q, a3q, a4q, a5q (if any exist)
         const q = parseNum(i.a1q) + parseNum(i.a2q) + parseNum(i.a3q) + parseNum(i.a4q) + parseNum(i.a5q);
         qteForGroup += q;
      });
      
      const catName = g.nom;
      if (intMap[catName] !== undefined) {
         intMap[catName] += qteForGroup;
      } else if (qteForGroup > 0) {
         intMap[catName] = (intMap[catName] || 0) + qteForGroup;
      }
    });

    // 2. Replanted Area from Fiche 6
    (p.fiche7 || []).forEach(axe => {
       (axe.activites || []).forEach(act => {
          if ((act.act || '').toLowerCase().includes('replantation') || (act.obj || '').toLowerCase().includes('réhabilitation')) {
             replantedArea += 1;
          }
       });
    });
    // also check p.planification (Fiche 6 alias)
    (p.planification || []).forEach((axe: any) => {
       (axe.activites || []).forEach((act: any) => {
          if ((act.act || act.activite || '').toLowerCase().includes('replantation') || (act.obj || act.objectif || '').toLowerCase().includes('réhabilitation')) {
             replantedArea += 1;
          }
       });
    });

    // 3. Formations from Fiche 4
    if (p.profilSocioEconomique?.formationRecue && p.profilSocioEconomique.formationRecue.toLowerCase() !== 'non' && p.profilSocioEconomique.formationRecue.toLowerCase() !== 'aucune') {
      formationsCount++;
    }
  });

  return {
    investissements: intMap,
    formationsCount,
    replantationActions: replantedArea
  };
}
