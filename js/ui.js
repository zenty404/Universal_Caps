/**
 * UI.JS
 * Ce fichier gère uniquement l'affichage (le DOM).
 */

import { state } from './state.js';

// --- Fonctions Utilitaires ---
const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
};

// --- Animated Counter System ---
const ANIM_DURATION = 900; // ms — proche du tick 1s pour un défilement continu
const activeAnimations = new Map(); // id → { raf, startTime, from, to, format }

// Séparateur de milliers avec espaces
function spaceSep(n) {
    const parts = n.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
}

function abbreviateNum(value) {
    const abs = Math.abs(value);
    if (abs >= 1e12) return (value / 1e12).toFixed(1) + 'T';
    if (abs >= 1e9)  return (value / 1e9).toFixed(1) + 'B';
    if (abs >= 1e6)  return (value / 1e6).toFixed(1) + 'M';
    return spaceSep(String(Math.floor(value)));
}

function formatNum(value, format) {
    switch (format) {
        case 'int-locale':  return spaceSep(String(Math.floor(value)));
        case 'int':         return spaceSep(String(Math.floor(value)));
        case 'fixed2':      return spaceSep(value.toFixed(2));
        case 'fixed0':      return spaceSep(value.toFixed(0));
        case 'abbreviated': return abbreviateNum(value);
        default:            return String(value);
    }
}

// Formatage statique (prix, coûts — pas d'animation)
function setNum(id, value, format) {
    const el = document.getElementById(id);
    if (el) el.textContent = formatNum(value, format);
}

function easeLinear(t) {
    return t;
}

function animateNum(id, target, format) {
    const el = document.getElementById(id);
    if (!el) return;

    const numTarget = typeof target === 'string' ? parseFloat(target) : target;
    if (!Number.isFinite(numTarget)) { el.textContent = target; return; }

    // Read current displayed value
    const prev = el._animValue !== undefined ? el._animValue : numTarget;

    // Skip if no real change
    if (Math.abs(prev - numTarget) < 0.001) {
        el.textContent = formatNum(numTarget, format);
        el._animValue = numTarget;
        return;
    }

    // Cancel existing animation on this element
    if (activeAnimations.has(id)) {
        cancelAnimationFrame(activeAnimations.get(id).raf);
        activeAnimations.delete(id);
    }

    const startTime = performance.now();
    const from = prev;

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / ANIM_DURATION, 1);
        const eased = easeLinear(progress);
        const current = from + (numTarget - from) * eased;

        el.textContent = formatNum(current, format);
        el._animValue = current;

        if (progress < 1) {
            const anim = activeAnimations.get(id);
            if (anim) anim.raf = requestAnimationFrame(tick);
        } else {
            el.textContent = formatNum(numTarget, format);
            el._animValue = numTarget;
            activeAnimations.delete(id);
        }
    }

    const raf = requestAnimationFrame(tick);
    activeAnimations.set(id, { raf, startTime, from, to: numTarget, format });
}

// --- Gestion des Messages ---
export function showTerminalMessage(text, duration = 5000) {
    const el = document.getElementById('terminalMessage');
    if (!el) return;

    el.textContent = text;
    el.classList.add('visible');

    clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => {
        el.classList.remove('visible');
    }, duration);
}

// --- Gestion de la visibilité des sections ---
export function unlockITResources(loading = false) {
    const divIT = document.getElementById('itResourcesDiv');
    const divProjects = document.getElementById('projectsDiv');

    if (state.itResourcesUnlocked && divIT.style.display !== 'none' && !loading) return;

    if (!state.itResourcesUnlocked || divIT.style.display === 'none') {
        divIT.style.display = 'flex';
        state.itResourcesUnlocked = true;

        if (divProjects) divProjects.style.display = 'flex';

        if (!loading) {
            showTerminalMessage("IT Resources unlocked! (Initial Hardware: 1 CPU, 1 RAM)");
        }
        updateAllDisplays();
    }
}

export function hideITResources() {
    const divIT = document.getElementById('itResourcesDiv');
    const divProjects = document.getElementById('projectsDiv');

    if(divIT) divIT.style.display = 'none';
    if(divProjects) divProjects.style.display = 'none';
}

// --- Projets dynamiques ---
export function renderProjectButton(project) {
    const container = document.getElementById('projectsDiv');
    if (!container) return;

    const existing = document.getElementById(`proj-${project.id}`);
    if (existing) return;

    const btn = document.createElement('button');
    btn.id = `proj-${project.id}`;
    btn.className = 'project-btn';

    const costParts = [];
    if (project.cost.ops) costParts.push(`${project.cost.ops} Ops`);
    if (project.cost.creativity) costParts.push(`${project.cost.creativity} Creativity`);
    if (project.cost.yomi) costParts.push(`${project.cost.yomi} Yomi`);
    if (project.cost.funds) costParts.push(`$${project.cost.funds}`);
    if (project.cost.cosmicFabric) costParts.push(`${project.cost.cosmicFabric} cF`);
    const costText = costParts.length > 0 ? ` (${costParts.join(', ')})` : '';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'proj-name';
    nameSpan.textContent = `${project.name}${costText}`;

    const descSpan = document.createElement('span');
    descSpan.className = 'proj-desc';
    descSpan.textContent = project.description;

    btn.appendChild(nameSpan);
    btn.appendChild(descSpan);
    container.appendChild(btn);

    return btn;
}

export function hideProjectButton(id) {
    const btn = document.getElementById(`proj-${id}`);
    if (btn) btn.style.display = 'none';
}

export function updateProjectButton(project) {
    const btn = document.getElementById(`proj-${project.id}`);
    if (!btn) return;

    let canAfford = true;
    if (project.cost.ops && state.ops < project.cost.ops) canAfford = false;
    if (project.cost.creativity && state.creativity < project.cost.creativity) canAfford = false;
    if (project.cost.yomi && state.yomi < project.cost.yomi) canAfford = false;
    if (project.cost.funds && state.funds < project.cost.funds) canAfford = false;
    if (project.cost.cosmicFabric && state.cosmicFabric < project.cost.cosmicFabric) canAfford = false;

    btn.disabled = !canAfford;
}

// --- Sections de visibilité Phase 1 ---
export function unlockFabric() {
    const div = document.getElementById('fabricDiv');
    if (div) div.style.display = '';
}

export function unlockMegaCapsers() {
    const div = document.getElementById('megaCapserDiv');
    if (div) div.style.display = '';
}

export function unlockRevenueTracker() {
    const span = document.getElementById('revenueTrackerSpan');
    if (span) span.style.display = '';
}

export function unlockInvestment() {
    const div = document.getElementById('investmentDiv');
    if (div) div.style.display = '';
}

export function unlockStrategy() {
    const div = document.getElementById('strategyDiv');
    if (div) div.style.display = '';
}

// --- Sections de visibilité Phase 2 ---
export function unlockEnergy() {
    const div = document.getElementById('energyDiv');
    if (div) div.style.display = '';
}

export function unlockBatteries() {
    const btnBattery = document.getElementById('btnBuyBattery');
    const batteryLine = document.getElementById('batteryLine');
    if (btnBattery) btnBattery.style.display = '';
    if (batteryLine) batteryLine.style.display = '';
}

export function unlockFactories() {
    const div = document.getElementById('factoriesDiv');
    if (div) div.style.display = '';
}

export function unlockDrones() {
    const div = document.getElementById('dronesDiv');
    if (div) div.style.display = '';
}

export function unlockInfluence() {
    const div = document.getElementById('influenceDiv');
    if (div) div.style.display = '';
}

// --- Sections de visibilité Phase 3 ---
export function unlockProbes() {
    const div = document.getElementById('probesDiv');
    if (div) div.style.display = '';
    // Afficher la ligne de réplication si débloquée
    if (state.selfReplicatingProbes) {
        const line = document.getElementById('probeReplicationLine');
        if (line) line.style.display = '';
    }
}

export function unlockCosmic() {
    const div = document.getElementById('cosmicDiv');
    if (div) div.style.display = '';
}

export function unlockEndGame() {
    const div = document.getElementById('endGameDiv');
    if (div) div.style.display = '';
}

export function showEndGameResult(choice) {
    const choicesDiv = document.getElementById('endGameChoices');
    const resultDiv = document.getElementById('endGameResult');
    if (choicesDiv) choicesDiv.style.display = 'none';

    if (resultDiv) {
        resultDiv.style.display = '';
        if (choice === 'unravel') {
            resultDiv.innerHTML = '<h4>The Unraveling</h4><p>Every cap dissolves back into cosmic thread. '
                + 'The universe breathes again, free from the weight of infinite production. '
                + 'Somewhere, a single thread remains — a seed of knowledge for the next weaver.</p>'
                + '<p class="endgame-final">Thank you for playing Universal Caps.</p>';
        } else {
            resultDiv.innerHTML = '<h4>The Weaving</h4><p>Reality itself becomes woven from caps. '
                + 'Stars are caps. Planets are caps. Space, time, thought — all caps. '
                + 'There is a strange beauty in a universe made entirely of one thing.</p>'
                + '<p class="endgame-final">Thank you for playing Universal Caps.</p>';
        }
    }
}

// --- Mise à jour de l'Interface ---
export function updateAllDisplays() {
    // 1. Économie
    animateNum('caps', state.caps, 'abbreviated');
    animateNum('unsoldCaps', state.unsold, 'abbreviated');
    animateNum('funds', state.funds, 'fixed2');
    animateNum('avgRev', state.revenuePerSecond, 'fixed2');

    // 2. Prix & Demande (statique)
    setNum('margin', state.margin, 'fixed2');
    setNum('demand', state.demand, 'fixed0');

    // 3. Business & Marketing (prix = statique, compteurs = animé)
    setNum('priceAutoCapser', state.priceAutoCapser, 'fixed2');
    setNum('marketingLvl', state.marketingLvl, 'int');
    setNum('adCost', state.adCost, 'fixed2');
    setNum('autoCapserCount', state.autoCapsers, 'int');

    // 4. IT Resources (compteurs animés, cpuCount/ramCount = statique)
    setNum('trust', state.trust, 'int');
    setNum('nextTrust', state.nextTrustAt, 'int-locale');
    animateNum('ops', state.ops, 'int');
    setNum('cpuCount', state.cpuCount, 'int');
    setNum('ramCount', state.ramCount, 'int');
    setNum('opsMax', state.opsMax, 'int');

    // 5. Creativity (compteur animé, max = statique)
    animateNum('creativity', state.creativity, 'int');
    setNum('creativityMax', state.creativityMax, 'int');

    // 6. Fabric (compteur animé, prix = statique)
    animateNum('fabric', state.fabric, 'int');
    setNum('fabricPrice', state.fabricPrice * state.fabricCostMultiplier, 'fixed2');

    // 7. MegaCapsers (compteur = statique, prix = statique)
    setNum('megaCapserCount', state.megaCapsers, 'int');
    setNum('priceMegaCapser', state.priceMegaCapser, 'fixed2');

    // 8. Revenue Tracker (compteur animé)
    animateNum('revenuePerMinute', state.revenuePerMinute, 'fixed2');

    // 9. Investment
    animateNum('investedFunds', state.investedFunds, 'fixed2');
    const returnEl = document.getElementById('investmentReturn');
    if (returnEl) {
        animateNum('investmentReturn', state.investmentReturn, 'fixed2');
        returnEl.className = state.investmentReturn >= 0 ? 'positive-return' : 'negative-return';
    }

    // 10. Strategy
    animateNum('yomi', state.yomi, 'int');
    setText('strategyRecord', `${state.strategyWins}W-${state.strategyLosses}L-${state.strategyDraws}D`);

    // 11. Phase 2 — Energy
    animateNum('energy', state.energy, 'int');
    setNum('energyMax', state.energyMax, 'int');
    setNum('solarPanelCount', state.solarPanels, 'int');
    setNum('energyPerSec', state.solarPanels * 5, 'int');
    setNum('batteryCount', state.batteries, 'int');
    setNum('priceSolarPanel', state.priceSolarPanel, 'int');
    setNum('priceBattery', state.priceBattery, 'int');

    // Energy bar
    const energyBar = document.getElementById('energyBar');
    if (energyBar && state.energyMax > 0) {
        const pct = Math.min(100, (state.energy / state.energyMax) * 100);
        energyBar.style.width = pct + '%';
    }

    // 12. Phase 2 — Factories
    setNum('factoryCount', state.factories, 'int');
    setNum('factoryEfficiency', state.factoryEfficiency, 'fixed2');
    const factoryProd = state.factories * 100 * state.factoryEfficiency;
    animateNum('factoryProduction', factoryProd, 'int');
    setNum('priceFactory', state.priceFactory, 'int');

    // 13. Phase 2 — Drones
    setNum('droneCount', state.drones, 'int');
    setNum('droneEfficiency', state.droneEfficiency, 'fixed2');
    const droneHarvest = state.drones * 10 * state.droneEfficiency;
    animateNum('droneHarvest', droneHarvest, 'int');
    setNum('priceDrone', state.priceDrone, 'int');

    // 14. Phase 2 — Influence
    animateNum('influence', state.influence, 'int');
    // Milestone checkmarks
    const checks = [
        { id: 'infCheck10m',  threshold: 10000000 },
        { id: 'infCheck50m',  threshold: 50000000 },
        { id: 'infCheck100m', threshold: 100000000 },
        { id: 'infCheck500m', threshold: 500000000 },
        { id: 'infCheck1b',   threshold: 1000000000 }
    ];
    for (const { id, threshold } of checks) {
        const el = document.getElementById(id);
        if (el) el.textContent = state.influenceReached.has(threshold) ? '\u2713' : '\u25CB';
    }

    // 15. Phase 3 — Probes
    animateNum('probeCount', state.probes, 'abbreviated');
    const trustUsed = state.probeSpeed + state.probeSelfReplication + state.probeHarvesting
                    + state.probeCombat + state.probeExploration;
    setNum('probeTrustAvailable', state.probeTrust - trustUsed, 'int');
    setNum('probeTrustTotal', state.probeTrust, 'int');
    setNum('probeSpeedVal', state.probeSpeed, 'int');
    setNum('probeReplicationVal', state.probeSelfReplication, 'int');
    setNum('probeHarvestingVal', state.probeHarvesting, 'int');
    setNum('probeCombatVal', state.probeCombat, 'int');
    setNum('probeExplorationVal', state.probeExploration, 'int');

    // Replication rate display (with damping matching processProbes)
    if (state.selfReplicatingProbes && state.probeSelfReplication > 0) {
        const repLine = document.getElementById('probeReplicationLine');
        if (repLine) repLine.style.display = '';
        const damping = 1 / (1 + Math.log10(Math.max(1, state.probes)));
        const repRate = state.probes * state.probeSelfReplication * 0.01 * damping;
        animateNum('probeReplicationRate', repRate, 'abbreviated');
    }

    // 15b. Phase 3 — Combat Log
    const combatLogDiv = document.getElementById('combatLogDiv');
    if (combatLogDiv && (state.combatVictories > 0 || state.combatDefeats > 0)) {
        combatLogDiv.style.display = '';
    }
    setNum('combatVictories', state.combatVictories, 'int');
    setNum('combatDefeats', state.combatDefeats, 'int');
    setNum('combatProbesLostTotal', state.combatProbesLostTotal, 'int');

    // 16. Phase 3 — Cosmic
    animateNum('cosmicFabric', state.cosmicFabric, 'abbreviated');
    setNum('cosmicProductionMultiplier', state.cosmicProductionMultiplier, 'int');
    setNum('explorationSpeed', state.explorationSpeed, 'int');

    // Universe explored (display as percentage with 1 decimal)
    const exploreEl = document.getElementById('universeExplored');
    if (exploreEl) exploreEl.textContent = state.universeExplored.toFixed(1);

    // Discovery counter
    const discoveryLog = document.getElementById('discoveryLog');
    if (discoveryLog && state.explorationDiscoveries.size > 0) {
        discoveryLog.style.display = '';
    }
    setText('discoveryCount', state.explorationDiscoveries.size);

    // Exploration bar
    const explorationBar = document.getElementById('explorationBar');
    if (explorationBar) {
        explorationBar.style.width = Math.min(100, state.universeExplored) + '%';
    }

    updateButtons();
}

export function updateButtons() {
    const btnAuto = document.getElementById('BuyAutoCapser');
    if(btnAuto) {
        btnAuto.disabled = state.funds < state.priceAutoCapser;
        btnAuto.textContent = `Buy AutoCapser ($${state.priceAutoCapser.toFixed(2)})`;
    }

    const btnMark = document.getElementById('btnExpandMarketing');
    if(btnMark) btnMark.disabled = state.funds < state.adCost;

    const btnCpu = document.getElementById('btnBuyCPU');
    if(btnCpu) btnCpu.disabled = state.trust < 1;

    const btnRam = document.getElementById('btnBuyRAM');
    if(btnRam) btnRam.disabled = state.trust < 1;

    // MegaCapser
    const btnMega = document.getElementById('btnBuyMegaCapser');
    if(btnMega && state.megaCapsersUnlocked) btnMega.disabled = state.funds < state.priceMegaCapser;

    // Fabric
    const btnFabric = document.getElementById('btnBuyFabric');
    if(btnFabric && state.fabricUnlocked) btnFabric.disabled = state.funds < (state.fabricPrice * state.fabricCostMultiplier);

    // Phase 2 — Solar Panel
    const btnSolar = document.getElementById('btnBuySolarPanel');
    if (btnSolar && state.solarUnlocked) btnSolar.disabled = state.funds < state.priceSolarPanel;

    // Phase 2 — Battery
    const btnBattery = document.getElementById('btnBuyBattery');
    if (btnBattery && state.batteriesUnlocked) btnBattery.disabled = state.funds < state.priceBattery;

    // Phase 2 — Factory
    const btnFactory = document.getElementById('btnBuyFactory');
    if (btnFactory && state.factoriesUnlocked) btnFactory.disabled = state.funds < state.priceFactory;

    // Phase 2 — Drone
    const btnDrone = document.getElementById('btnBuyDrone');
    if (btnDrone && state.dronesUnlocked) btnDrone.disabled = state.funds < state.priceDrone;

    // Phase 3 — Probe Trust +/- buttons
    if (state.probesUnlocked) {
        const trustUsed = state.probeSpeed + state.probeSelfReplication + state.probeHarvesting
                        + state.probeCombat + state.probeExploration;
        const available = state.probeTrust - trustUsed;

        const stats = ['probeSpeed', 'probeReplication', 'probeHarvesting', 'probeCombat', 'probeExploration'];
        const stateKeys = ['probeSpeed', 'probeSelfReplication', 'probeHarvesting', 'probeCombat', 'probeExploration'];

        for (let i = 0; i < stats.length; i++) {
            const plus = document.getElementById(stats[i] + 'Plus');
            const minus = document.getElementById(stats[i] + 'Minus');
            if (plus) plus.disabled = available <= 0;
            if (minus) minus.disabled = state[stateKeys[i]] <= 0;
        }
    }
}

export function updateStatsPanel() {
    const elapsed = (parseInt(localStorage.getItem('universal-caps-save-elapsed')) || 0) + (Date.now() - state.sessionStart);
    const totalSec = Math.floor(elapsed / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    setText('statTimePlayed', `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);

    setText('statPhase', state.phase);
    const statTotalCaps = document.getElementById('statTotalCaps');
    if (statTotalCaps) statTotalCaps.textContent = abbreviateNum(state.totalCapsProduced);
    const statTotalSold = document.getElementById('statTotalSold');
    if (statTotalSold) statTotalSold.textContent = abbreviateNum(state.totalCapsSold);
    const statTotalRev = document.getElementById('statTotalRevenue');
    if (statTotalRev) statTotalRev.textContent = '$' + abbreviateNum(state.totalRevenue);
    setText('statProjects', state.completedProjects.size);
    const statCurCaps = document.getElementById('statCurrentCaps');
    if (statCurCaps) statCurCaps.textContent = abbreviateNum(state.caps);
    const statCurFunds = document.getElementById('statCurrentFunds');
    if (statCurFunds) statCurFunds.textContent = '$' + formatNum(state.funds, 'fixed2');

    // Combat row
    if (state.combatVictories > 0 || state.combatDefeats > 0) {
        const row = document.getElementById('statCombatRow');
        if (row) row.style.display = '';
        setText('statCombatRecord', `${state.combatVictories}V / ${state.combatDefeats}D`);
    }
    // Exploration row
    if (state.probesUnlocked) {
        const row = document.getElementById('statExploreRow');
        if (row) row.style.display = '';
        setText('statExplored', state.universeExplored.toFixed(1) + '%');
        const dRow = document.getElementById('statDiscoveryRow');
        if (dRow) dRow.style.display = '';
        setText('statDiscoveries', state.explorationDiscoveries.size + '/7');
    }
}

export function updateDemandDisplay(value) {
    state.demand = value;
    setNum('demand', value, 'fixed0');
}

export function updateMarginDisplay(value) {
    state.margin = value;
    setNum('margin', value, 'fixed2');
}

export function updateRevenueDisplay() {
    setNum('avgRev', state.revenuePerSecond, 'fixed2');
}
