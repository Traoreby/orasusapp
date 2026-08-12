import { Producteur } from '../core/types/producteur';
import { formatNumber, formatCurrency } from './formatters';
import { getAggregateStats, getTopProgressions, getImpactMetrics } from './producteurCalculations';

export function generateRapportHtml(producteurs: Producteur[], region: string, entite: string): string {
  const aggregate = getAggregateStats(producteurs);
  const topProgressions = getTopProgressions(producteurs);
  const impactMetrics = getImpactMetrics(producteurs);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport Synthétique d'Exploitation</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.6; }
    h1, h2, h3 { color: #1e3a8a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
    .filters { text-align: center; font-style: italic; color: #666; margin-bottom: 20px; }
    .kpi-grid { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; }
    .kpi-card { flex: 1; min-width: 30%; background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
    .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .kpi-value { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 5px; }
    
    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 15px; display: flex; align-items: center; }
    
    .progression-grid { display: flex; gap: 15px; flex-wrap: wrap; }
    .prog-card { flex: 1; min-width: 30%; border-left: 4px solid #22c55e; padding: 15px; background: #f0fdf4; border-radius: 4px; }
    .prog-name { font-weight: bold; font-size: 14px; }
    .prog-village { font-size: 12px; color: #666; margin-bottom: 5px; }
    .prog-stats { font-size: 13px; color: #166534; font-weight: bold; }

    .impact-grid { display: flex; gap: 15px; flex-wrap: wrap; }
    .impact-card { flex: 1; min-width: 45%; border: 1px solid #eab308; background: #fefce8; padding: 15px; border-radius: 8px; }
    .impact-title { font-weight: bold; font-size: 14px; color: #854d0e; margin-bottom: 10px; }
    
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
    th { background-color: #f1f5f9; color: #334155; font-weight: bold; }
    .text-right { text-align: right; }
  </style>
</head>
<body>

  <div class="header">
    <h1>Rapport Synthétique d'Exploitation</h1>
    <div class="filters">Filtres : ${region || 'Toutes régions'} | ${entite || 'Toutes entités'}</div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card"><div class="kpi-label">Nombre de producteurs</div><div class="kpi-value">${aggregate.totalProducteurs}</div></div>
    <div class="kpi-card"><div class="kpi-label">Superficie Cacao (ha)</div><div class="kpi-value" style="color:#2563eb">${aggregate.supCacao.toFixed(2)}</div></div>
    <div class="kpi-card"><div class="kpi-label">Production Estimée (kg)</div><div class="kpi-value" style="color:#2563eb">${formatNumber(aggregate.prodEstimee)}</div></div>
    <div class="kpi-card"><div class="kpi-label">Revenus Cumulés</div><div class="kpi-value" style="color:#7c3aed">${formatCurrency(aggregate.revenus)}</div></div>
    <div class="kpi-card"><div class="kpi-label">Coûts Opérationnels</div><div class="kpi-value" style="color:#d97706">${formatCurrency(aggregate.couts)}</div></div>
    <div class="kpi-card"><div class="kpi-label">Marge Brute Estimée</div><div class="kpi-value" style="color:#2563eb">${formatCurrency(aggregate.revenus - aggregate.couts)}</div></div>
  </div>

  <div class="section">
    <h2 class="section-title">🌟 Producteurs à l'honneur</h2>
    ${topProgressions.length > 0 ? `
    <div class="progression-grid">
      ${topProgressions.map(prog => `
      <div class="prog-card">
        <div class="prog-name">${prog.producteur.nom}</div>
        <div class="prog-village">📍 ${prog.producteur.village || 'Village inconnu'}</div>
        <div class="prog-stats">📈 Passé de ${formatCurrency(prog.rOld)} à ${formatCurrency(prog.rN1)} (+${prog.pct}%)</div>
      </div>
      `).join('')}
    </div>
    ` : '<p>Pas assez de données historiques pour calculer les progressions.</p>'}
  </div>

  <div class="section">
    <h2 class="section-title" style="color:#d97706; border-bottom-color:#fcd34d;">📊 Impact concret des investissements</h2>
    <div class="impact-grid">
      <div class="impact-card">
        <div class="impact-title">🚜 Moyens & Intrants distribués</div>
        <ul>
          ${Object.entries(impactMetrics.investissements).map(([k, v]) => `<li><b>${k}</b> : ${formatNumber(v as number)}</li>`).join('')}
        </ul>
      </div>
      <div class="impact-card">
        <div class="impact-title">📖 Accompagnement et Formation</div>
        <ul>
          <li><b>${impactMetrics.formationsCount}</b> formations dispensées</li>
          <li><b>${impactMetrics.replantationActions}</b> actions de réhabilitation</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="section" style="page-break-before: always;">
    <h2 class="section-title">Annexe — Détail par producteur (${Math.min(producteurs.length, 100)} premiers)</h2>
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Région</th>
          <th>Sup. Cacao</th>
          <th>Production</th>
          <th class="text-right">Revenus</th>
        </tr>
      </thead>
      <tbody>
        ${producteurs.slice(0, 100).map(p => {
          const supCacao = (p.cultures || []).filter(c => (c.nom||'').toLowerCase().includes('cacao')).reduce((s, c) => s + (parseFloat(String(c.superficie)) || 0), 0);
          const prod = (p.cultures || []).reduce((s, c) => s + (parseFloat(String(c.production)) || 0), 0);
          const rev = (p.cultures || []).reduce((s, c) => s + (parseFloat(String(c.revenu)) || 0), 0);
          return `
          <tr>
            <td><strong>${p.nom}</strong></td>
            <td>${p.delegation || '-'}</td>
            <td>${supCacao} ha</td>
            <td>${formatNumber(prod)} kg</td>
            <td class="text-right">${formatCurrency(rev)}</td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

</body>
</html>
  `;
}
