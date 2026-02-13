/**
 * PROJECTS.JS
 * Registre data-driven de tous les projets du jeu (30 projets, 3 phases).
 */

export const projects = [
    // ============================================================
    // PHASE 1 — Manufacturing (enrichie)
    // ============================================================
    {
        id: 'improvedAuto',
        name: 'Improved AutoCapsers',
        description: '+50% AutoCapser performance',
        cost: { ops: 500 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 10000,
        effect: (s) => { s.autoCapserPerformance += 0.5; },
        oneTime: true
    },
    {
        id: 'capItalInsights',
        name: 'Cap-ital Insights',
        description: 'Unlock revenue/min counter',
        cost: { creativity: 50 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 5000,
        effect: (s) => { s.revenueTrackerUnlocked = true; },
        oneTime: true
    },
    {
        id: 'fabricSourcing',
        name: 'Fabric Sourcing',
        description: 'Unlock fabric system — caps now require fabric to produce',
        cost: { ops: 1000 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 25000,
        effect: (s) => { s.fabricUnlocked = true; s.fabric = 500; },
        oneTime: true
    },
    {
        id: 'bulkFabric',
        name: 'Bulk Fabric Deal',
        description: 'Fabric costs reduced by 30%',
        cost: { ops: 2000 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 50000 && s.fabricUnlocked,
        effect: (s) => { s.fabricCostMultiplier = 0.7; },
        oneTime: true
    },
    {
        id: 'autoSupply',
        name: 'Auto Supply',
        description: 'Automatically buy fabric when stock runs low',
        cost: { ops: 3000 },
        phase: 1,
        unlockCondition: (s) => s.fabricUnlocked && s.caps >= 75000,
        effect: (s) => { s.autoSupplyUnlocked = true; },
        oneTime: true
    },
    {
        id: 'megaCapsers',
        name: 'MegaCapsers',
        description: 'Unlock MegaCapsers (x50 production, high cost)',
        cost: { ops: 5000 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 100000,
        effect: (s) => { s.megaCapsersUnlocked = true; },
        oneTime: true
    },
    {
        id: 'capItalism101',
        name: 'Cap-italism 101',
        description: 'Unlock investment fund — earn passive income',
        cost: { creativity: 100 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 200000,
        effect: (s) => { s.investmentUnlocked = true; },
        oneTime: true
    },
    {
        id: 'capTheorem',
        name: 'The Cap Theorem',
        description: '+1 Trust bonus (a mathematical insight about caps)',
        cost: { creativity: 150 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 50000,
        effect: (s) => { s.trust += 1; },
        oneTime: true
    },
    {
        id: 'toCapOrNot',
        name: 'To Cap or Not to Cap',
        description: '+2 Trust bonus (a philosophical reflection)',
        cost: { creativity: 200 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 500000,
        effect: (s) => { s.trust += 2; },
        oneTime: true
    },
    {
        id: 'algorithmicStitching',
        name: 'Algorithmic Stitching',
        description: 'AutoCapsers +100% performance',
        cost: { ops: 3000 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 300000,
        effect: (s) => { s.autoCapserPerformance += 1.0; },
        oneTime: true
    },
    {
        id: 'strategicModeling',
        name: 'Strategic Modeling',
        description: 'Unlock strategy game — generates yomi currency',
        cost: { ops: 8000 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 1000000,
        effect: (s) => { s.strategyUnlocked = true; },
        oneTime: true
    },
    {
        id: 'capifesto',
        name: 'The Capifesto',
        description: '+5 Trust, a philosophical manifesto on caps',
        cost: { creativity: 500 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 5000000,
        effect: (s) => { s.trust += 5; },
        oneTime: true
    },
    {
        id: 'fullAutomation',
        name: 'Full Automation Protocol',
        description: 'TRANSITION TO PHASE 2 — The Industrial Era',
        cost: { ops: 20000, creativity: 1000 },
        phase: 1,
        unlockCondition: (s) => s.caps >= 10000000,
        effect: (s) => { s.phase = 2; },
        oneTime: true
    },

    // ============================================================
    // PHASE 2 — Industrialisation
    // ============================================================
    {
        id: 'solarArray',
        name: 'Solar Array',
        description: 'Unlock solar panels for energy generation',
        cost: { ops: 5000 },
        phase: 2,
        unlockCondition: (s) => s.phase >= 2,
        effect: (s) => { s.solarUnlocked = true; },
        oneTime: true
    },
    {
        id: 'batteryTech',
        name: 'Battery Tech',
        description: 'Unlock batteries for energy storage',
        cost: { ops: 8000 },
        phase: 2,
        unlockCondition: (s) => s.phase >= 2 && s.solarPanels >= 1,
        effect: (s) => { s.batteriesUnlocked = true; },
        oneTime: true
    },
    {
        id: 'factoryBlueprint',
        name: 'Factory Blueprint',
        description: 'Unlock factory construction',
        cost: { ops: 10000 },
        phase: 2,
        unlockCondition: (s) => s.phase >= 2 && s.energy > 0,
        effect: (s) => { s.factoriesUnlocked = true; },
        oneTime: true
    },
    {
        id: 'harvesterDrones',
        name: 'Harvester Drones',
        description: 'Drones auto-harvest fabric — no more buying!',
        cost: { ops: 15000 },
        phase: 2,
        unlockCondition: (s) => s.phase >= 2 && s.factories >= 1,
        effect: (s) => { s.dronesUnlocked = true; },
        oneTime: true
    },
    {
        id: 'quantumThreading',
        name: 'Quantum Threading',
        description: 'Factories +200% efficiency',
        cost: { creativity: 500 },
        phase: 2,
        unlockCondition: (s) => s.caps >= 50000000,
        effect: (s) => { s.factoryEfficiency += 2.0; },
        oneTime: true
    },
    {
        id: 'capDiplomacy',
        name: 'Cap Diplomacy',
        description: 'Unlock influence & world trade',
        cost: { creativity: 1000 },
        phase: 2,
        unlockCondition: (s) => s.caps >= 100000000,
        effect: (s) => { s.influenceUnlocked = true; },
        oneTime: true
    },
    {
        id: 'neuralStitchwork',
        name: 'Neural Stitchwork',
        description: 'Drones auto-optimize production',
        cost: { ops: 25000 },
        phase: 2,
        unlockCondition: (s) => s.influence > 10,
        effect: (s) => { s.droneEfficiency += 2.0; },
        oneTime: true
    },
    {
        id: 'capAccords',
        name: 'The Cap Accords',
        description: '+20 influence — a historic global treaty on caps',
        cost: { creativity: 2000 },
        phase: 2,
        unlockCondition: (s) => s.influence > 50,
        effect: (s) => { s.influence += 20; },
        oneTime: true
    },
    {
        id: 'orbitalLoom',
        name: 'Orbital Loom',
        description: 'Space factories — x10 factory production',
        cost: { ops: 50000 },
        phase: 2,
        unlockCondition: (s) => s.influence > 100,
        effect: (s) => { s.factoryEfficiency += 9.0; },
        oneTime: true
    },
    {
        id: 'launchProtocol',
        name: 'Launch Protocol',
        description: 'TRANSITION TO PHASE 3 — The Cosmic Era',
        cost: { ops: 100000, creativity: 5000 },
        phase: 2,
        unlockCondition: (s) => s.caps >= 1000000000 && s.influence > 200,
        effect: (s) => { s.phase = 3; },
        oneTime: true
    },

    // ============================================================
    // PHASE 3 — Expansion Cosmique
    // ============================================================
    {
        id: 'probeDesign',
        name: 'Probe Design',
        description: 'Unlock self-replicating probes & probe trust',
        cost: { ops: 50000 },
        phase: 3,
        unlockCondition: (s) => s.phase >= 3,
        effect: (s) => { s.probesUnlocked = true; s.probes = 1; s.probeTrust = 5; },
        oneTime: true
    },
    {
        id: 'selfReplicating',
        name: 'Self-Replicating Probes',
        description: 'Probes reproduce automatically',
        cost: { ops: 100000 },
        phase: 3,
        unlockCondition: (s) => s.probes >= 10,
        effect: (s) => { s.selfReplicatingProbes = true; },
        oneTime: true
    },
    {
        id: 'cosmicHarvesting',
        name: 'Cosmic Fabric Harvesting',
        description: 'Probes harvest cosmic fabric',
        cost: { ops: 200000 },
        phase: 3,
        unlockCondition: (s) => s.probes >= 100,
        effect: (s) => { s.cosmicHarvestingUnlocked = true; },
        oneTime: true
    },
    {
        id: 'interstellarNav',
        name: 'Interstellar Navigation',
        description: 'x5 exploration speed',
        cost: { creativity: 2000 },
        phase: 3,
        unlockCondition: (s) => s.universeExplored >= 1,
        effect: (s) => { s.explorationSpeed *= 5; },
        oneTime: true
    },
    {
        id: 'universalThread',
        name: 'The Universal Thread',
        description: 'A cosmic truth about the nature of fabric...',
        cost: { creativity: 5000 },
        phase: 3,
        unlockCondition: (s) => s.universeExplored >= 10,
        effect: (s) => { s.trust += 10; },
        oneTime: true
    },
    {
        id: 'warpStitching',
        name: 'Warp Stitching',
        description: 'x5 exploration speed',
        cost: { ops: 500000 },
        phase: 3,
        unlockCondition: (s) => s.universeExplored >= 25,
        effect: (s) => { s.explorationSpeed *= 5; },
        oneTime: true
    },
    {
        id: 'galacticNetwork',
        name: 'Galactic Cap Network',
        description: 'Massive cosmic cap production',
        cost: { ops: 1000000 },
        phase: 3,
        unlockCondition: (s) => s.universeExplored >= 50,
        effect: (s) => { s.cosmicProductionMultiplier = 10; },
        oneTime: true
    },
    {
        id: 'cosmicForge',
        name: 'Cosmic Forge',
        description: '+50% cosmic production multiplier',
        cost: { ops: 200000, cosmicFabric: 500 },
        phase: 3,
        unlockCondition: (s) => s.cosmicFabric >= 200,
        effect: (s) => { s.cosmicProductionMultiplier = Math.floor(s.cosmicProductionMultiplier * 1.5); },
        oneTime: true
    },
    {
        id: 'cosmicArmor',
        name: 'Cosmic Armor Plating',
        description: '-50% combat probe losses',
        cost: { cosmicFabric: 2000 },
        phase: 3,
        unlockCondition: (s) => s.combatDefeats >= 3,
        effect: (s) => { s.combatLossReduction = 0.5; },
        oneTime: true
    },
    {
        id: 'cosmicBeacon',
        name: 'Cosmic Beacon',
        description: '+5 probe trust',
        cost: { cosmicFabric: 5000 },
        phase: 3,
        unlockCondition: (s) => s.universeExplored >= 30,
        effect: (s) => { s.probeTrust += 5; },
        oneTime: true
    },
    {
        id: 'finalStitch',
        name: 'The Final Stitch',
        description: 'The universe is fully explored... choose your destiny.',
        cost: {},
        phase: 3,
        unlockCondition: (s) => s.universeExplored >= 100,
        effect: (s) => { s.endGameReached = true; },
        oneTime: true
    }
];
