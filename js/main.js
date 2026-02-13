/**
 * MAIN.JS
 * Point d'entrée.
 */

import { loadGame, saveGame, resetGame } from './storage.js';
import * as Actions from './actions.js';
import { updateButtons, updateAllDisplays, updateStatsPanel, unlockITResources, unlockFabric, unlockMegaCapsers, unlockRevenueTracker, unlockInvestment, unlockStrategy, unlockEnergy, unlockBatteries, unlockFactories, unlockDrones, unlockInfluence, unlockProbes, unlockCosmic, unlockEndGame, showTerminalMessage } from './ui.js';
import { state } from './state.js';

document.addEventListener('DOMContentLoaded', () => {

    loadGame();

    // Recalculer la demande immédiatement après le chargement
    Actions.calculatePublicDemand();

    // --- ÉVÉNEMENTS (CLICS) ---

    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('MakeCaps').addEventListener('click', () => Actions.makeCaps(1));
    document.getElementById('btnLowerPrice').addEventListener('click', Actions.lowerPrice);
    document.getElementById('btnRaisePrice').addEventListener('click', Actions.raisePrice);
    document.getElementById('BuyAutoCapser').addEventListener('click', Actions.buyAutoCapser);
    document.getElementById('btnExpandMarketing').addEventListener('click', Actions.buyAds);
    document.getElementById('btnBuyCPU').addEventListener('click', Actions.buyCPU);
    document.getElementById('btnBuyRAM').addEventListener('click', Actions.buyRAM);

    // Fabric
    document.getElementById('btnBuyFabric').addEventListener('click', Actions.buyFabric);

    // MegaCapsers
    document.getElementById('btnBuyMegaCapser').addEventListener('click', Actions.buyMegaCapser);

    // Investment
    document.getElementById('btnInvest100').addEventListener('click', () => Actions.investFunds(100));
    document.getElementById('btnInvest1000').addEventListener('click', () => Actions.investFunds(1000));
    document.getElementById('btnWithdraw').addEventListener('click', Actions.withdrawFunds);

    // Strategy Game
    document.getElementById('btnStratAggressive').addEventListener('click', () => Actions.playStrategy('aggressive'));
    document.getElementById('btnStratBalanced').addEventListener('click', () => Actions.playStrategy('balanced'));
    document.getElementById('btnStratDefensive').addEventListener('click', () => Actions.playStrategy('defensive'));

    // Phase 2 — Energy, Factories, Drones
    document.getElementById('btnBuySolarPanel').addEventListener('click', Actions.buySolarPanel);
    document.getElementById('btnBuyBattery').addEventListener('click', Actions.buyBattery);
    document.getElementById('btnBuyFactory').addEventListener('click', Actions.buyFactory);
    document.getElementById('btnBuyDrone').addEventListener('click', Actions.buyDrone);

    // Phase 3 — Probe Trust Allocation (Shift=+5, Ctrl=+10)
    function probeDelta(e, sign) {
        let amount = 1;
        if (e.ctrlKey) amount = 10;
        else if (e.shiftKey) amount = 5;
        return sign * amount;
    }
    document.getElementById('probeSpeedPlus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeSpeed', probeDelta(e, 1)));
    document.getElementById('probeSpeedMinus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeSpeed', probeDelta(e, -1)));
    document.getElementById('probeReplicationPlus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeSelfReplication', probeDelta(e, 1)));
    document.getElementById('probeReplicationMinus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeSelfReplication', probeDelta(e, -1)));
    document.getElementById('probeHarvestingPlus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeHarvesting', probeDelta(e, 1)));
    document.getElementById('probeHarvestingMinus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeHarvesting', probeDelta(e, -1)));
    document.getElementById('probeCombatPlus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeCombat', probeDelta(e, 1)));
    document.getElementById('probeCombatMinus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeCombat', probeDelta(e, -1)));
    document.getElementById('probeExplorationPlus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeExploration', probeDelta(e, 1)));
    document.getElementById('probeExplorationMinus').addEventListener('click', (e) => Actions.allocateProbeTrust('probeExploration', probeDelta(e, -1)));

    // Phase 3 — End Game
    document.getElementById('btnUnravel').addEventListener('click', () => Actions.chooseEndGame('unravel'));
    document.getElementById('btnWeave').addEventListener('click', () => Actions.chooseEndGame('weave'));

    // --- BOUCLES DE JEU ---

    let mainLoopId, fastLoopId, saveLoopId;

    function startLoops() {
        // Boucle principale (1s) : production, vente, ops, creativity, investment, projets, Phase 2
        mainLoopId = setInterval(() => {
            Actions.autoSupply();
            Actions.autoGenerateCaps();
            Actions.autoSell();
            Actions.processOps();
            Actions.generateCreativity();
            Actions.processInvestment();
            Actions.checkProjects();

            // Phase 2
            Actions.processEnergy();
            Actions.processDrones();
            Actions.processFactories();
            Actions.processInfluence();

            // Phase 3
            Actions.processProbes();
            Actions.processCosmicHarvesting();
            Actions.processCosmicProduction();
            Actions.processExploration();
            Actions.processCombatEncounters();
            Actions.processExplorationEvents();

            updateAllDisplays();
            if (statsPanel.style.display !== 'none') updateStatsPanel();
        }, 1000);

        // Boucle rapide (200ms) : demande + mise à jour boutons
        fastLoopId = setInterval(() => {
            Actions.calculatePublicDemand();
            updateButtons();
        }, 200);

        // Sauvegarde (5s)
        saveLoopId = setInterval(saveGame, 5000);
    }

    function stopLoops() {
        clearInterval(mainLoopId);
        clearInterval(fastLoopId);
        clearInterval(saveLoopId);
    }

    startLoops();

    // Pause quand l'onglet est caché, reprend quand visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveGame();
            stopLoops();
        } else {
            startLoops();
        }
    });

    // --- STATISTICS PANEL ---
    const statsPanel = document.getElementById('statsPanel');
    document.getElementById('btnStats').addEventListener('click', () => {
        const visible = statsPanel.style.display !== 'none';
        statsPanel.style.display = visible ? 'none' : 'block';
        if (!visible) updateStatsPanel();
    });
    document.getElementById('statsClose').addEventListener('click', () => {
        statsPanel.style.display = 'none';
    });

    // --- CHEAT MENU (Ctrl+Shift+C) ---
    const cheatMenu = document.getElementById('cheatMenu');

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            cheatMenu.style.display = cheatMenu.style.display === 'none' ? 'block' : 'none';
        }
    });

    document.getElementById('cheatClose').addEventListener('click', () => {
        cheatMenu.style.display = 'none';
    });

    // Resources — bypass fabric/cost, injection directe
    function cheatAddCaps(amount) {
        state.caps += amount;
        state.unsold += amount;
        if (state.caps >= 100) unlockITResources();
        updateAllDisplays();
        showTerminalMessage(`CHEAT: +${amount.toLocaleString()} caps`);
    }
    document.getElementById('cheatCaps1k').addEventListener('click', () => cheatAddCaps(1000));
    document.getElementById('cheatCaps100k').addEventListener('click', () => cheatAddCaps(100000));
    document.getElementById('cheatCaps10m').addEventListener('click', () => cheatAddCaps(10000000));
    document.getElementById('cheatFunds1k').addEventListener('click', () => {
        state.funds += 1000;
        updateAllDisplays();
    });
    document.getElementById('cheatFunds100k').addEventListener('click', () => {
        state.funds += 100000;
        updateAllDisplays();
    });
    document.getElementById('cheatFabric5k').addEventListener('click', () => {
        state.fabric += 5000;
        state.fabricUnlocked = true;
        unlockFabric();
        updateAllDisplays();
    });

    // IT
    document.getElementById('cheatOpsMax').addEventListener('click', () => {
        state.ops = state.opsMax;
        updateAllDisplays();
    });
    document.getElementById('cheatCreativityMax').addEventListener('click', () => {
        state.creativity = state.creativityMax;
        updateAllDisplays();
    });
    document.getElementById('cheatTrust10').addEventListener('click', () => {
        state.trust += 10;
        updateAllDisplays();
    });
    document.getElementById('cheatYomi100').addEventListener('click', () => {
        state.yomi += 100;
        updateAllDisplays();
    });

    // Units
    document.getElementById('cheatAuto10').addEventListener('click', () => {
        state.autoCapsers += 10;
        updateAllDisplays();
    });
    document.getElementById('cheatMega5').addEventListener('click', () => {
        state.megaCapsers += 5;
        state.megaCapsersUnlocked = true;
        unlockMegaCapsers();
        updateAllDisplays();
    });

    // Unlock All Phase 1
    document.getElementById('cheatUnlockAll').addEventListener('click', () => {
        state.itResourcesUnlocked = true;
        state.fabricUnlocked = true;
        state.megaCapsersUnlocked = true;
        state.revenueTrackerUnlocked = true;
        state.investmentUnlocked = true;
        state.strategyUnlocked = true;
        state.fabric += 1000;
        unlockITResources(true);
        unlockFabric();
        unlockMegaCapsers();
        unlockRevenueTracker();
        unlockInvestment();
        unlockStrategy();
        updateAllDisplays();
        showTerminalMessage("CHEAT: All Phase 1 sections unlocked!");
    });

    // --- Phase 2 Cheats ---
    document.getElementById('cheatUnlockAllP2').addEventListener('click', () => {
        state.phase = 2;
        state.solarUnlocked = true;
        state.batteriesUnlocked = true;
        state.factoriesUnlocked = true;
        state.dronesUnlocked = true;
        state.influenceUnlocked = true;
        state.solarPanels = Math.max(state.solarPanels, 5);
        state.energy = state.energyMax;
        state.factories = Math.max(state.factories, 1);
        state.drones = Math.max(state.drones, 1);
        unlockEnergy();
        unlockBatteries();
        unlockFactories();
        unlockDrones();
        unlockInfluence();
        updateAllDisplays();
        showTerminalMessage("CHEAT: All Phase 2 sections unlocked!");
    });

    document.getElementById('cheatEnergy1k').addEventListener('click', () => {
        state.energy = Math.min(state.energy + 1000, state.energyMax);
        updateAllDisplays();
        showTerminalMessage("CHEAT: +1000 energy");
    });

    document.getElementById('cheatInfluence100').addEventListener('click', () => {
        state.influence += 100;
        updateAllDisplays();
        showTerminalMessage("CHEAT: +100 influence");
    });

    document.getElementById('cheatCaps1b').addEventListener('click', () => {
        cheatAddCaps(1000000000);
    });

    // --- Phase 3 Cheats ---
    document.getElementById('cheatUnlockAllP3').addEventListener('click', () => {
        state.phase = 3;
        state.probesUnlocked = true;
        state.selfReplicatingProbes = true;
        state.cosmicHarvestingUnlocked = true;
        state.probes = Math.max(state.probes, 100);
        state.probeTrust = Math.max(state.probeTrust, 20);
        unlockProbes();
        unlockCosmic();
        updateAllDisplays();
        showTerminalMessage("CHEAT: All Phase 3 sections unlocked!");
    });

    document.getElementById('cheatProbes1k').addEventListener('click', () => {
        state.probes += 1000;
        updateAllDisplays();
        showTerminalMessage("CHEAT: +1000 probes");
    });

    document.getElementById('cheatProbeTrust10').addEventListener('click', () => {
        state.probeTrust += 10;
        updateAllDisplays();
        showTerminalMessage("CHEAT: +10 probe trust");
    });

    document.getElementById('cheatExplore25').addEventListener('click', () => {
        state.universeExplored = Math.min(100, state.universeExplored + 25);
        updateAllDisplays();
        showTerminalMessage(`CHEAT: Universe explored → ${state.universeExplored.toFixed(1)}%`);
    });

    document.getElementById('cheatCosmicFabric1k').addEventListener('click', () => {
        state.cosmicFabric += 1000;
        updateAllDisplays();
        showTerminalMessage("CHEAT: +1000 cosmic fabric");
    });

});
