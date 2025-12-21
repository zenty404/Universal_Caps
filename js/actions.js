/**
 * ACTIONS.JS
 * Ce fichier contient toute la logique métier (Game Logic).
 * C'est ici qu'on fait les additions, les soustractions et les règles du jeu.
 */

import { state } from './state.js';
import { updateAllDisplays, showTerminalMessage, unlockITResources, updateDemandDisplay, updateMarginDisplay, updateButtons } from './ui.js';

// ==========================================
// 1. FONCTIONS PRIVÉES (Helpers internes)
// ==========================================

function checkMilestones() {
    // Vérifie si le joueur a atteint un palier (ex: 100 caps)
    for (const m of state.milestones) {
        if (state.caps >= m && !state.reached.has(m)) {
            state.reached.add(m); // On marque le palier comme atteint
            showTerminalMessage(`Milestone reached: ${m.toLocaleString()} caps!`);
        }
    }
}

function checkTrustGain() {
    // Système de confiance (Trust) basé sur le nombre total de caps produites
    if (state.caps >= state.nextTrustAt) {
        state.trust++;
        showTerminalMessage(`Trust Increased! Current Trust: ${state.trust}`);
        state.nextTrustAt += 3000; // Le prochain palier est plus loin
        updateAllDisplays();
    }
}

function updateRevenueDisplay() {
    // Petit helper pour afficher le revenu par seconde
    const el = document.getElementById('avgRev');
    if(el) el.textContent = state.revenuePerSecond.toFixed(2);
}


// ==========================================
// 2. ACTIONS JOUEUR (Clics Boutons)
// ==========================================

// --- Fabrication ---
export function makeCaps(amount) {
    state.caps += amount;
    state.unsold += amount;
    
    // Mise à jour rapide du DOM (plus performant que updateAllDisplays pour un clic fréquent)
    document.getElementById('caps').textContent = Math.floor(state.caps).toLocaleString();
    document.getElementById('unsoldClips').textContent = Math.floor(state.unsold).toLocaleString();

    checkMilestones();
    checkTrustGain();

    // Déblocage de la section IT à 100 caps
    if (state.caps >= 100) {
        unlockITResources();
    }
}

// --- Gestion des Prix ---
export function lowerPrice() {
    const marginSpan = document.getElementById('margin');
    let price = parseFloat(marginSpan.textContent);
    price = Math.max(0.01, price - 0.01); // On ne descend pas sous 0.01
    updateMarginDisplay(price);
    calculatePublicDemand(); // Recalcul immédiat de la demande
}

export function raisePrice() {
    const marginSpan = document.getElementById('margin');
    let price = parseFloat(marginSpan.textContent);
    price = Math.max(0.01, price + 0.01);
    updateMarginDisplay(price);
    calculatePublicDemand();
}

// --- Achats Business ---
export function buyAutoCapser() {
    if(state.funds >= state.priceAutoCapser){
        state.funds -= state.priceAutoCapser;
        state.autoCapsers += 1;
        state.priceAutoCapser *= 1.25; // Le prix augmente de 25% à chaque achat
        updateAllDisplays();
    }
}

export function buyAds() {
    if(state.funds >= state.adCost) {
        state.funds -= state.adCost;
        state.marketingLvl += 1;
        state.adCost *= 3; // Le marketing coûte très cher très vite
        updateAllDisplays();
    }
}

// --- Achats IT ---
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
    state.opsMax = state.ramCount * 1000; // Chaque RAM ajoute 1000 Ops de stockage
    updateAllDisplays();
}

// --- Projets (Recherche) ---
export function buyImprovedAutoClippers() {
    // Coût : 500 Ops
    if (state.ops >= 500) {
        state.ops -= 500;
        state.hasImprovedAutoClippers = true;
        state.autoCapserPerformance += 0.50; // Bonus de +50%
        
        // On cache le bouton définitivement car upgrade unique
        document.getElementById('btnImproveAuto').style.display = 'none';
        
        showTerminalMessage("AutoCapsers performance increased by 50%!");
        updateAllDisplays();
    }
}


// ==========================================
// 3. LOGIQUE AUTOMATIQUE (Boucles de jeu)
// ==========================================

export function calculatePublicDemand() {
    const price = parseFloat(document.getElementById('margin').textContent);
    
    // Formule arbitraire : plus le prix est bas, plus la demande explose
    let demand = 200 * Math.exp(-10 * price);
    
    // Le marketing multiplie la demande
    demand *= 1 + 0.05 * state.marketingLvl;
    
    // Bornes min/max pour éviter les bugs
    demand = Math.max(0, Math.min(500, demand));
    
    updateDemandDisplay(demand);
    return demand;
}

export function autoGenerateCaps() {
    if(state.autoCapsers > 0){
        // Production = (Nombre Machines) * (Performance)
        const amount = state.autoCapsers * state.autoCapserPerformance;
        makeCaps(amount);
    }
}

export function autoSell() {
    const demand = parseFloat(document.getElementById('demand').textContent);
    const price = parseFloat(document.getElementById('margin').textContent);
    
    // Reset du compteur de revenus
    state.revenuePerSecond = 0; 

    if (state.unsold <= 0 || demand <= 0) {
        updateRevenueDisplay(); 
        return;
    }
    
    // On vend un pourcentage du stock basé sur la demande
    let sold = Math.floor(state.unsold * (demand / 100));
    if (sold > state.unsold) sold = state.unsold; // On ne peut pas vendre ce qu'on a pas

    if (sold > 0) {
        state.unsold -= sold;
        const revenue = sold * price;
        state.funds += revenue;
        
        // Stockage pour affichage
        state.revenuePerSecond = revenue;

        // Mise à jour UI
        document.getElementById('unsoldClips').textContent = state.unsold;
        document.getElementById('funds').textContent = state.funds.toFixed(2);
        updateButtons(); 
    }
    
    updateRevenueDisplay();
}

export function processOps() {
    // Génération automatique des Ops par les processeurs
    if (state.ops < state.opsMax) {
        state.ops += state.cpuCount;
        // On ne dépasse pas le max
        if (state.ops > state.opsMax) state.ops = state.opsMax;
        
        document.getElementById("ops").textContent = state.ops;
    }
}

export function checkProjects() {
    // Vérifie en permanence si le projet "Improved AutoCapsers" doit apparaître
    // Condition : Pas encore acheté ET Caps totaux >= 10 000
    if (!state.hasImprovedAutoClippers && state.caps >= 10000) {
        
        const btn = document.getElementById('btnImproveAuto');
        
        // On affiche le bouton s'il est caché
        if (btn.style.display === 'none') {
            btn.style.display = 'block';
            showTerminalMessage("New Project available: Improved AutoCapsers");
        }
        
        // On active/désactive le bouton selon qu'on a assez d'Ops
        btn.disabled = state.ops < 500;
    }
}