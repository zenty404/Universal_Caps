/**
 * STATE.JS
 * Ce fichier contient l'état unique de vérité de ton application (Single Source of Truth).
 * Toutes les données qui doivent être sauvegardées ou modifiées sont ici.
 */

export const state = {
    // --- Économie & Ressources de base ---
    caps: 0,
    unsold: 0,              // Stock invendu
    funds: 0,               // Argent disponible
    revenuePerSecond: 0,    // Calculé pour l'affichage uniquement
    margin: 0.25,           // Prix de vente par cap
    demand: 0,              // Demande publique (%)
    saveVersion: 2,         // Version du format de sauvegarde

    // --- Production Automatisée (AutoCapsers) ---
    autoCapsers: 0,
    priceAutoCapser: 15,
    autoCapserPerformance: 1,       // 1 = 100% (vitesse normale)
    hasImprovedAutoCapsers: false,   // Legacy — kept for save compat

    // --- MegaCapsers ---
    megaCapsersUnlocked: false,
    megaCapsers: 0,
    priceMegaCapser: 5000,

    // --- Marketing & Demande ---
    marketingLvl: 1,
    adCost: 100,

    // --- Ressources Informatiques (IT) ---
    itResourcesUnlocked: false,
    trust: 0,
    nextTrustAt: 1000,
    ops: 0,
    opsMax: 1000,
    cpuCount: 1,
    ramCount: 1,

    // --- Phase & Progression ---
    phase: 1,
    completedProjects: new Set(),
    sessionStart: Date.now(),
    reached: new Set(),
    milestones: [100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000],

    // --- Phase 1 : Creativity ---
    creativity: 0,
    creativityMax: 500,      // ramCount × 500

    // --- Phase 1 : Fabric ---
    fabricUnlocked: false,
    fabric: 0,
    fabricCostPerCap: 0.05,
    fabricCostMultiplier: 1.0,
    fabricPrice: 5,          // $ pour un rouleau de 500
    fabricRollSize: 500,
    autoSupplyUnlocked: false,

    // --- Phase 1 : Revenue Tracker ---
    revenueTrackerUnlocked: false,
    revenueHistory: [],       // Last 60s of revenue data
    revenuePerMinute: 0,

    // --- Phase 1 : Investment ---
    investmentUnlocked: false,
    investedFunds: 0,
    investmentReturn: 0,      // Dernière variation affichée

    // --- Phase 1 : Strategy Game (Yomi) ---
    strategyUnlocked: false,
    yomi: 0,
    strategyMode: 'balanced', // 'aggressive', 'balanced', 'defensive'
    strategyWins: 0,
    strategyLosses: 0,
    strategyDraws: 0,

    // --- Phase 2 : Energy ---
    solarUnlocked: false,
    solarPanels: 0,
    priceSolarPanel: 500,
    batteriesUnlocked: false,
    batteries: 0,
    priceBattery: 1000,
    energy: 0,
    energyMax: 100,          // Base + batteries×1000

    // --- Phase 2 : Factories ---
    factoriesUnlocked: false,
    factories: 0,
    priceFactory: 10000,
    factoryEfficiency: 1.0,

    // --- Phase 2 : Drones ---
    dronesUnlocked: false,
    drones: 0,
    priceDrone: 2000,
    droneEfficiency: 1.0,

    // --- Phase 2 : Influence ---
    influenceUnlocked: false,
    influence: 0,
    influenceMilestones: [10000000, 50000000, 100000000, 500000000, 1000000000],
    influenceReached: new Set(),

    // --- Phase 3 : Probes ---
    probesUnlocked: false,
    probes: 0,
    selfReplicatingProbes: false,
    probeTrust: 0,
    probeSpeed: 0,
    probeSelfReplication: 0,
    probeHarvesting: 0,
    probeCombat: 0,
    probeExploration: 0,

    // --- Phase 3 : Cosmic ---
    cosmicHarvestingUnlocked: false,
    cosmicFabric: 0,
    cosmicProductionMultiplier: 1,
    universeExplored: 0,     // 0 → 100
    explorationSpeed: 1,

    // --- Phase 3 : Combat Encounters ---
    combatEncounterTimer: 0,
    combatProbesLost: 0,
    combatProbesLostTotal: 0,
    combatVictories: 0,
    combatDefeats: 0,
    combatEncounterCooldown: 30,
    combatLossReduction: 0,

    // --- Phase 3 : Exploration Discoveries ---
    explorationDiscoveries: new Set(),

    // --- Statistics ---
    totalCapsProduced: 0,
    totalCapsSold: 0,
    totalRevenue: 0,

    // --- End Game ---
    endGameReached: false,
    endGameChoice: null       // 'unravel' or 'weave'
};
