/**
 * ACTIONS.JS
 * Logique métier.
 */

import { state } from './state.js';
import { projects } from './projects.js';
import {
    updateAllDisplays, showTerminalMessage, unlockITResources,
    updateDemandDisplay, updateMarginDisplay, updateRevenueDisplay,
    renderProjectButton, hideProjectButton, updateProjectButton,
    unlockFabric, unlockMegaCapsers, unlockRevenueTracker,
    unlockInvestment, unlockStrategy,
    unlockEnergy, unlockBatteries, unlockFactories, unlockDrones, unlockInfluence,
    unlockProbes, unlockCosmic, unlockEndGame, showEndGameResult
} from './ui.js';

// ==========================================
// 1. FONCTIONS PRIVÉES
// ==========================================

function checkMilestones() {
    for (const m of state.milestones) {
        if (state.caps >= m && !state.reached.has(m)) {
            state.reached.add(m);
            showTerminalMessage(`Milestone reached: ${m.toLocaleString()} caps!`);
        }
    }
}

function checkTrustGain() {
    if (state.caps >= state.nextTrustAt) {
        state.trust++;
        showTerminalMessage(`Trust Increased! Current Trust: ${state.trust}`);
        state.nextTrustAt = Math.floor(state.nextTrustAt * 1.8);
        updateAllDisplays();
    }
}


// ==========================================
// 2. ACTIONS JOUEUR
// ==========================================

export function makeCaps(amount) {
    // Fabric check
    if (state.fabricUnlocked) {
        const fabricNeeded = amount * state.fabricCostPerCap;
        if (state.fabric < fabricNeeded) {
            amount = Math.floor(state.fabric / state.fabricCostPerCap);
            if (amount <= 0) return;
        }
        state.fabric -= amount * state.fabricCostPerCap;
    }

    state.caps += amount;
    state.unsold += amount;
    state.totalCapsProduced += amount;

    updateAllDisplays();

    checkMilestones();
    checkTrustGain();

    if (state.caps >= 100) {
        unlockITResources();
    }
}

export function lowerPrice() {
    state.margin = Math.max(0.01, state.margin - 0.01);
    updateMarginDisplay(state.margin);
    calculatePublicDemand();
}

export function raisePrice() {
    state.margin = Math.max(0.01, state.margin + 0.01);
    updateMarginDisplay(state.margin);
    calculatePublicDemand();
}

export function buyAutoCapser() {
    if(state.funds >= state.priceAutoCapser){
        state.funds -= state.priceAutoCapser;
        state.autoCapsers += 1;
        state.priceAutoCapser *= 1.18;
        showTerminalMessage(`AutoCapser purchased! Total: ${state.autoCapsers}`);
        updateAllDisplays();
    }
}

export function buyAds() {
    if(state.funds >= state.adCost) {
        state.funds -= state.adCost;
        state.marketingLvl += 1;
        state.adCost *= 3;
        showTerminalMessage(`Marketing expanded! Level: ${state.marketingLvl}`);
        updateAllDisplays();
    }
}

export function buyCPU() {
    if (state.trust < 1) return;
    state.trust--;
    state.cpuCount++;
    showTerminalMessage(`CPU purchased! Total CPUs: ${state.cpuCount}`);
    updateAllDisplays();
}

export function buyRAM() {
    if (state.trust < 1) return;
    state.trust--;
    state.ramCount++;
    state.opsMax = state.ramCount * 1000;
    showTerminalMessage(`RAM purchased! Total RAM: ${state.ramCount} (Max Ops: ${state.opsMax})`);
    updateAllDisplays();
}

// --- Système de projets générique ---

export function buyProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    if (state.completedProjects.has(id)) return;

    // Vérifier les coûts
    if (project.cost.ops && state.ops < project.cost.ops) return;
    if (project.cost.creativity && state.creativity < project.cost.creativity) return;
    if (project.cost.yomi && state.yomi < project.cost.yomi) return;
    if (project.cost.funds && state.funds < project.cost.funds) return;
    if (project.cost.cosmicFabric && state.cosmicFabric < project.cost.cosmicFabric) return;

    // Déduire les coûts
    if (project.cost.ops) state.ops -= project.cost.ops;
    if (project.cost.creativity) state.creativity -= project.cost.creativity;
    if (project.cost.yomi) state.yomi -= project.cost.yomi;
    if (project.cost.funds) state.funds -= project.cost.funds;
    if (project.cost.cosmicFabric) state.cosmicFabric -= project.cost.cosmicFabric;

    // Appliquer l'effet
    project.effect(state);
    state.completedProjects.add(id);

    // Masquer le bouton
    hideProjectButton(id);

    // Appliquer les effets de visibilité — Phase 1
    if (state.fabricUnlocked) unlockFabric();
    if (state.megaCapsersUnlocked) unlockMegaCapsers();
    if (state.revenueTrackerUnlocked) unlockRevenueTracker();
    if (state.investmentUnlocked) unlockInvestment();
    if (state.strategyUnlocked) unlockStrategy();

    // Appliquer les effets de visibilité — Phase 2
    if (state.solarUnlocked) unlockEnergy();
    if (state.batteriesUnlocked) unlockBatteries();
    if (state.factoriesUnlocked) unlockFactories();
    if (state.dronesUnlocked) unlockDrones();
    if (state.influenceUnlocked) unlockInfluence();

    // Appliquer les effets de visibilité — Phase 3
    if (state.probesUnlocked) unlockProbes();
    if (state.cosmicHarvestingUnlocked) unlockCosmic();
    if (state.endGameReached) unlockEndGame();

    // Transitions de phase
    if (state.phase === 2 && id === 'fullAutomation') {
        showTerminalMessage("PHASE 2: The Industrial Era begins!");
    }
    if (state.phase === 3 && id === 'launchProtocol') {
        showTerminalMessage("PHASE 3: The Cosmic Era begins!");
    }

    showTerminalMessage(`Project completed: ${project.name}`);
    updateAllDisplays();
}

export function checkProjects() {
    for (const project of projects) {
        if (project.phase > state.phase) continue;
        if (state.completedProjects.has(project.id)) continue;
        if (!project.unlockCondition(state)) continue;

        // Créer ou afficher le bouton
        const existingBtn = document.getElementById(`proj-${project.id}`);
        if (!existingBtn) {
            const btn = renderProjectButton(project);
            if (btn) {
                btn.addEventListener('click', () => buyProject(project.id));
                showTerminalMessage(`New Project available: ${project.name}`);
            }
        }

        // Enable/disable selon ressources
        updateProjectButton(project);
    }
}

// --- Fabric ---

export function buyFabric() {
    const cost = state.fabricPrice * state.fabricCostMultiplier;
    if (state.funds >= cost) {
        state.funds -= cost;
        state.fabric += state.fabricRollSize;
        showTerminalMessage(`Fabric purchased! +${state.fabricRollSize} units`);
        updateAllDisplays();
    }
}

export function autoSupply() {
    if (!state.autoSupplyUnlocked || !state.fabricUnlocked) return;
    // Achète un rouleau quand le stock passe sous 100 unités
    if (state.fabric < 100) {
        const cost = state.fabricPrice * state.fabricCostMultiplier;
        if (state.funds >= cost) {
            state.funds -= cost;
            state.fabric += state.fabricRollSize;
        }
    }
}

// --- MegaCapsers ---

export function buyMegaCapser() {
    if (state.funds >= state.priceMegaCapser) {
        state.funds -= state.priceMegaCapser;
        state.megaCapsers++;
        state.priceMegaCapser *= 1.25;
        showTerminalMessage(`MegaCapser purchased! Total: ${state.megaCapsers}`);
        updateAllDisplays();
    }
}

// --- Investment ---

export function investFunds(amount) {
    if (state.funds >= amount) {
        state.funds -= amount;
        state.investedFunds += amount;
        updateAllDisplays();
    }
}

export function withdrawFunds() {
    if (state.investedFunds > 0) {
        state.funds += state.investedFunds;
        showTerminalMessage(`Withdrew $${state.investedFunds.toFixed(2)} from investment fund`);
        state.investedFunds = 0;
        state.investmentReturn = 0;
        updateAllDisplays();
    }
}

export function processInvestment() {
    if (!state.investmentUnlocked || state.investedFunds <= 0) return;
    state.investmentReturn = state.investedFunds * (Math.random() * 0.07 - 0.02);
    state.investedFunds += state.investmentReturn;
    if (state.investedFunds < 0) state.investedFunds = 0;
    updateAllDisplays();
}

// --- Strategy Game (Yomi) ---

export function playStrategy(choice) {
    const choices = ['aggressive', 'balanced', 'defensive'];
    const aiChoice = choices[Math.floor(Math.random() * 3)];
    const icons = { aggressive: '\u2694\uFE0F', balanced: '\u2696\uFE0F', defensive: '\uD83D\uDEE1\uFE0F' };

    // Aggressive > Defensive, Defensive > Balanced, Balanced > Aggressive
    const wins = { aggressive: 'defensive', defensive: 'balanced', balanced: 'aggressive' };

    // Update arena icons
    const playerIcon = document.getElementById('stratPlayerIcon');
    const aiIcon = document.getElementById('stratAIIcon');
    if (playerIcon) { playerIcon.textContent = icons[choice]; playerIcon.className = `strat-icon strat-pick-${choice}`; }
    if (aiIcon) { aiIcon.textContent = icons[aiChoice]; aiIcon.className = `strat-icon strat-pick-${aiChoice}`; }

    const resultEl = document.getElementById('strategyResult');
    let resultText, resultClass;

    if (choice === aiChoice) {
        state.yomi += 1;
        state.strategyDraws++;
        resultText = `Draw! Both chose ${choice}. +1 Yomi`;
        resultClass = 'strat-result strat-draw';
    } else if (wins[choice] === aiChoice) {
        const bonus = 2 + Math.floor(state.strategyWins / 10);
        state.yomi += bonus;
        state.strategyWins++;
        resultText = `Victory! ${choice} beats ${aiChoice}. +${bonus} Yomi`;
        resultClass = 'strat-result strat-win';
    } else {
        state.strategyLosses++;
        resultText = `Defeat! ${aiChoice} beats ${choice}.`;
        resultClass = 'strat-result strat-loss';
    }

    if (resultEl) {
        resultEl.textContent = resultText;
        resultEl.className = resultClass;
        // Trigger animation
        resultEl.style.animation = 'none';
        resultEl.offsetHeight; // reflow
        resultEl.style.animation = '';
    }

    updateAllDisplays();
}


// ==========================================
// 3. LOGIQUE AUTOMATIQUE
// ==========================================

export function calculatePublicDemand() {
    const price = state.margin;
    let demand = 100 * Math.pow(0.98, price * 100);
    demand *= 1 + 0.05 * state.marketingLvl;
    demand = Math.max(0, Math.min(500, demand));

    updateDemandDisplay(demand);
    return demand;
}

export function autoGenerateCaps() {
    const autoProduction = state.autoCapsers * state.autoCapserPerformance;
    const megaProduction = state.megaCapsers * 50 * state.autoCapserPerformance;
    let amount = autoProduction + megaProduction;

    if (amount <= 0) return;

    // Fabric check
    if (state.fabricUnlocked) {
        const fabricNeeded = amount * state.fabricCostPerCap;
        if (state.fabric < fabricNeeded) {
            amount = Math.floor(state.fabric / state.fabricCostPerCap);
            if (amount <= 0) return;
        }
        state.fabric -= amount * state.fabricCostPerCap;
    }

    state.caps += amount;
    state.unsold += amount;
    state.totalCapsProduced += amount;

    updateAllDisplays();
    checkMilestones();
    checkTrustGain();

    if (state.caps >= 100) {
        unlockITResources();
    }
}

export function autoSell() {
    const demand = state.demand;
    const price = state.margin;

    state.revenuePerSecond = 0;

    if (state.unsold <= 0 || demand <= 0) {
        updateRevenueDisplay();
        return;
    }

    let sold = Math.floor(state.unsold * (demand / 100));
    if (sold > state.unsold) sold = Math.floor(state.unsold);

    if (sold > 0) {
        state.unsold -= sold;
        const revenue = sold * price;
        state.funds += revenue;
        state.totalCapsSold += sold;
        state.totalRevenue += revenue;

        state.revenuePerSecond = revenue;

        // Revenue tracking
        if (state.revenueTrackerUnlocked) {
            state.revenueHistory.push(revenue);
            if (state.revenueHistory.length > 60) state.revenueHistory.shift();
            state.revenuePerMinute = state.revenueHistory.reduce((a, b) => a + b, 0);
        }

        updateAllDisplays();
    }

    updateRevenueDisplay();
}

export function processOps() {
    if (state.ops < state.opsMax) {
        state.ops += state.cpuCount;
        if (state.ops > state.opsMax) state.ops = state.opsMax;
        updateAllDisplays();
    }
}

export function generateCreativity() {
    state.creativityMax = state.ramCount * 500;
    // Creativity only generates when ops are full
    if (state.ops < state.opsMax) return;
    if (state.creativity < state.creativityMax) {
        state.creativity += state.cpuCount * 0.2;
        if (state.creativity > state.creativityMax) state.creativity = state.creativityMax;
        updateAllDisplays();
    }
}

// ==========================================
// 4. PHASE 2 — Industrialisation
// ==========================================

// --- Energy (Solar Panels + Batteries) ---

export function buySolarPanel() {
    if (!state.solarUnlocked) return;
    if (state.funds < state.priceSolarPanel) return;
    state.funds -= state.priceSolarPanel;
    state.solarPanels++;
    state.priceSolarPanel = Math.floor(state.priceSolarPanel * 1.3);
    showTerminalMessage(`Solar Panel purchased! Total: ${state.solarPanels}`);
    updateAllDisplays();
}

export function buyBattery() {
    if (!state.batteriesUnlocked) return;
    if (state.funds < state.priceBattery) return;
    state.funds -= state.priceBattery;
    state.batteries++;
    state.energyMax = 100 + state.batteries * 1000;
    state.priceBattery = Math.floor(state.priceBattery * 1.5);
    showTerminalMessage(`Battery purchased! Storage: ${state.energyMax}`);
    updateAllDisplays();
}

export function processEnergy() {
    if (!state.solarUnlocked || state.solarPanels <= 0) return;
    state.energy += state.solarPanels * 5;
    if (state.energy > state.energyMax) state.energy = state.energyMax;
}

// --- Factories ---

export function buyFactory() {
    if (!state.factoriesUnlocked) return;
    if (state.funds < state.priceFactory) return;
    state.funds -= state.priceFactory;
    state.factories++;
    state.priceFactory = Math.floor(state.priceFactory * 1.4);
    showTerminalMessage(`Factory built! Total: ${state.factories}`);
    updateAllDisplays();
}

export function processFactories() {
    if (!state.factoriesUnlocked || state.factories <= 0) return;

    // Vérifier toutes les contraintes AVANT de consommer
    const energyNeeded = state.factories * 10;
    if (state.energy < energyNeeded) return;

    const production = state.factories * 100 * state.factoryEfficiency;

    if (state.fabricUnlocked) {
        const fabricNeeded = production * state.fabricCostPerCap;
        if (state.fabric < fabricNeeded) return;
        // Tout est OK — consommer les deux ressources
        state.energy -= energyNeeded;
        state.fabric -= fabricNeeded;
    } else {
        state.energy -= energyNeeded;
    }

    state.caps += production;
    state.unsold += production;
    state.totalCapsProduced += production;

    checkMilestones();
    checkTrustGain();
}

// --- Drones ---

export function buyDrone() {
    if (!state.dronesUnlocked) return;
    if (state.funds < state.priceDrone) return;
    state.funds -= state.priceDrone;
    state.drones++;
    state.priceDrone = Math.floor(state.priceDrone * 1.3);
    showTerminalMessage(`Drone deployed! Total: ${state.drones}`);
    updateAllDisplays();
}

export function processDrones() {
    if (!state.dronesUnlocked || state.drones <= 0) return;
    state.fabric += state.drones * 10 * state.droneEfficiency;
}

// --- Influence ---

export function processInfluence() {
    if (!state.influenceUnlocked) return;

    // Récompenses indexées sur state.influenceMilestones
    const rewards = [10, 50, 100, 500, 1000];

    for (let i = 0; i < state.influenceMilestones.length; i++) {
        const threshold = state.influenceMilestones[i];
        if (state.caps >= threshold && !state.influenceReached.has(threshold)) {
            state.influenceReached.add(threshold);
            const reward = rewards[i] || 10;
            state.influence += reward;
            const label = threshold >= 1000000000 ? `${threshold / 1000000000}B` : `${threshold / 1000000}M`;
            showTerminalMessage(`Influence milestone: ${label} caps → +${reward} influence`);
        }
    }
}

// ==========================================
// 5. PHASE 3 — Expansion Cosmique
// ==========================================

// --- Probe Trust Allocation ---

function probeTrustUsed() {
    return state.probeSpeed + state.probeSelfReplication + state.probeHarvesting
         + state.probeCombat + state.probeExploration;
}

export function allocateProbeTrust(stat, delta) {
    if (!state.probesUnlocked) return;
    const current = state[stat];
    if (delta > 0) {
        const available = state.probeTrust - probeTrustUsed();
        if (available <= 0) return;
        delta = Math.min(delta, available);
    } else if (delta < 0) {
        if (current <= 0) return;
        delta = -Math.min(-delta, current);
    }
    state[stat] = Math.max(0, state[stat] + delta);
    updateAllDisplays();
}

// --- Probes (self-replication) ---

export function processProbes() {
    if (!state.probesUnlocked || !state.selfReplicatingProbes) return;
    if (state.probeSelfReplication <= 0) return;
    // Croissance avec damping logarithmique — plateau naturel ~10K-100K
    const damping = 1 / (1 + Math.log10(Math.max(1, state.probes)));
    const growth = state.probes * state.probeSelfReplication * 0.01 * damping;
    state.probes += growth;
}

// --- Cosmic Harvesting ---

export function processCosmicHarvesting() {
    if (!state.cosmicHarvestingUnlocked || state.probes <= 0) return;
    if (state.probeHarvesting <= 0) return;
    state.cosmicFabric += state.probes * state.probeHarvesting * 0.1;
    // Le cosmic fabric booste aussi le fabric normal
    state.fabric += state.probes * state.probeHarvesting * 0.05;
}

// --- Cosmic Production (probes produce caps via speed stat) ---

export function processCosmicProduction() {
    if (!state.probesUnlocked || state.probes <= 0) return;
    if (state.probeSpeed <= 0) return;
    // Consommation de cosmicFabric : 1 cF = 100 caps
    const maxProduction = state.probes * state.probeSpeed * state.cosmicProductionMultiplier;
    const cosmicNeeded = maxProduction / 100;
    let production;
    if (state.cosmicFabric >= cosmicNeeded) {
        state.cosmicFabric -= cosmicNeeded;
        production = maxProduction;
    } else {
        // Produire proportionnellement au cosmicFabric disponible
        production = state.cosmicFabric * 100;
        state.cosmicFabric = 0;
    }
    if (production <= 0) return;
    state.caps += production;
    state.unsold += production;
    state.totalCapsProduced += production;
    checkMilestones();
    checkTrustGain();
}

// --- Universe Exploration ---

export function processExploration() {
    if (!state.probesUnlocked || state.probes <= 0) return;
    if (state.universeExplored >= 100) return;
    if (state.probeExploration <= 0) return;
    // Probes effectifs via log10 pour éviter la complétion instantanée
    const effectiveProbes = Math.log10(Math.max(1, state.probes)) * 10;
    const combatBonus = 1 + state.probeCombat * 0.1;
    const progress = effectiveProbes * state.probeExploration * state.explorationSpeed * combatBonus * 0.001;
    state.universeExplored = Math.min(100, state.universeExplored + progress);
}

// --- Combat Encounters (Drift Encounters) ---

export function processCombatEncounters() {
    if (!state.probesUnlocked || state.probes <= 1) return;
    if (state.universeExplored <= 0) return;

    // Décrémenter le timer
    state.combatEncounterTimer--;
    if (state.combatEncounterTimer > 0) return;

    // Réinitialiser le cooldown (10-30s selon exploration)
    const minCooldown = 10;
    const maxCooldown = 30;
    state.combatEncounterCooldown = Math.floor(maxCooldown - (state.universeExplored / 100) * (maxCooldown - minCooldown));
    state.combatEncounterTimer = state.combatEncounterCooldown;

    // Force du Drift proportionnelle à l'exploration
    const driftStrength = 1 + state.universeExplored * 0.5;

    // Combat power basé sur probeCombat et nombre de probes
    const combatPower = state.probeCombat * Math.log10(Math.max(1, state.probes)) * 5;

    // Taux de survie
    const survivalRate = combatPower / (driftStrength + combatPower);

    if (Math.random() < survivalRate) {
        // Victoire — récompense cosmicFabric
        state.combatVictories++;
        const reward = Math.floor(10 + state.universeExplored * 2 + state.probes * 0.01);
        state.cosmicFabric += reward;
        state.combatProbesLost = 0;
        showTerminalMessage(`Drift Encounter: Victory! +${reward} cosmic fabric`);
    } else {
        // Défaite — perte de 5-20% des probes
        state.combatDefeats++;
        const lossPercent = 0.05 + Math.random() * 0.15;
        const effectiveLoss = lossPercent * (1 - state.combatLossReduction);
        const lost = Math.floor(state.probes * effectiveLoss);
        state.probes = Math.max(1, state.probes - lost);
        state.combatProbesLost = lost;
        state.combatProbesLostTotal += lost;
        showTerminalMessage(`Drift Encounter: Defeat! Lost ${lost} probes`);
    }

    updateAllDisplays();
}

// --- Exploration Events ---

const explorationEvents = [
    { threshold: 2,   reward: { cosmicFabric: 50 },  message: "A faint signal from the void... ancient cosmic fabric drifts nearby. +50 cF" },
    { threshold: 10,  reward: { cosmicFabric: 200 }, message: "An abandoned relay station! Its fabric stores are still intact. +200 cF" },
    { threshold: 25,  reward: { probeTrust: 2 },     message: "A sentient nebula shares its knowledge. +2 Probe Trust" },
    { threshold: 50,  reward: { cosmicFabric: 1000 }, message: "The Great Loom — a cosmic structure weaving fabric from starlight. +1000 cF" },
    { threshold: 75,  reward: { explorationSpeed: 2 }, message: "A wormhole network accelerates exploration. x2 Exploration Speed" },
    { threshold: 90,  reward: { probeTrust: 3, cosmicFabric: 2000 }, message: "The Cosmic Library — knowledge of the ancients. +3 Probe Trust, +2000 cF" },
    { threshold: 100, reward: { probeTrust: 5, cosmicFabric: 5000 }, message: "The Edge of Everything. The universe reveals its final secret. +5 Probe Trust, +5000 cF" }
];

export function processExplorationEvents() {
    if (!state.probesUnlocked) return;

    for (const event of explorationEvents) {
        if (state.universeExplored >= event.threshold && !state.explorationDiscoveries.has(event.threshold)) {
            state.explorationDiscoveries.add(event.threshold);

            // Appliquer les récompenses
            if (event.reward.cosmicFabric) state.cosmicFabric += event.reward.cosmicFabric;
            if (event.reward.probeTrust) state.probeTrust += event.reward.probeTrust;
            if (event.reward.explorationSpeed) state.explorationSpeed *= event.reward.explorationSpeed;

            showTerminalMessage(event.message, 8000);
            updateAllDisplays();
        }
    }
}

// --- End Game ---

export function chooseEndGame(choice) {
    if (!state.endGameReached) return;
    if (state.endGameChoice) return; // Déjà choisi
    state.endGameChoice = choice;

    if (choice === 'unravel') {
        showTerminalMessage("You chose to Unravel. The caps dissolve into stardust...");
    } else {
        showTerminalMessage("You chose to Weave. The universe becomes caps. There is nothing else.");
    }
    showEndGameResult(choice);
}
