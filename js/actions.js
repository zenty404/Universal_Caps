/**
 * ACTIONS.JS
 * Logique métier.
 */

import { state } from './state.js';
import { updateAllDisplays, showTerminalMessage, unlockITResources, updateDemandDisplay, updateMarginDisplay, updateRevenueDisplay } from './ui.js';

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
        // Incréments progressifs au lieu de +3000 fixe
        state.nextTrustAt = Math.floor(state.nextTrustAt * 1.8);
        updateAllDisplays();
    }
}


// ==========================================
// 2. ACTIONS JOUEUR
// ==========================================

export function makeCaps(amount) {
    state.caps += amount;
    state.unsold += amount;

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

// --- Projets (Recherche) ---

export function buyImprovedAutoCapsers() {
    if (state.ops >= 500) {
        state.ops -= 500;
        state.hasImprovedAutoCapsers = true;
        state.autoCapserPerformance += 0.50;

        const btn = document.getElementById('btnImproveAuto');
        if (btn) btn.style.display = 'none';

        showTerminalMessage("AutoCapsers performance increased by 50%!");
        updateAllDisplays();
    }
}


// ==========================================
// 3. LOGIQUE AUTOMATIQUE
// ==========================================

export function calculatePublicDemand() {
    const price = state.margin;
    // Courbe plus douce : 100 * 0.98^(price*100)
    let demand = 100 * Math.pow(0.98, price * 100);
    demand *= 1 + 0.05 * state.marketingLvl;
    demand = Math.max(0, Math.min(500, demand));

    updateDemandDisplay(demand);
    return demand;
}

export function autoGenerateCaps() {
    if(state.autoCapsers > 0){
        const amount = state.autoCapsers * state.autoCapserPerformance;
        makeCaps(amount);
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

        state.revenuePerSecond = revenue;
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

export function checkProjects() {
    if (!state.hasImprovedAutoCapsers && state.caps >= 10000) {
        const btn = document.getElementById('btnImproveAuto');
        if (!btn) return;

        if (btn.style.display === 'none') {
            btn.style.display = 'block';
            showTerminalMessage("New Project available: Improved AutoCapsers");
        }

        btn.disabled = state.ops < 500;
    }
}
