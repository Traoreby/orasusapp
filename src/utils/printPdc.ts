import { FICHE1_FIELDS } from '../constants/fiche1Fields';
import { Producteur, MenageMember, Culture, DepenseFoyer, SourceRevenusAutres, ProductionAncienne, EpargneFinancement, MainOeuvre, AnalyseProbleme, AxePlanification, CategorieMoyenCout, ActivitePlanification, ItemMoyenCout, Materiel, ArbreDiagnostic, Maladie, RowValueOb, RecGauche, RecDroite, ApplicationEngraisPhyto, HistoriqueProduction } from '../core/types/producteur';

export function generatePdcHtml(data: Producteur): string {
  // Fiche 1
  const menage = data.menage || [];
  
  // Fiche 2
  const coord = data.coordonnees || {};
  const cultures = data.cultures || (data.donneesCultures && data.donneesCultures.length > 0 ? data.donneesCultures : [
    { libelle: 'Champs 1', isAutre: false },
    { libelle: 'Champs 2', isAutre: false },
    { libelle: 'Champs 3', isAutre: false },
    { libelle: '', isAutre: true },
    { libelle: '', isAutre: true },
  ]);
  const materiels = data.materiels && data.materiels.length > 0 ? data.materiels : [
    { type: 'Matériel de traitement', designation: 'Pulvérisateur' },
    { designation: 'Atomiseur' },
    { designation: 'EPI' },
    { type: 'Matériel de transport', designation: 'Tricycle' },
    { designation: 'Brouette' },
    { designation: 'Camion/camionnette' },
    { type: 'Moyen de déplacement', designation: 'Vélo' },
    { designation: 'Moto' },
    { designation: 'Voiture' },
    { type: 'Matériel de séchage', designation: 'Claie/séco' },
    { designation: 'Aire cimentée' },
    { designation: 'Séchoir solaire' },
    { type: 'Matériel de fermentation', designation: 'Bac de fermentation' },
    { type: 'Petit outillage', designation: 'Machette, émondoir,' },
    { designation: 'Matériel de récolte' },
    { type: 'Autres', designation: 'Tronçonneuse' },
    { designation: '......' },
    { designation: '......' }
  ];
  
  // Fiche 3
  const cacaoyere = data.cacaoyere || {};
  const sg = data.solGauche || [];
  const sd = data.solDroite || [];
  const rg = data.recGauche || [];
  const rd = data.recDroite || [];
  const maladies = data.maladiesRows || [];
  const parametres = data.parametresRows || [];
  const arbres = data.diagnosticArbres || [];
  const engrais = data.applicationEngrais || [];
  const phyto = data.applicationPhyto || [];
  const emballages = data.emballagesReponse || '';

  // Fiche 4
  const socioEco = data.profilSocioEconomique || {};
  const epargne = data.epargneFinancement || [];
  const historique = data.historiqueProduction || [];
  const revenusAutres = data.sourcesRevenusAutres || [];
  const depenses = data.depensesFoyer || [];
  const mainOeuvre = data.mainOeuvre || [];
  
  // Fiche 5
  const problemes = data.analyseProblemes || [];
  
  // Fiche 6
  const planification = data.planification || data.planificationStrategique || [];
  
  // Fiche 7
  const programmeAnnuel = data.programmeAnnuel || [];
  
  // Fiche 8
  const moyensCouts = data.moyensCouts || [];

  // Group Materiels by type for Fiche 2
  const groupedMateriels: { type: string, items: any[] }[] = [];
  let currentMatGroup: { type: string, items: any[] } | null = null;
  for (const m of materiels) {
    if (m.type) {
      if (currentMatGroup) groupedMateriels.push(currentMatGroup);
      currentMatGroup = { type: m.type, items: [m] };
    } else {
      if (currentMatGroup) currentMatGroup.items.push(m);
    }
  }
  if (currentMatGroup) groupedMateriels.push(currentMatGroup);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDC - ${(data.nom || '').replace('? ', '').replace('?', '').trim()}</title>
  <style>
    /* GLOBAL UNIFIED PRINT STYLES */
    body { font-family: Arial, sans-serif; font-size: 11px; margin: 0; padding: 0; background-color: #fff; color: #000; }
    *, *::before, *::after { box-sizing: border-box; }
    h1, h2, h3, h4, p { margin: 0; padding: 0; color: #000; }
    .page { padding: 10px; width: 100%; max-width: 1000px; margin: 0 auto; background-color: #fff; color: #000; }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; page-break-inside: avoid; border: 1px solid #000; background-color: #fff; color: #000; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
    th, td { border: 1px solid #000; padding: 6px; box-sizing: border-box; color: #000; }
    th { background-color: #f0f0f0 !important; color: #000 !important; font-weight: bold; text-align: center; font-size: 11px; }
    td { font-size: 11px; color: #000 !important; }
    
    .th-gray, .bg-gray-light, .bg-gray { background-color: #f0f0f0 !important; color: #000 !important; }
    .text-center { text-align: center; }
    .font-bold { font-weight: bold; }
    .italic { font-style: italic; }
    .uppercase { text-transform: uppercase; }
    
    .fiche-title { font-size: 14px; font-weight: bold; color: #000 !important; text-decoration: underline; text-transform: uppercase; margin: 16px 0 8px 0; }
    .section-title { font-size: 12px; font-weight: bold; color: #000 !important; margin-bottom: 4px; margin-top: 12px; }
    
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: #fff; color: #000; }
      .page-break { page-break-before: always; }
      @page { margin: 10mm; size: A4 portrait; }
      @page landscape-page { size: A4 landscape; margin: 10mm; }
      .landscape { page: landscape-page; }
    }
  </style>
</head>
<body>

  

          <!-- PAGE 1 -->
    <div class="page">
      
      <!-- Titre principal du document -->
      <div style="border: 2px solid #3b82f6; padding: 24px; margin-bottom: 30px; text-align: center; border-radius: 8px; background-color: #ffffff;">
        <h1 style="font-size: 26px; color: #e11d48; text-transform: uppercase; font-weight: bold; line-height: 1.4; margin: 0;">
          PLAN DE DEVELOPPEMENT<br/>DE LA CACAOYERE (PDC)
        </h1>
      </div>
      
      <!-- Sous-titre Section 1 -->
      <h3 style="font-size: 16px; font-weight: bold; color: #000000; text-transform: uppercase; margin-bottom: 12px;">
        ❖ IDENTIFICATION DU PRODUCTEUR
      </h3>
      
      <!-- Tableau dynamique d'identification -->
      <table style="width: 100%; border-collapse: collapse;  margin-bottom: 30px;">
        <tbody>
          ${FICHE1_FIELDS.map((f: any) => `
            <tr>
              <td style="width: 45%; padding: 8px 12px;  font-weight: normal; font-size: 12px; color: #000000; box-sizing: border-box;">
                ${f.label}
              </td>
              <td style="width: 55%; padding: 8px 12px;  font-weight: bold; font-size: 12px; color: #000000; box-sizing: border-box;">
                ${(data as any)[f.id] || ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Sous-titre Section 2 -->
      <h3 style="font-size: 14px; font-weight: bold; color: #000000; margin-bottom: 12px; margin-top: 20px;">
        Sous-section 2 : Information sur le ménage
      </h3>
      
      <!-- Tableau Ménage -->
      <table style="width: 100%; border-collapse: collapse; ">
        <thead>
          <tr>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Nom</th>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Statut/Famille¹</th>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Statut/Plantation²</th>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Statut Scolaire³</th>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Contact</th>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Année naiss.</th>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Sexe</th>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Niveau instr.⁴</th>
            <th style="background-color: #f0f0f0; color: #000000;  padding: 6px; text-align: center; font-size: 11px;">Ethnie⁵</th>
          </tr>
        </thead>
        <tbody>
          ${menage.length > 0 ? menage.map(m => `
            <tr>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.nom || ''}</td>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.statutFamille || ''}</td>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.statutPlantation || ''}</td>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.statutScolaire || ''}</td>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.contact || ''}</td>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.anneeNaissance || ''}</td>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.sexe || ''}</td>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.niveauInstruction || ''}</td>
              <td style=" padding: 6px; text-align: center; vertical-align: middle; font-size: 11px; color: #000000; box-sizing: border-box;">${m.categorieEthnique || ''}</td>
            </tr>
          `).join('') : `<tr><td colspan="9" style=" padding: 6px; text-align: center; font-style: italic; font-size: 11px;">Non renseigné</td></tr>`}
        </tbody>
      </table>
      
    </div>
    
    <div class="page-break"></div>
    
    <div class="page">
      <!-- LE RESTE DU DOCUMENT EN CLAIR COMMENCE ICI -->
      
            <!-- FICHE 2 -->
      <h3 class="fiche-title" style="color: #000000;"><span style="color: #22c55e;">◆</span> FICHE 2 : PROFIL DE L'EXPLOITATION</h3>
    
    <h4 class="section-title" style="color: #000000; font-weight: bold;">❖ Coordonnées Géographiques de la cacaoyère</h4>
    <div style="margin-bottom: 16px; font-size: 11px;">
      <div style="margin-bottom: 12px; display: flex; align-items: flex-end;">
        <span style="margin-right: 8px;">Waypoints O :</span>
        <span style="display: inline-block; width: 150px; border-bottom: 1px dashed #000; text-align: center;">${coord.waypointO || ''}</span>
        <span style="margin-right: 8px; margin-left: 30px;">N :</span>
        <span style="display: inline-block; width: 150px; border-bottom: 1px dashed #000; text-align: center;">${coord.waypointN || ''}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%; box-sizing: border-box;">
        <div style="display: inline-flex; align-items: flex-end; white-space: nowrap; flex: 1;">
          <span style="margin-right: 8px;">Sous/préfecture :</span>
          <span style="flex-grow: 1; border-bottom: 1px dashed #000; text-align: center; margin-right: 20px;">${data.sousPrefecture || ''}</span>
        </div>
        <div style="display: inline-flex; align-items: flex-end; white-space: nowrap; flex: 1;">
          <span style="margin-right: 8px;">Village :</span>
          <span style="flex-grow: 1; border-bottom: 1px dashed #000; text-align: center; margin-right: 20px;">${data.village || ''}</span>
        </div>
        <div style="display: inline-flex; align-items: flex-end; white-space: nowrap; flex: 1;">
          <span style="margin-right: 8px;">Campement :</span>
          <span style="flex-grow: 1; border-bottom: 1px dashed #000; text-align: center;">${data.campement || ''}</span>
        </div>
      </div>
    </div>
    
    <h4 class="section-title" style="color: #000000; font-weight: bold;">❖ Données sur les cultures</h4>
    <table >
      <thead>
        <tr>
          <th rowspan="2">Libellé</th>
          <th rowspan="2">Année de création</th>
          <th rowspan="2">Précédent cultural</th>
          <th rowspan="2">Sup. (ha)</th>
          <th rowspan="2">Origine matériel végétal</th>
          <th colspan="2">Le champs est-il en production</th>
        </tr>
        <tr>
          <th style="width: 50px;">Oui</th>
          <th style="width: 50px;">Non</th>
        </tr>
      </thead>
      <tbody>
        <tr><td colspan="7" style="background-color: #ffffff; color: #000000; font-weight: bold; border-left: none; border-right: none; border-bottom: 1px solid #000000; text-align: left; padding-left: 8px;">Cacao</td></tr>
        ${cultures.filter(c => !c.isAutre).map(c => `
          <tr>
            <td style=" color: #000000;">${c.libelle || ''}</td>
            <td class="text-center" >${c.annee || ''}</td>
            <td class="text-center" >${c.precedent || ''}</td>
            <td class="text-center" >${c.sup || c.superficie || ''}</td>
            <td class="text-center" >${c.origine || ''}</td>
            <td class="text-center font-bold" style=" font-size: 14px;">${c.enProduction === 'Oui' ? '☑' : '☐'}</td>
            <td class="text-center font-bold" style=" font-size: 14px;">${c.enProduction === 'Non' ? '☑' : '☐'}</td>
          </tr>
        `).join('')}
        
        <tr><td colspan="7" style="background-color: #ffffff; color: #000000; font-weight: bold; border-left: none; border-right: none; border-bottom: 1px solid #000000; border-top: 1px solid #000000; text-align: left; padding-left: 8px;">Autres cultures</td></tr>
        ${cultures.filter(c => c.isAutre).map(c => `
          <tr>
            <td style=" color: #000000;">${c.libelle || ''}</td>
            <td class="text-center" >${c.annee || ''}</td>
            <td class="text-center" >${c.precedent || ''}</td>
            <td class="text-center" >${c.sup || c.superficie || ''}</td>
            <td class="text-center" >${c.origine || ''}</td>
            <td class="text-center font-bold" style=" font-size: 14px;">${c.enProduction === 'Oui' ? '☑' : '☐'}</td>
            <td class="text-center font-bold" style=" font-size: 14px;">${c.enProduction === 'Non' ? '☑' : '☐'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h4 class="section-title" style="color: #000000; font-weight: bold;">❖ Matériels agricoles/Equipements de travail</h4>
    <table style=" table-layout: fixed;">
      <colgroup>
        <col style="width: 17%;" />
        <col style="width: 25%;" />
        <col style="width: 8%;" />
        <col style="width: 13%;" />
        <col style="width: 13%;" />
        <col style="width: 8%;" />
        <col style="width: 8%;" />
        <col style="width: 8%;" />
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2" >Type</th>
          <th rowspan="2" >Désignation</th>
          <th rowspan="2" >Quantité</th>
          <th rowspan="2" >Année d'acquisition</th>
          <th rowspan="2" >Coût</th>
          <th colspan="3" >Etat (précisez le nombre)</th>
        </tr>
        <tr>
          <th >Bon</th>
          <th >Acceptable</th>
          <th >Mauvais</th>
        </tr>
      </thead>
      <tbody>
        ${groupedMateriels.length > 0 ? groupedMateriels.map(g => 
          g.items.map((m, idx) => `
            <tr>
              ${idx === 0 ? `<td rowspan="${g.items.length}" style="font-weight: bold; vertical-align: middle; text-align: center; ">${g.type}</td>` : ''}
              <td >${m.designationValue || m.designation || ''}</td>
              <td class="text-center" >${m.qte || ''}</td>
              <td class="text-center" >${m.annee || ''}</td>
              <td class="text-center" >${m.cout || ''}</td>
              <td class="text-center" >${m.bon === 'true' || (m.bon as any) === true ? '☑' : (m.bon || '')}</td>
              <td class="text-center" >${m.acc === 'true' || (m.acc as any) === true ? '☑' : (m.acc || '')}</td>
              <td class="text-center" >${m.mauv === 'true' || (m.mauv as any) === true ? '☑' : (m.mauv || '')}</td>
            </tr>
          `).join('')
        ).join('') : `<tr><td colspan="8" class="text-center italic" >Non renseigné</td></tr>`}
      </tbody>
    </table>
    </div>
    <div class="landscape">
    <h4 class="section-title">❖ Diagnostic des arbres autres que le cacaoyer sur l'exploitation</h4>
    <table style="table-layout: fixed;">
      <colgroup>
        <col style="width: 5%;" />
        <col style="width: 14%;" />
        <col style="width: 14%;" />
        <col style="width: 10%;" />
        <col style="width: 7%;" />
        <col style="width: 7%;" />
        <col style="width: 10%;" />
        <col style="width: 9%;" />
        <col style="width: 7%;" />
        <col style="width: 7%;" />
        <col style="width: 10%;" />
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">N° arbre</th>
          <th colspan="2">Arbres forestiers et fruitiers présents dans la cacaoyère</th>
          <th rowspan="2">Circonférence (à hauteur de poitrine)</th>
          <th colspan="2">Origine de l'arbre</th>
          <th colspan="2">Usage</th>
          <th colspan="3">Décision</th>
        </tr>
        <tr>
          <th>Nom botanique</th>
          <th>Nom local</th>
          <th>Préservé</th>
          <th>Plantés</th>
          <th>Organe utilisé</th>
          <th>Utilité</th>
          <th>A éliminer</th>
          <th>A maintenir</th>
          <th>Raisons</th>
        </tr>
      </thead>
      <tbody>
        ${arbres.length > 0 ? arbres.map((a, idx) => `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td>${a.nomBotanique || ''}</td>
            <td>${a.nomLocal || ''}</td>
            <td class="text-center">${a.circonference || ''}</td>
            <td class="text-center font-bold">${(a.origine === 'Préservé' || a.origine === 'Naturel') ? '☑' : '☐'}</td>
            <td class="text-center font-bold">${(a.origine === 'Planté' || a.origine === 'Plantés') ? '☑' : '☐'}</td>
            <td class="text-center">${a.organe || ''}</td>
            <td class="text-center">${a.utilite || ''}</td>
            <td class="text-center font-bold">${(a.decision === 'Abattre' || a.decision === 'A éliminer') ? '☑' : '☐'}</td>
            <td class="text-center font-bold">${(a.decision === 'Conserver' || a.decision === 'A maintenir') ? '☑' : '☐'}</td>
            <td>${a.raisons || ''}</td>
          </tr>
        `).join('') : `<tr><td colspan="11" class="text-center italic">Non renseigné</td></tr>`}
      </tbody>
    </table>
    </div>

    <div class="page">
    <!-- FICHE 3 -->
    <h3 class="fiche-title"><span style="color: #22c55e;">◆</span> FICHE 3 : INFORMATIONS SUR LA CACAOYERE</h3>
    
    <h4 class="section-title">❖ Etat de la cacaoyère</h4>
    <div style="margin-bottom: 16px; padding-left: 10px;">
      <div style="margin-bottom: 6px;">O Dispositif de plantation (1. En lignes_2. En désordre) : <span class="font-bold">${cacaoyere.dispositif ? cacaoyere.dispositif : ''}</span></div>
      <div style="margin-bottom: 6px;">O Densité des arbres : <span class="font-bold">${cacaoyere.densite ? cacaoyere.densite : ''}</span> (déterminée par 4 carrés de rendement de 100 m²)</div>
      <div style="margin-bottom: 6px;">O Nombre moyen de tiges/cacaoyer : <span class="font-bold">${cacaoyere.tiges ? cacaoyere.tiges : ''}</span></div>
      <div style="margin-bottom: 6px;">O Existence de plage vides dans le champ (Peu (<= 5)_Beaucoup (> 5)) : <span class="font-bold">${cacaoyere.plagesVides ? cacaoyere.plagesVides : ''}</span></div>
      <div style="margin-bottom: 6px;">O Etendue des plage vides (levé au GPS) : <span class="font-bold">${cacaoyere.etenduePlages ? cacaoyere.etenduePlages : ''}</span></div>
      <div style="margin-bottom: 6px;">O Ombrage des arbres autres que le cacaoyer (1. Inexistant_2. Moyen_3.Dense) : <span class="font-bold">${cacaoyere.ombrage ? cacaoyere.ombrage : ''}</span></div>
      <div>O Présentation de la canopée/couronne (normal, peu dégradé, dégradé,) : <span class="font-bold">${cacaoyere.canopee ? cacaoyere.canopee : ''}</span></div>
    </div>

    <table style="table-layout: fixed; margin-bottom: 2px;">
      <colgroup>
        <col style="width: 26%;" />
        <col style="width: 10%;" />
        <col style="width: 14%;" />
        <col style="width: 26%;" />
        <col style="width: 10%;" />
        <col style="width: 14%;" />
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">Maladies/ravageurs</th>
          <th>Sévérité</th>
          <th rowspan="2">Observations</th>
          <th rowspan="2">Paramètres</th>
          <th>Valeur</th>
          <th rowspan="2">Observations</th>
        </tr>
        <tr>
          <th style="font-weight: normal; font-size: 9px; line-height: 1.2;">1.Aucun / 2.Faible<br/>3.Moyen / 4.Fort</th>
          <th style="font-weight: normal; font-size: 9px; line-height: 1.2;">1.Aucun / 2.Faible<br/>3.Moyen / 4.Fort</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          const MALADIES_FIXES = [
            'Attaques de mirides',
            'Attaques de Pourriture Brune',
            'Présence de plantes épiphytes',
            'Attaque Foreurs',
            'Attaque CSSVD',
            'Autres (Précisez)*'
          ];
          const PARAMS_FIXES = [
            'Présence de gourmands',
            'Présence de cabosses momifiées',
            'Présence de loranthus',
            'Enherbement',
            '',
            ''
          ];
          
          const userMal = data.maladiesRows && data.maladiesRows.length > 0 ? data.maladiesRows : MALADIES_FIXES.map(nom => ({ nom, severite: '', observations: '' }));
          const userPar = data.parametresRows && data.parametresRows.length > 0 ? data.parametresRows : PARAMS_FIXES.map(nom => ({ nom, valeur: '', observations: '' }));
          
          const maxLen = Math.max(userMal.length, userPar.length, 6);
          let rows = [];
          for (let i = 0; i < maxLen; i++) {
            const m = userMal[i] || {};
            const p = userPar[i] || {};
            rows.push(`
          <tr>
            <td class="font-bold">${m.nom || MALADIES_FIXES[i] || ''}</td>
            <td class="text-center">${m.severite || ''}</td>
            <td>${m.observations || ''}</td>
            <td class="font-bold">${p.nom || PARAMS_FIXES[i] || ''}</td>
            <td class="text-center">${p.valeur || ''}</td>
            <td>${p.observations || ''}</td>
          </tr>`);
          }
          return rows.join('');
        })()}
      </tbody>
    </table>
    <div style="font-style: italic; font-size: 9px; margin-bottom: 20px;">* Décrire les symptômes au cas où la maladie/ le ravageur n'est pas connu</div>
    <h4 class="section-title">❖ État du sol</h4>
    <div style="margin-bottom: 12px; padding-left: 10px;">
      <div>O Positionnement de la parcelle : <span style="display: inline-block; width: 200px; border-bottom: 1px dashed #000; text-align: center; font-weight: bold;">${data.positionParcelle || ''}</span></div>
    </div>
    
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 20%;" />
        <col style="width: 18%;" />
        <col style="width: 12%;" />
        <col style="width: 20%;" />
        <col style="width: 15%;" />
        <col style="width: 15%;" />
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">Eléments d'observation</th>
          <th>Valeur</th>
          <th rowspan="2">Observations</th>
          <th rowspan="2">Eléments d'observation</th>
          <th>Valeur</th>
          <th rowspan="2">Observations</th>
        </tr>
        <tr>
          <th style="font-weight: normal; font-size: 8px; line-height: 1.2; overflow: hidden; white-space: normal;">1.Beaucoup / 2.Moyen / 3.Faible</th>
          <th style="font-weight: normal; font-size: 9px; line-height: 1.2;">1.Oui / 2.Non</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          const SOL_LEFT_FIXES = ['Couvert végétal', 'Présence de Matière organique', 'Profondeur', 'Texture', 'Hydromorphie'];
          const SOL_RIGHT_FIXES = [
            { nom: 'Existence de zones érodées' },
            { nom: "Existence de zones à risque d'érosion" }
          ];
          
          const userSg = data.solGauche && data.solGauche.length > 0 ? data.solGauche : SOL_LEFT_FIXES.map(nom => ({ nom, valeur: '', observations: '' }));
          const userSd = data.solDroite && data.solDroite.length > 0 ? data.solDroite : [
            ...SOL_RIGHT_FIXES.map(r => ({ nom: r.nom, valeur: '', observations: '' })),
            { nom: '', valeur: '', observations: '' },
            { nom: '', valeur: '', observations: '' },
            { nom: '', valeur: '', observations: '' },
          ];
          
          const maxLen = Math.max(userSg.length, userSd.length, 5);
          let rows = [];
          for (let i = 0; i < maxLen; i++) {
            const l = userSg[i] || {};
            const r = userSd[i] || {};
            rows.push(`
          <tr>
            <td class="font-bold">${l.nom || SOL_LEFT_FIXES[i] || ''}</td>
            <td class="text-center">${l.valeur || ''}</td>
            <td>${l.observations || ''}</td>
            <td class="font-bold">${r.nom || (SOL_RIGHT_FIXES[i] ? SOL_RIGHT_FIXES[i].nom : '') || ''}</td>
            <td class="text-center">${r.valeur || ''}</td>
            <td>${r.observations || ''}</td>
          </tr>`);
          }
          return rows.join('');
        })()}
      </tbody>
    </table>

    
    <h4 class="section-title">❖ Pratiques de récolte et post-récolte</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 35%;" />
        <col style="width: 15%;" />
        <col style="width: 35%;" />
        <col style="width: 15%;" />
      </colgroup>
      <thead>
        <tr>
          <th>Éléments d'observation</th>
          <th>Réponses</th>
          <th>Éléments d'observation</th>
          <th>Réponses</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Fréquence des récoltes (Espacement entre 2 Récoltes en <strong>nbre de jours</strong>)</td>
          <td class="text-center font-bold">${rg[0] ? rg[0].val || '' : ''}</td>
          <td>Mode de fermentation : <strong>1.</strong> Bâche en plastique / <strong>2.</strong> Feuilles de bananier / <strong>3.</strong> Bac de fermentation / <strong>4.</strong> Autre (<em>à préciser</em>)</td>
          <td class="text-center font-bold">${rd[0] ? rd[0].val || '' : ''}</td>
        </tr>
        <tr>
          <td>Temps entre la récolte et l'écabossage (<strong>nbre de jours</strong>)</td>
          <td class="text-center font-bold">${rg[1] ? rg[1].val || '' : ''}</td>
          <td>Méthodes de Séchage : <strong>1.</strong> Sur goudron / <strong>2.</strong> Sur aire cimentée / <strong>3.</strong> Sur bâche en plastique à terre / <strong>4.</strong> Sur claie / <strong>5.</strong> Autre (<em>à préciser</em>)</td>
          <td class="text-center font-bold">${rd[1] ? rd[1].val || '' : ''}</td>
        </tr>
        <tr>
          <td>Durée de la fermentation (<strong>nbre de jours</strong>)</td>
          <td class="text-center font-bold">${rg[2] ? rg[2].val || '' : ''}</td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <h4 class="section-title">❖ Application des engrais</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 18%;" />
        <col style="width: 25%;" />
        <col style="width: 12%;" />
        <col style="width: 15%;" />
        <col style="width: 15%;" />
        <col style="width: 15%;" />
      </colgroup>
      <thead>
        <tr>
          <th>Type d'engrais<br/><span style="font-weight: normal; font-size: 9px;">(minéraux, organiques, ...)</span></th>
          <th>Nom commercial / formule</th>
          <th>Quantité / an</th>
          <th>Période d'apport</th>
          <th>Mode d'apport<br/><span style="font-weight: normal; font-size: 9px;">(foliaire, au sol)</span></th>
          <th>Applicateur<br/><span style="font-weight: normal; font-size: 9px;">1.Producteur / 2.Applicateur</span></th>
        </tr>
      </thead>
      <tbody>
        ${engrais.length > 0 ? engrais.map(e => `
          <tr>
            <td class="text-center">${e.type || ''}</td>
            <td class="text-center">${e.nom || ''}</td>
            <td class="text-center">${e.qte || ''}</td>
            <td class="text-center">${e.periode || ''}</td>
            <td class="text-center">${e.mode || ''}</td>
            <td class="text-center">${e.applicateur || ''}</td>
          </tr>
        `).join('') : `<tr><td colspan="6" class="text-center italic">Non renseigné</td></tr>`}
      </tbody>
    </table>

    <h4 class="section-title">❖ Application de produits phytosanitaires</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 18%;" />
        <col style="width: 25%;" />
        <col style="width: 12%;" />
        <col style="width: 15%;" />
        <col style="width: 15%;" />
        <col style="width: 15%;" />
      </colgroup>
      <thead>
        <tr>
          <th>Type de produits<br/><span style="font-weight: normal; font-size: 9px;">(insecticide, fongicide, herbicide)</span></th>
          <th>Nom commercial / formule</th>
          <th>Quantité / traitement</th>
          <th>Période de traitement</th>
          <th>Mode d'apport<br/><span style="font-weight: normal; font-size: 9px;">(atomiseur, pulvérisateur)</span></th>
          <th>Applicateur<br/><span style="font-weight: normal; font-size: 9px;">1.Producteur / 2.Applicateur</span></th>
        </tr>
      </thead>
      <tbody>
        ${phyto.length > 0 ? phyto.map(p => `
          <tr>
            <td class="text-center">${p.type || ''}</td>
            <td class="text-center">${p.nom || ''}</td>
            <td class="text-center">${p.qte || ''}</td>
            <td class="text-center">${p.periode || ''}</td>
            <td class="text-center">${p.mode || ''}</td>
            <td class="text-center">${p.applicateur || ''}</td>
          </tr>
        `).join('') : `<tr><td colspan="6" class="text-center italic">Non renseigné</td></tr>`}
      </tbody>
    </table>

    <h4 class="section-title">❖ Gestion des emballages</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 50%;" />
        <col style="width: 50%;" />
      </colgroup>
      <tbody>
        <tr>
          <td class="font-bold" style="padding: 10px;">Que faites-vous des emballages après traitement / application ?</td>
          <td class="text-center font-bold">${emballages || ''}</td>
        </tr>
      </tbody>
    </table>

    <div class="page-break"></div>

    <!-- FICHE 4 -->
    <h3 class="fiche-title"><span style="color: #22c55e;">◆</span> FICHE 4 : PROFIL SOCIO-ECONOMIQUE DU PRODUCTEUR</h3>
    
    <h4 class="section-title">❖ Compte d'épargne et Financement</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 25%;" />
        <col style="width: 10%;" />
        <col style="width: 10%;" />
        <col style="width: 10%;" />
        <col style="width: 10%;" />
        <col style="width: 10%;" />
        <col style="width: 10%;" />
        <col style="width: 15%;" />
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">Epargne</th>
          <th colspan="2">Avez-vous un compte</th>
          <th colspan="2">Avez-vous de l'argent sur le compte</th>
          <th colspan="3">Avez-vous bénéficier de financement</th>
        </tr>
        <tr>
          <th style="font-weight: normal; font-size: 10px;">Oui</th>
          <th style="font-weight: normal; font-size: 10px;">Non</th>
          <th style="font-weight: normal; font-size: 10px;">Oui</th>
          <th style="font-weight: normal; font-size: 10px;">Non</th>
          <th style="font-weight: normal; font-size: 10px;">Oui</th>
          <th style="font-weight: normal; font-size: 10px;">Non</th>
          <th style="font-weight: normal; font-size: 10px;">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          const userEpargne = data.epargneFinancement || [];
          const EPARGNE_FIXES = [
            { nom: 'Mobile Money' },
            { nom: 'Microfinance' },
            { nom: 'Banque' },
            { nom: 'Autres, précisez' }
          ];

          const baseEpargne = EPARGNE_FIXES.map(f => {
            const isAutres = f.nom.startsWith('Autres,');
            const userItem = userEpargne.find(e => 
              (isAutres && e.nom && e.nom.startsWith('Autres,')) || 
              (e.nom === f.nom)
            );
            return {
              nom: f.nom,
              precision: userItem ? userItem.precision : '',
              compte: userItem ? userItem.compte : '',
              argent: userItem ? userItem.argent : '',
              financement: userItem ? userItem.financement : '',
              montant: userItem ? userItem.montant : ''
            };
          });

          return baseEpargne.map(e => `
          <tr>
            <td class="font-bold">${(e.nom === 'Autres, précisez' || e.nom === 'Autres, précisez ') ? 'Autres, précisez : ' + (e.precision || '________') : (e.nom || '')}</td>
            <td class="text-center font-bold">${e.compte === 'Oui' || e.compte === 'true' || String(e.compte) === 'true' ? '☑' : '☐'}</td>
            <td class="text-center font-bold">${e.compte === 'Non' || e.compte === 'false' || String(e.compte) === 'false' ? '☑' : '☐'}</td>
            <td class="text-center font-bold">${e.argent === 'Oui' || e.argent === 'true' || String(e.argent) === 'true' ? '☑' : '☐'}</td>
            <td class="text-center font-bold">${e.argent === 'Non' || e.argent === 'false' || String(e.argent) === 'false' ? '☑' : '☐'}</td>
            <td class="text-center font-bold">${e.financement === 'Oui' || e.financement === 'true' || String(e.financement) === 'true' ? '☑' : '☐'}</td>
            <td class="text-center font-bold">${e.financement === 'Non' || e.financement === 'false' || String(e.financement) === 'false' ? '☑' : '☐'}</td>
            <td class="text-center">${e.montant || ''}</td>
          </tr>
          `).join('');
        })()}
      </tbody>
    </table>

    <h4 class="section-title">❖ Production de cacao des trois (3) dernières années</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 40%;" />
        <col style="width: 30%;" />
        <col style="width: 30%;" />
      </colgroup>
      <thead>
        <tr>
          <th>ANNEE</th>
          <th>Production (kg)</th>
          <th>Revenu brut (FCFA)</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { label: 'Année N-1 :', data: historique[0] || {} },
          { label: 'Année N-2 :', data: historique[1] || {} },
          { label: 'Année N-3 :', data: historique[2] || {} }
        ].map(item => `
          <tr>
            <td class="font-bold">${item.label}</td>
            <td class="text-center">${item.data.production || ''}</td>
            <td class="text-center">${item.data.revenu || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h4 class="section-title">❖ Sources de revenus autres que le cacao</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 40%;" />
        <col style="width: 30%;" />
        <col style="width: 30%;" />
      </colgroup>
      <thead>
        <tr>
          <th>ANNEE</th>
          <th>Production moyenne annuelle</th>
          <th>Revenu brut moyen/an</th>
        </tr>
      </thead>
      <tbody>
        ${revenusAutres.length > 0 ? revenusAutres.map(r => `
          <tr>
            <td class="font-bold">${r.activite || ''}</td>
            <td class="text-center">${r.prod || ''}</td>
            <td class="text-center">${r.revenu || ''}</td>
          </tr>
        `).join('') : `<tr><td colspan="3" class="text-center italic">Non renseigné</td></tr>`}
      </tbody>
    </table>

    <h4 class="section-title" style="margin-top: 0;">❖ Dépenses courantes du foyer</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 40%;" />
        <col style="width: 30%;" />
        <col style="width: 30%;" />
      </colgroup>
      <thead>
        <tr>
          <th>Dépenses</th>
          <th>Périodicité</th>
          <th>Montant moyen/an</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          const userDepenses = data.depensesFoyer || [];
          const DEPENSES_FIXES = [
            { depense: 'Scolarité', periodicite: 'année' },
            { depense: 'Nourriture', periodicite: 'mois' },
            { depense: 'Santé', periodicite: 'année' },
            { depense: 'Electricité', periodicite: '2 mois' },
            { depense: 'Eau courante', periodicite: 'mois' },
            { depense: 'Charges sociales (Funérailles, mariage, baptême...)', periodicite: 'année' }
          ];
          
          const baseDepenses = DEPENSES_FIXES.map(f => {
            const userItem = userDepenses.find(d => d.depense === f.depense);
            return {
              depense: f.depense,
              periodicite: userItem?.periodicite || f.periodicite,
              montant: userItem ? userItem.montant : '',
              fixed: true
            };
          });
          
          const dynamicDepenses = userDepenses.filter(d => !DEPENSES_FIXES.some(f => f.depense === d.depense));
          const finalDepenses = [...baseDepenses, ...dynamicDepenses];

          return finalDepenses.map(d => `
            <tr>
              <td class="${d.fixed ? 'font-bold' : ''}">${d.depense || ''}</td>
              <td class="text-center">${d.periodicite || ''}</td>
              <td class="text-center">${d.montant || ''}</td>
            </tr>
          `).join('');
        })()}
      </tbody>
    </table>
    
    
    <h4 class="section-title">❖ Coût de la main d'œuvre</h4>
    <table style="table-layout: fixed; margin-bottom: 20px;">
      <colgroup>
        <col style="width: 25%;" />
        <col style="width: 12%;" />
        <col style="width: 12%;" />
        <col style="width: 12%;" />
        <col style="width: 10%;" />
        <col style="width: 14%;" />
        <col style="width: 15%;" />
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">Type de Main d'œuvre</th>
          <th colspan="3">Statut de la main d'œuvre</th>
          <th rowspan="2">Sexe<br/><span style="font-weight: normal; font-size: 9px;">(H/F)</span></th>
          <th rowspan="2">Coût<br/><span style="font-weight: normal; font-size: 9px;">(FCFA/an)</span></th>
          <th rowspan="2">Temps de travail<br/><span style="font-weight: normal; font-size: 9px;">(Jours/an)</span></th>
        </tr>
        <tr>
          <th style="font-weight: normal; font-size: 10px;">Permanente</th>
          <th style="font-weight: normal; font-size: 10px;">Occasionnelle</th>
          <th style="font-weight: normal; font-size: 10px;">Familiale<br/>(non rémunérée)</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          const userMo = data.mainOeuvre || [];
          const MO_FIXES = [
            { nom: 'Travailleur 1' },
            { nom: 'Travailleur 2' },
            { nom: 'Travailleur 3' },
            { nom: 'Groupe de travail' }
          ];
          
          const baseMo = MO_FIXES.map(f => {
            const userItem = userMo.find(m => m.nom === f.nom);
            return {
              nom: f.nom,
              statut: userItem ? userItem.statut : '',
              sexe: userItem ? userItem.sexe : '',
              cout: userItem ? userItem.cout : '',
              temps: userItem ? userItem.temps : '',
              fixed: true
            };
          });
          
          const dynamicMo = userMo.filter(m => !MO_FIXES.some(f => f.nom === m.nom));
          const finalMo = [...baseMo, ...dynamicMo];
          
          return finalMo.map(m => `
            <tr>
              <td class="${m.fixed ? 'font-bold' : ''}">${m.nom || ''}</td>
              <td class="text-center font-bold">${m.statut === 'permanente' ? '☑' : '☐'}</td>
              <td class="text-center font-bold">${m.statut === 'occasionnel' ? '☑' : '☐'}</td>
              <td class="text-center font-bold">${m.statut === 'familiale' ? '☑' : '☐'}</td>
              <td class="text-center">${m.sexe || ''}</td>
              <td class="text-center">${m.cout || ''}</td>
              <td class="text-center">${m.temps || ''}</td>
            </tr>
          `).join('');
        })()}
      </tbody>
    </table>

    <div class="landscape">

    <!-- FICHE 5 -->
    <div style="height: 185mm; display: flex; flex-direction: column; overflow: hidden; page-break-inside: avoid; box-sizing: border-box;">
      <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 4px;"><span style="color: #22c55e;">◆</span> Annexe 2 : Outils d'analyse des données</h3>
      <h3 class="fiche-title" style="margin-top: 0;"><span style="color: #22c55e;">◆</span> FICHE 5 : ANALYSE DES PROBLEMES</h3>
    
      <table style="table-layout: fixed; margin-bottom: 0; flex: 1; height: 100%; border-collapse: collapse; font-size: 9px; width: 100%;">
        <colgroup>
          <col style="width: 16%;" />
          <col style="width: 21%;" />
          <col style="width: 21%;" />
          <col style="width: 21%;" />
          <col style="width: 21%;" />
        </colgroup>
        <thead>
          <tr>
            <th style="background-color: #000; color: #fff; font-weight: bold; text-align: center; padding: 4px; font-size: 10px; border: 1px solid #000;">THÈMES D'ANALYSE</th>
            <th style="background-color: #000; color: #fff; font-weight: bold; text-align: center; padding: 4px; font-size: 10px; border: 1px solid #000;">PROBLÈMES OU CONTRAINTES</th>
            <th style="background-color: #000; color: #fff; font-weight: bold; text-align: center; padding: 4px; font-size: 10px; border: 1px solid #000;">CAUSES</th>
            <th style="background-color: #000; color: #fff; font-weight: bold; text-align: center; padding: 4px; font-size: 10px; border: 1px solid #000;">CONSÉQUENCES</th>
            <th style="background-color: #000; color: #fff; font-weight: bold; text-align: center; padding: 4px; font-size: 10px; border: 1px solid #000;">SOLUTIONS</th>
          </tr>
        </thead>
        <tbody>
          ${(() => {
            const THEMES_FICHE5 = [
              { theme: 'Peuplement du verger', hint: 'densité, matériel végétal, nombre de tiges/pieds, plages vides .' },
              { theme: 'Entretien du verger' },
              { theme: 'Etat sanitaire du verger' },
              { theme: 'Arbres d\'ombrage' },
              { theme: 'Etat du sol' },
              { theme: 'Cours/sources d\'eau' },
              { theme: 'Terre/Jachères disponibles' },
              { theme: 'Matériel et équipement' },
              { theme: 'Gestion de l\'exploitation' },
              { theme: 'Autres cultures/activités' }
            ];
            const userProblemes = data.analyseProblemes || [];
            
            return THEMES_FICHE5.map(f => {
              const userItem = userProblemes.find((p: any) => p.theme === f.theme) || ({} as any);
              return `
                <tr>
                  <td style="padding: 2px 4px; vertical-align: top; white-space: normal; border: 1px solid #000; box-sizing: border-box;">
                    <span class="font-bold">${f.theme}</span>
                    ${f.hint ? `<br/><span style="font-style: italic; font-size: 8px; color: #333;">(${f.hint})</span>` : ''}
                  </td>
                  <td style="padding: 2px 4px; vertical-align: top; white-space: normal; line-height: 1.1; border: 1px solid #000; box-sizing: border-box;">${userItem.problemes || ''}</td>
                  <td style="padding: 2px 4px; vertical-align: top; white-space: normal; line-height: 1.1; border: 1px solid #000; box-sizing: border-box;">${userItem.causes || ''}</td>
                  <td style="padding: 2px 4px; vertical-align: top; white-space: normal; line-height: 1.1; border: 1px solid #000; box-sizing: border-box;">${userItem.consequences || ''}</td>
                  <td style="padding: 2px 4px; vertical-align: top; white-space: normal; line-height: 1.1; border: 1px solid #000; box-sizing: border-box;">${userItem.solutions || ''}</td>
                </tr>
              `;
            }).join('');
          })()}
        </tbody>
      </table>
    </div>

    <!-- FICHE 6 -->
    <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;"><span style="color: #22c55e;">◆</span> Annexe 3 : Outils de planification</h3>
    <h3 class="fiche-title"><span style="color: #22c55e;">◆</span> FICHE 6 : MATRICE DE PLANIFICATION STRATEGIQUE</h3>
  
    <table>
      <thead>
        <tr>
          <th class="th-gray" rowspan="2">Axes stratégiques</th>
          <th class="th-gray" rowspan="2">Objectifs</th>
          <th class="th-gray" rowspan="2">Activités</th>
          <th class="th-gray" rowspan="2">Coût</th>
          <th class="th-gray" colspan="5">Période</th>
          <th class="th-gray" rowspan="2">Responsable</th>
          <th class="th-gray" rowspan="2">Partenaires</th>
        </tr>
        <tr>
          <th class="th-gray">A1</th><th class="th-gray">A2</th><th class="th-gray">A3</th><th class="th-gray">A4</th><th class="th-gray">A5</th>
        </tr>
      </thead>
      <tbody>
        ${planification.length > 0 ? planification.map(axe => `
          ${(axe.activites || []).length > 0 ? (axe.activites || []).map((act: any, idx: number) => `
            <tr>
              ${idx === 0 ? `<td rowspan="${(axe.activites || []).length}" class="bg-gray font-bold text-center">${axe.nom || ''}</td>` : ''}
              <td>${act.objectif || act.obj || ''}</td>
              <td>${act.activite || act.act || ''}</td>
              <td class="text-center">${act.cout || ''}</td>
              <td class="text-center font-bold" style="color:${act.periodes?.A1 || act.a1 || 'transparent'}">${(act.periodes?.A1 || act.a1) ? '●' : ''}</td>
              <td class="text-center font-bold" style="color:${act.periodes?.A2 || act.a2 || 'transparent'}">${(act.periodes?.A2 || act.a2) ? '●' : ''}</td>
              <td class="text-center font-bold" style="color:${act.periodes?.A3 || act.a3 || 'transparent'}">${(act.periodes?.A3 || act.a3) ? '●' : ''}</td>
              <td class="text-center font-bold" style="color:${act.periodes?.A4 || act.a4 || 'transparent'}">${(act.periodes?.A4 || act.a4) ? '●' : ''}</td>
              <td class="text-center font-bold" style="color:${act.periodes?.A5 || act.a5 || 'transparent'}">${(act.periodes?.A5 || act.a5) ? '●' : ''}</td>
              <td class="text-center">${act.responsable || act.resp || ''}</td>
              <td class="text-center">${act.partenaires || act.part || ''}</td>
            </tr>
          `).join('') : `
            <tr>
              <td class="bg-gray font-bold text-center">${axe.nom || ''}</td>
              <td colspan="10" class="text-center italic">Aucune activité</td>
            </tr>
          `}
        `).join('') : `<tr><td colspan="11" class="text-center italic">Non renseigné</td></tr>`}
      </tbody>
    </table>

    <div class="page-break"></div>

    <!-- FICHE 7 -->
    <h3 class="fiche-title"><span style="color: #22c55e;">◆</span> FICHE 7 : MATRICE DU PROGRAMME ANNUEL D'ACTION</h3>
    <table>
      <thead>
        <tr>
          <th class="th-gray" rowspan="2">Axes stratégiques</th>
          <th class="th-gray" rowspan="2">Activités / Actions</th>
          <th class="th-gray" rowspan="2">Indicateurs</th>
          <th class="th-gray" colspan="4">Chronogramme</th>
          <th class="th-gray" rowspan="2">Responsable</th>
          <th class="th-gray" rowspan="2">Coût</th>
        </tr>
        <tr>
          <th class="th-gray">T1</th><th class="th-gray">T2</th><th class="th-gray">T3</th><th class="th-gray">T4</th>
        </tr>
      </thead>
      <tbody>
        ${programmeAnnuel.length > 0 ? programmeAnnuel.map(axe => `
          ${(axe.activites || []).length > 0 ? (axe.activites || []).map((act: any, idx: number) => `
            <tr>
              ${idx === 0 ? `<td rowspan="${(axe.activites || []).length}" class="bg-gray font-bold text-center">${axe.nom || ''}</td>` : ''}
              <td>${act.activite || act.act || ''}</td>
              <td>${act.indicateur || act.ind || ''}</td>
              <td class="text-center font-bold" style="color:${act.chronogramme?.T1 || act.T1 || act.t1 || 'transparent'}">${(act.chronogramme?.T1 || act.T1 || act.t1) ? '●' : ''}</td>
              <td class="text-center font-bold" style="color:${act.chronogramme?.T2 || act.T2 || act.t2 || 'transparent'}">${(act.chronogramme?.T2 || act.T2 || act.t2) ? '●' : ''}</td>
              <td class="text-center font-bold" style="color:${act.chronogramme?.T3 || act.T3 || act.t3 || 'transparent'}">${(act.chronogramme?.T3 || act.T3 || act.t3) ? '●' : ''}</td>
              <td class="text-center font-bold" style="color:${act.chronogramme?.T4 || act.T4 || act.t4 || 'transparent'}">${(act.chronogramme?.T4 || act.T4 || act.t4) ? '●' : ''}</td>
              <td class="text-center">${act.responsable || act.resp || ''}</td>
              <td class="text-center">${act.cout || ''}</td>
            </tr>
          `).join('') : `
            <tr>
              <td class="bg-gray font-bold text-center">${axe.nom || ''}</td>
              <td colspan="8" class="text-center italic">Aucune activité</td>
            </tr>
          `}
        `).join('') : `<tr><td colspan="9" class="text-center italic">Non renseigné</td></tr>`}
      </tbody>
    </table>

    <div class="page-break"></div>

    <!-- FICHE 8 -->
    <h3 class="fiche-title"><span style="color: #22c55e;">◆</span> FICHE 8 : TABLEAU DE DETERMINATION DES MOYENS ET DES COUTS</h3>
    <table>
      <thead>
        <tr>
          <th class="th-gray" rowspan="2">Moyens spécifiques</th>
          <th class="th-gray" rowspan="2">Unités</th>
          <th class="th-gray" colspan="2">Année 1</th>
          <th class="th-gray" colspan="2">Année 2</th>
          <th class="th-gray" colspan="2">Année 3</th>
          <th class="th-gray" colspan="2">Année 4</th>
          <th class="th-gray" colspan="2">Année 5</th>
        </tr>
        <tr>
          <th class="th-gray">Qté</th><th class="th-gray">Coût</th>
          <th class="th-gray">Qté</th><th class="th-gray">Coût</th>
          <th class="th-gray">Qté</th><th class="th-gray">Coût</th>
          <th class="th-gray">Qté</th><th class="th-gray">Coût</th>
          <th class="th-gray">Qté</th><th class="th-gray">Coût</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          const FICHE8_DEFAULT = [
            {
              id: '1', nom: 'Investissement', items: [
                { moyen: 'Atomiseur', unite: 'Nombre', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
                { moyen: 'Sécateur professionnel', unite: 'Nombre', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: false }
              ]
            },
            {
              id: '2', nom: 'Intrants', items: [
                { moyen: 'Engrais NPK 12-12-17', unite: 'kg', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
                { moyen: 'Insecticide (Confidor)', unite: 'Litre', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
                { moyen: 'Fongicide (Ridomil)', unite: 'Litre', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: false },
                { moyen: 'Plants cacao CNRA', unite: 'Plants', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: false }
              ]
            },
            {
              id: '3', nom: 'Main d\'œuvre', items: [
                { moyen: 'M.O permanente', unite: 'Jours/an', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
                { moyen: 'M.O. Occasionnelle (récolte)', unite: 'Jours', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true }
              ]
            },
            {
              id: '4', nom: 'Activités spécifiques', items: [
                { moyen: 'Transport récolte (mototaxi)', unite: 'Saisons', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true }
              ]
            }
          ];

          let moyensCoutsToPrint = data.moyensCouts && data.moyensCouts.length > 0 ? data.moyensCouts : FICHE8_DEFAULT;

          moyensCoutsToPrint = moyensCoutsToPrint.map((userGrp: any) => {
            const defGrp = FICHE8_DEFAULT.find(dg => dg.id === userGrp.id || dg.nom === userGrp.nom);
            if (!defGrp) return userGrp; 

            const newItems = [...(userGrp.items || [])];
            
            (defGrp.items || []).forEach(defItem => {
              if (defItem.fixed && !newItems.some((ui: any) => ui.moyen === defItem.moyen)) {
                newItems.unshift(defItem); 
              }
            });

            return { ...userGrp, items: newItems };
          });

          return moyensCoutsToPrint.map((groupe: any) => `
            <tr><td colspan="12" class="bg-gray-light font-bold text-center" style="font-size:11px;">${groupe.nom || ''}</td></tr>
            ${(groupe.items || []).length > 0 ? (groupe.items || []).map((item: any) => `
              <tr>
                <td>${item.fixed ? '• ' : ''}${item.moyen || ''}</td>
                <td class="text-center">${item.unite || ''}</td>
                <td class="text-center">${item.a1q || ''}</td><td class="text-center">${item.a1c || ''}</td>
                <td class="text-center">${item.a2q || ''}</td><td class="text-center">${item.a2c || ''}</td>
                <td class="text-center">${item.a3q || ''}</td><td class="text-center">${item.a3c || ''}</td>
                <td class="text-center">${item.a4q || ''}</td><td class="text-center">${item.a4c || ''}</td>
                <td class="text-center">${item.a5q || ''}</td><td class="text-center">${item.a5c || ''}</td>
              </tr>
            `).join('') : `<tr><td colspan="12" class="text-center italic">Aucune ligne</td></tr>`}
          `).join('');
        })()}\n      </tbody>
    </table>

  </div>
  </div>
</body>
</html>
  `;
}
