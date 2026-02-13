/**
 * STORAGE.JS
 * Sauvegarde et Chargement — format JSON unique.
 */

import { state } from './state.js';
import {
    updateAllDisplays, unlockITResources, showTerminalMessage, hideITResources,
    unlockFabric, unlockMegaCapsers, unlockRevenueTracker,
    unlockInvestment, unlockStrategy,
    unlockEnergy, unlockBatteries, unlockFactories, unlockDrones, unlockInfluence,
    unlockProbes, unlockCosmic, unlockEndGame, showEndGameResult
} from './ui.js';

const SAVE_KEY = 'universal-caps-save';

export function saveGame() {
    const saveData = {
        saveVersion: state.saveVersion,
        caps: state.caps,
        unsold: state.unsold,
        funds: state.funds,
        margin: state.margin,
        demand: state.demand,
        autoCapsers: state.autoCapsers,
        priceAutoCapser: state.priceAutoCapser,
        autoCapserPerformance: state.autoCapserPerformance,
        hasImprovedAutoCapsers: state.hasImprovedAutoCapsers,
        marketingLvl: state.marketingLvl,
        adCost: state.adCost,
        trust: state.trust,
        nextTrustAt: state.nextTrustAt,
        ops: state.ops,
        cpuCount: state.cpuCount,
        ramCount: state.ramCount,
        opsMax: state.opsMax,
        itResourcesUnlocked: state.itResourcesUnlocked,
        reached: [...state.reached],
        elapsed: (parseInt(localStorage.getItem(SAVE_KEY + '-elapsed')) || 0) + (Date.now() - state.sessionStart),

        // Phase 1 — Projects
        completedProjects: [...state.completedProjects],
        phase: state.phase,

        // Phase 1 — Creativity
        creativity: state.creativity,
        creativityMax: state.creativityMax,

        // Phase 1 — Fabric
        fabricUnlocked: state.fabricUnlocked,
        fabric: state.fabric,
        fabricCostMultiplier: state.fabricCostMultiplier,
        autoSupplyUnlocked: state.autoSupplyUnlocked,

        // Phase 1 — MegaCapsers
        megaCapsersUnlocked: state.megaCapsersUnlocked,
        megaCapsers: state.megaCapsers,
        priceMegaCapser: state.priceMegaCapser,

        // Phase 1 — Revenue Tracker
        revenueTrackerUnlocked: state.revenueTrackerUnlocked,

        // Phase 1 — Investment
        investmentUnlocked: state.investmentUnlocked,
        investedFunds: state.investedFunds,

        // Phase 1 — Strategy Game
        strategyUnlocked: state.strategyUnlocked,
        yomi: state.yomi,
        strategyWins: state.strategyWins,
        strategyLosses: state.strategyLosses,
        strategyDraws: state.strategyDraws,

        // Phase 2 — Energy
        solarUnlocked: state.solarUnlocked,
        solarPanels: state.solarPanels,
        priceSolarPanel: state.priceSolarPanel,
        batteriesUnlocked: state.batteriesUnlocked,
        batteries: state.batteries,
        priceBattery: state.priceBattery,
        energy: state.energy,
        energyMax: state.energyMax,

        // Phase 2 — Factories
        factoriesUnlocked: state.factoriesUnlocked,
        factories: state.factories,
        priceFactory: state.priceFactory,
        factoryEfficiency: state.factoryEfficiency,

        // Phase 2 — Drones
        dronesUnlocked: state.dronesUnlocked,
        drones: state.drones,
        priceDrone: state.priceDrone,
        droneEfficiency: state.droneEfficiency,

        // Phase 2 — Influence
        influenceUnlocked: state.influenceUnlocked,
        influence: state.influence,
        influenceReached: [...state.influenceReached],

        // Phase 3 — Probes
        probesUnlocked: state.probesUnlocked,
        probes: state.probes,
        selfReplicatingProbes: state.selfReplicatingProbes,
        probeTrust: state.probeTrust,
        probeSpeed: state.probeSpeed,
        probeSelfReplication: state.probeSelfReplication,
        probeHarvesting: state.probeHarvesting,
        probeCombat: state.probeCombat,
        probeExploration: state.probeExploration,

        // Phase 3 — Cosmic
        cosmicHarvestingUnlocked: state.cosmicHarvestingUnlocked,
        cosmicFabric: state.cosmicFabric,
        cosmicProductionMultiplier: state.cosmicProductionMultiplier,
        universeExplored: state.universeExplored,
        explorationSpeed: state.explorationSpeed,

        // Phase 3 — Combat Encounters
        combatEncounterTimer: state.combatEncounterTimer,
        combatProbesLost: state.combatProbesLost,
        combatProbesLostTotal: state.combatProbesLostTotal,
        combatVictories: state.combatVictories,
        combatDefeats: state.combatDefeats,
        combatEncounterCooldown: state.combatEncounterCooldown,
        combatLossReduction: state.combatLossReduction,

        // Phase 3 — Exploration Discoveries
        explorationDiscoveries: [...state.explorationDiscoveries],

        // Statistics
        totalCapsProduced: state.totalCapsProduced,
        totalCapsSold: state.totalCapsSold,
        totalRevenue: state.totalRevenue,

        // End Game
        endGameReached: state.endGameReached,
        endGameChoice: state.endGameChoice
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    localStorage.setItem(SAVE_KEY + '-elapsed', saveData.elapsed);
    state.sessionStart = Date.now();
}

function validateNumber(value, fallback, isInt = false) {
    const n = isInt ? parseInt(value) : parseFloat(value);
    return (Number.isFinite(n) && n >= 0) ? n : fallback;
}

export function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
        migrateOldSave();
        return;
    }

    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        console.warn('Save data corrupted, starting fresh.');
        showTerminalMessage("Save data corrupted. Starting new game.");
        return;
    }

    if (!data || typeof data !== 'object') return;

    state.caps = validateNumber(data.caps, 0);
    state.unsold = validateNumber(data.unsold, 0);
    state.funds = validateNumber(data.funds, 0);
    state.margin = validateNumber(data.margin, 0.25);
    state.demand = validateNumber(data.demand, 0);

    state.autoCapsers = validateNumber(data.autoCapsers, 0, true);
    state.priceAutoCapser = validateNumber(data.priceAutoCapser, 15);
    state.autoCapserPerformance = validateNumber(data.autoCapserPerformance, 1);
    state.hasImprovedAutoCapsers = data.hasImprovedAutoCapsers === true;

    state.marketingLvl = validateNumber(data.marketingLvl, 1, true);
    state.adCost = validateNumber(data.adCost, 100);

    state.trust = validateNumber(data.trust, 0, true);
    state.nextTrustAt = validateNumber(data.nextTrustAt, 1000, true);
    state.ops = validateNumber(data.ops, 0);
    state.cpuCount = validateNumber(data.cpuCount, 1, true);
    state.ramCount = validateNumber(data.ramCount, 1, true);
    state.opsMax = state.ramCount * 1000;
    state.itResourcesUnlocked = data.itResourcesUnlocked === true;

    state.reached.clear();
    if (Array.isArray(data.reached)) {
        data.reached.forEach(m => state.reached.add(m));
    }
    state.milestones.forEach(m => {
        if (state.caps >= m) state.reached.add(m);
    });

    // Phase 1 — Projects
    state.phase = validateNumber(data.phase, 1, true);
    state.completedProjects.clear();
    if (Array.isArray(data.completedProjects)) {
        data.completedProjects.forEach(id => state.completedProjects.add(id));
    }
    // Migration : ancien hasImprovedAutoCapsers → completedProjects
    if (state.hasImprovedAutoCapsers && !state.completedProjects.has('improvedAuto')) {
        state.completedProjects.add('improvedAuto');
    }

    // Phase 1 — Creativity
    state.creativity = validateNumber(data.creativity, 0);
    state.creativityMax = state.ramCount * 500;

    // Phase 1 — Fabric
    state.fabricUnlocked = data.fabricUnlocked === true;
    state.fabric = validateNumber(data.fabric, 0);
    state.fabricCostMultiplier = validateNumber(data.fabricCostMultiplier, 1.0);
    state.autoSupplyUnlocked = data.autoSupplyUnlocked === true;

    // Phase 1 — MegaCapsers
    state.megaCapsersUnlocked = data.megaCapsersUnlocked === true;
    state.megaCapsers = validateNumber(data.megaCapsers, 0, true);
    state.priceMegaCapser = validateNumber(data.priceMegaCapser, 5000);

    // Phase 1 — Revenue Tracker
    state.revenueTrackerUnlocked = data.revenueTrackerUnlocked === true;

    // Phase 1 — Investment
    state.investmentUnlocked = data.investmentUnlocked === true;
    state.investedFunds = validateNumber(data.investedFunds, 0);

    // Phase 1 — Strategy Game
    state.strategyUnlocked = data.strategyUnlocked === true;
    state.yomi = validateNumber(data.yomi, 0, true);
    state.strategyWins = validateNumber(data.strategyWins, 0, true);
    state.strategyLosses = validateNumber(data.strategyLosses, 0, true);
    state.strategyDraws = validateNumber(data.strategyDraws, 0, true);

    // Phase 2 — Energy
    state.solarUnlocked = data.solarUnlocked === true;
    state.solarPanels = validateNumber(data.solarPanels, 0, true);
    state.priceSolarPanel = validateNumber(data.priceSolarPanel, 500, true);
    state.batteriesUnlocked = data.batteriesUnlocked === true;
    state.batteries = validateNumber(data.batteries, 0, true);
    state.priceBattery = validateNumber(data.priceBattery, 1000, true);
    state.energy = validateNumber(data.energy, 0);
    state.energyMax = 100 + state.batteries * 1000;

    // Phase 2 — Factories
    state.factoriesUnlocked = data.factoriesUnlocked === true;
    state.factories = validateNumber(data.factories, 0, true);
    state.priceFactory = validateNumber(data.priceFactory, 10000, true);
    state.factoryEfficiency = validateNumber(data.factoryEfficiency, 1.0);

    // Phase 2 — Drones
    state.dronesUnlocked = data.dronesUnlocked === true;
    state.drones = validateNumber(data.drones, 0, true);
    state.priceDrone = validateNumber(data.priceDrone, 2000, true);
    state.droneEfficiency = validateNumber(data.droneEfficiency, 1.0);

    // Phase 2 — Influence
    state.influenceUnlocked = data.influenceUnlocked === true;
    state.influence = validateNumber(data.influence, 0, true);
    state.influenceReached.clear();
    if (Array.isArray(data.influenceReached)) {
        data.influenceReached.forEach(m => state.influenceReached.add(m));
    }

    // Phase 3 — Probes
    state.probesUnlocked = data.probesUnlocked === true;
    state.probes = validateNumber(data.probes, 0);
    state.selfReplicatingProbes = data.selfReplicatingProbes === true;
    state.probeTrust = validateNumber(data.probeTrust, 0, true);
    state.probeSpeed = validateNumber(data.probeSpeed, 0, true);
    state.probeSelfReplication = validateNumber(data.probeSelfReplication, 0, true);
    state.probeHarvesting = validateNumber(data.probeHarvesting, 0, true);
    state.probeCombat = validateNumber(data.probeCombat, 0, true);
    state.probeExploration = validateNumber(data.probeExploration, 0, true);

    // Phase 3 — Cosmic
    state.cosmicHarvestingUnlocked = data.cosmicHarvestingUnlocked === true;
    state.cosmicFabric = validateNumber(data.cosmicFabric, 0);
    state.cosmicProductionMultiplier = validateNumber(data.cosmicProductionMultiplier, 1, true);
    state.universeExplored = validateNumber(data.universeExplored, 0);
    state.explorationSpeed = validateNumber(data.explorationSpeed, 1);

    // Phase 3 — Combat Encounters
    state.combatEncounterTimer = validateNumber(data.combatEncounterTimer, 0);
    state.combatProbesLost = validateNumber(data.combatProbesLost, 0);
    state.combatProbesLostTotal = validateNumber(data.combatProbesLostTotal, 0);
    state.combatVictories = validateNumber(data.combatVictories, 0, true);
    state.combatDefeats = validateNumber(data.combatDefeats, 0, true);
    state.combatEncounterCooldown = validateNumber(data.combatEncounterCooldown, 30);
    state.combatLossReduction = validateNumber(data.combatLossReduction, 0);

    // Phase 3 — Exploration Discoveries
    state.explorationDiscoveries.clear();
    if (Array.isArray(data.explorationDiscoveries)) {
        data.explorationDiscoveries.forEach(d => state.explorationDiscoveries.add(d));
    }

    // Statistics
    state.totalCapsProduced = validateNumber(data.totalCapsProduced, 0);
    state.totalCapsSold = validateNumber(data.totalCapsSold, 0);
    state.totalRevenue = validateNumber(data.totalRevenue, 0);

    // End Game
    state.endGameReached = data.endGameReached === true;
    state.endGameChoice = data.endGameChoice || null;

    updateAllDisplays();

    // Restaurer visibilité des sections — Phase 1
    if (state.itResourcesUnlocked) unlockITResources(true);
    if (state.fabricUnlocked) unlockFabric();
    if (state.megaCapsersUnlocked) unlockMegaCapsers();
    if (state.revenueTrackerUnlocked) unlockRevenueTracker();
    if (state.investmentUnlocked) unlockInvestment();
    if (state.strategyUnlocked) unlockStrategy();

    // Restaurer visibilité des sections — Phase 2
    if (state.solarUnlocked) unlockEnergy();
    if (state.batteriesUnlocked) unlockBatteries();
    if (state.factoriesUnlocked) unlockFactories();
    if (state.dronesUnlocked) unlockDrones();
    if (state.influenceUnlocked) unlockInfluence();

    // Restaurer visibilité des sections — Phase 3
    if (state.probesUnlocked) unlockProbes();
    if (state.cosmicHarvestingUnlocked) unlockCosmic();
    if (state.endGameReached) unlockEndGame();
    if (state.endGameChoice) showEndGameResult(state.endGameChoice);

    if(state.caps > 0) {
        showTerminalMessage("Last save loaded.");
    }
}

function migrateOldSave() {
    const oldCaps = localStorage.getItem('caps');
    if (oldCaps === null) return;

    state.caps = parseFloat(oldCaps) || 0;
    state.unsold = parseFloat(localStorage.getItem('unsold')) || 0;
    state.funds = parseFloat(localStorage.getItem('funds')) || 0;
    state.autoCapsers = parseInt(localStorage.getItem('autoCapsers')) || 0;
    state.priceAutoCapser = parseFloat(localStorage.getItem('priceAutoCapser')) || 15;
    state.marketingLvl = parseInt(localStorage.getItem('marketingLvl')) || 1;
    state.adCost = parseFloat(localStorage.getItem('adCost')) || 100;
    state.trust = parseInt(localStorage.getItem('trust')) || 0;
    state.nextTrustAt = parseInt(localStorage.getItem('nextTrustAt')) || 1000;
    state.ops = parseInt(localStorage.getItem('ops')) || 0;
    state.cpuCount = parseInt(localStorage.getItem('cpuCount')) || 1;
    state.ramCount = parseInt(localStorage.getItem('ramCount')) || 1;
    state.opsMax = state.ramCount * 1000;
    state.itResourcesUnlocked = localStorage.getItem('itResourcesUnlocked') === 'true';
    state.hasImprovedAutoCapsers = localStorage.getItem('hasImprovedAutoCapsers') === 'true';
    state.autoCapserPerformance = parseFloat(localStorage.getItem('autoCapserPerformance')) || 1;

    // Migration hasImprovedAutoCapsers → completedProjects
    if (state.hasImprovedAutoCapsers) {
        state.completedProjects.add('improvedAuto');
    }

    try {
        const reachedArray = JSON.parse(localStorage.getItem('reached'));
        state.reached.clear();
        if (Array.isArray(reachedArray)) {
            reachedArray.forEach(m => state.reached.add(m));
        }
    } catch (e) {
        state.reached.clear();
    }
    state.milestones.forEach(m => {
        if (state.caps >= m) state.reached.add(m);
    });

    // Sauvegarder dans le nouveau format puis nettoyer l'ancien
    saveGame();
    const keysToRemove = ['caps','unsold','funds','autoCapsers','priceAutoCapser',
        'marketingLvl','adCost','hasImprovedAutoCapsers','autoCapserPerformance',
        'trust','nextTrustAt','ops','cpuCount','ramCount','itResourcesUnlocked',
        'reached','elapsed'];
    keysToRemove.forEach(k => localStorage.removeItem(k));

    updateAllDisplays();

    if (state.itResourcesUnlocked) {
        unlockITResources(true);
    }
    if(state.caps > 0) {
        showTerminalMessage("Save migrated to new format.");
    }
}

export function resetGame() {
    if (!confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        return;
    }

    // Base
    state.caps = 0;
    state.unsold = 0;
    state.funds = 0;
    state.margin = 0.25;
    state.demand = 0;

    state.autoCapsers = 0;
    state.priceAutoCapser = 15;
    state.autoCapserPerformance = 1;
    state.hasImprovedAutoCapsers = false;

    state.marketingLvl = 1;
    state.adCost = 100;

    state.trust = 0;
    state.nextTrustAt = 1000;
    state.ops = 0;
    state.cpuCount = 1;
    state.ramCount = 1;
    state.opsMax = 1000;
    state.itResourcesUnlocked = false;

    state.reached.clear();

    // Phase 1
    state.phase = 1;
    state.completedProjects.clear();

    state.creativity = 0;
    state.creativityMax = 500;

    state.fabricUnlocked = false;
    state.fabric = 0;
    state.fabricCostMultiplier = 1.0;
    state.autoSupplyUnlocked = false;

    state.megaCapsersUnlocked = false;
    state.megaCapsers = 0;
    state.priceMegaCapser = 5000;

    state.revenueTrackerUnlocked = false;
    state.revenueHistory = [];
    state.revenuePerMinute = 0;

    state.investmentUnlocked = false;
    state.investedFunds = 0;
    state.investmentReturn = 0;

    state.strategyUnlocked = false;
    state.yomi = 0;
    state.strategyWins = 0;
    state.strategyLosses = 0;
    state.strategyDraws = 0;

    // Phase 2
    state.solarUnlocked = false;
    state.solarPanels = 0;
    state.priceSolarPanel = 500;
    state.batteriesUnlocked = false;
    state.batteries = 0;
    state.priceBattery = 1000;
    state.energy = 0;
    state.energyMax = 100;

    state.factoriesUnlocked = false;
    state.factories = 0;
    state.priceFactory = 10000;
    state.factoryEfficiency = 1.0;

    state.dronesUnlocked = false;
    state.drones = 0;
    state.priceDrone = 2000;
    state.droneEfficiency = 1.0;

    state.influenceUnlocked = false;
    state.influence = 0;
    state.influenceReached.clear();

    // Phase 3
    state.probesUnlocked = false;
    state.probes = 0;
    state.selfReplicatingProbes = false;
    state.probeTrust = 0;
    state.probeSpeed = 0;
    state.probeSelfReplication = 0;
    state.probeHarvesting = 0;
    state.probeCombat = 0;
    state.probeExploration = 0;

    state.cosmicHarvestingUnlocked = false;
    state.cosmicFabric = 0;
    state.cosmicProductionMultiplier = 1;
    state.universeExplored = 0;
    state.explorationSpeed = 1;

    // Phase 3 — Combat
    state.combatEncounterTimer = 0;
    state.combatProbesLost = 0;
    state.combatProbesLostTotal = 0;
    state.combatVictories = 0;
    state.combatDefeats = 0;
    state.combatEncounterCooldown = 30;
    state.combatLossReduction = 0;

    // Phase 3 — Exploration Discoveries
    state.explorationDiscoveries.clear();

    // Statistics
    state.totalCapsProduced = 0;
    state.totalCapsSold = 0;
    state.totalRevenue = 0;

    state.endGameReached = false;
    state.endGameChoice = null;

    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SAVE_KEY + '-elapsed');

    // Masquer les sections — Phase 1
    hideITResources();
    const fabricDiv = document.getElementById('fabricDiv');
    if (fabricDiv) fabricDiv.style.display = 'none';
    const megaCapserDiv = document.getElementById('megaCapserDiv');
    if (megaCapserDiv) megaCapserDiv.style.display = 'none';
    const revenueTrackerSpan = document.getElementById('revenueTrackerSpan');
    if (revenueTrackerSpan) revenueTrackerSpan.style.display = 'none';
    const investmentDiv = document.getElementById('investmentDiv');
    if (investmentDiv) investmentDiv.style.display = 'none';
    const strategyDiv = document.getElementById('strategyDiv');
    if (strategyDiv) strategyDiv.style.display = 'none';

    // Masquer les sections — Phase 2
    const energyDiv = document.getElementById('energyDiv');
    if (energyDiv) energyDiv.style.display = 'none';
    const factoriesDiv = document.getElementById('factoriesDiv');
    if (factoriesDiv) factoriesDiv.style.display = 'none';
    const dronesDiv = document.getElementById('dronesDiv');
    if (dronesDiv) dronesDiv.style.display = 'none';
    const influenceDiv = document.getElementById('influenceDiv');
    if (influenceDiv) influenceDiv.style.display = 'none';
    const btnBuyBattery = document.getElementById('btnBuyBattery');
    if (btnBuyBattery) btnBuyBattery.style.display = 'none';
    const batteryLine = document.getElementById('batteryLine');
    if (batteryLine) batteryLine.style.display = 'none';

    // Masquer les sections — Phase 3
    const probesDiv = document.getElementById('probesDiv');
    if (probesDiv) probesDiv.style.display = 'none';
    const cosmicDiv = document.getElementById('cosmicDiv');
    if (cosmicDiv) cosmicDiv.style.display = 'none';
    const endGameDiv = document.getElementById('endGameDiv');
    if (endGameDiv) endGameDiv.style.display = 'none';
    const probeRepLine = document.getElementById('probeReplicationLine');
    if (probeRepLine) probeRepLine.style.display = 'none';

    // Combat log
    const combatLogDiv = document.getElementById('combatLogDiv');
    if (combatLogDiv) combatLogDiv.style.display = 'none';
    const combatLastEl = document.getElementById('combatLast');
    if (combatLastEl) combatLastEl.textContent = '';

    // Discovery log
    const discoveryLog = document.getElementById('discoveryLog');
    if (discoveryLog) discoveryLog.style.display = 'none';

    // Restaurer le end game UI
    const endGameChoices = document.getElementById('endGameChoices');
    if (endGameChoices) endGameChoices.style.display = '';
    const endGameResult = document.getElementById('endGameResult');
    if (endGameResult) { endGameResult.style.display = 'none'; endGameResult.innerHTML = ''; }

    // Supprimer les boutons de projets dynamiques
    const projectsDiv = document.getElementById('projectsDiv');
    if (projectsDiv) {
        const buttons = projectsDiv.querySelectorAll('.project-btn');
        buttons.forEach(btn => btn.remove());
    }

    // Effacer le résultat de stratégie
    const strategyResult = document.getElementById('strategyResult');
    if (strategyResult) strategyResult.textContent = '';

    updateAllDisplays();

    showTerminalMessage("Game reset! IT Systems Rebooted.", 5000);
}
