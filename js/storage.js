/**
 * STORAGE.JS
 * Sauvegarde et Chargement — format JSON unique.
 */

import { state } from './state.js';
import { updateAllDisplays, unlockITResources, showTerminalMessage, hideITResources } from './ui.js';

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
        elapsed: (parseInt(localStorage.getItem(SAVE_KEY + '-elapsed')) || 0) + (Date.now() - state.sessionStart)
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
        // Tenter migration depuis l'ancien format
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
    state.ops = validateNumber(data.ops, 0, true);
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

    updateAllDisplays();

    if (state.itResourcesUnlocked) {
        unlockITResources(true);
    }

    if (state.hasImprovedAutoCapsers) {
        const btn = document.getElementById('btnImproveAuto');
        if(btn) btn.style.display = 'none';
    }

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
    if (state.hasImprovedAutoCapsers) {
        const btn = document.getElementById('btnImproveAuto');
        if(btn) btn.style.display = 'none';
    }
    if(state.caps > 0) {
        showTerminalMessage("Save migrated to new format.");
    }
}

export function resetGame() {
    if (!confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        return;
    }

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
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SAVE_KEY + '-elapsed');

    hideITResources();
    updateAllDisplays();

    const btnProject = document.getElementById('btnImproveAuto');
    if(btnProject) {
        btnProject.style.display = 'none';
        btnProject.disabled = false;
    }

    showTerminalMessage("Game reset! IT Systems Rebooted.", 5000);
}
