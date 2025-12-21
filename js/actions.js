/**
 * ACTIONS.JS
 * Logique métier.
 */

import { state } from './state.js';
import { updateAllDisplays, showTerminalMessage, unlockITResources, updateDemandDisplay, updateMarginDisplay, updateButtons } from './ui.js';

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
        state.nextTrustAt += 3000;
        updateAllDisplays();
    }
}

function updateRevenueDisplay() {
    const el = document.getElementById('avgRev');
    if(el) el.textContent = state.revenuePerSecond.toFixed(2);
}


// ==========================================
// 2. ACTIONS JOUEUR
// ==========================================

export function makeCaps(amount) {
    state.caps += amount;
    state.unsold += amount;
    
    document.getElementById('caps').textContent = Math.floor(state.caps).toLocaleString();
    
    // CORRECTION ICI : unsoldCaps
    document.getElementById('unsoldCaps').textContent = Math.floor(state.unsold).toLocaleString();

    checkMilestones();
    checkTrustGain();

    if (state.caps >= 100) {
        unlockITResources();
    }
}

export function lowerPrice() {
    const marginSpan = document.getElementById('margin');
    let price = parseFloat(marginSpan.textContent);
    price = Math.max(0.01, price - 0.01);
    updateMarginDisplay(price);
    calculatePublicDemand();
}

export function raisePrice() {
    const marginSpan = document.getElementById('margin');
    let price = parseFloat(marginSpan.textContent);
    price = Math.max(0.01, price + 0.01);
    updateMarginDisplay(price);
    calculatePublicDemand();
}

export function buyAutoCapser() {
    if(state.funds >= state.priceAutoCapser){
        state.funds -= state.priceAutoCapser;
        state.autoCapsers += 1;
        state.priceAutoCapser *= 1.25; 
        updateAllDisplays();
    }
}

export function buyAds() {
    if(state.funds >= state.adCost) {
        state.funds -= state.adCost;
        state.marketingLvl += 1;
        state.adCost *= 3;
        updateAllDisplays();
    }
}

export function buyCPU() {
    if (state.trust < 1) return;
    state.trust--;
    state.cpuCount++;
    updateAllDisplays();
}

export function buyRAM() {
    if (state.trust < 1) return;
    state.trust--;
    state.ramCount++;
    state.opsMax = state.ramCount * 1000;
    updateAllDisplays();
}

// --- Projets (Recherche) ---

// CORRECTION ICI : Nom de fonction et variable
export function buyImprovedAutoCapsers() {
    if (state.ops >= 500) {
        state.ops -= 500;
        state.hasImprovedAutoCapsers = true; // Variable renommée
        state.autoCapserPerformance += 0.50; 
        
        document.getElementById('btnImproveAuto').style.display = 'none';
        
        showTerminalMessage("AutoCapsers performance increased by 50%!");
        updateAllDisplays();
    }
}


// ==========================================
// 3. LOGIQUE AUTOMATIQUE
// ==========================================

export function calculatePublicDemand() {
    const price = parseFloat(document.getElementById('margin').textContent);
    let demand = 200 * Math.exp(-10 * price);
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
    const demand = parseFloat(document.getElementById('demand').textContent);
    const price = parseFloat(document.getElementById('margin').textContent);
    
    state.revenuePerSecond = 0; 

    if (state.unsold <= 0 || demand <= 0) {
        updateRevenueDisplay(); 
        return;
    }
    
    let sold = Math.floor(state.unsold * (demand / 100));
    if (sold > state.unsold) sold = state.unsold; 

    if (sold > 0) {
        state.unsold -= sold;
        const revenue = sold * price;
        state.funds += revenue;
        
        state.revenuePerSecond = revenue;

        // CORRECTION ICI : unsoldCaps
        document.getElementById('unsoldCaps').textContent = Math.floor(state.unsold).toLocaleString();
        
        document.getElementById('funds').textContent = state.funds.toFixed(2);
        updateButtons(); 
    }
    
    updateRevenueDisplay();
}

export function processOps() {
    if (state.ops < state.opsMax) {
        state.ops += state.cpuCount;
        if (state.ops > state.opsMax) state.ops = state.opsMax;
        document.getElementById("ops").textContent = state.ops;
    }
}

export function checkProjects() {
    // CORRECTION ICI : Variable renommée
    if (!state.hasImprovedAutoCapsers && state.caps >= 10000) {
        
        const btn = document.getElementById('btnImproveAuto');
        
        if (btn.style.display === 'none') {
            btn.style.display = 'block';
            showTerminalMessage("New Project available: Improved AutoCapsers");
        }
        
        btn.disabled = state.ops < 500;
    }
}