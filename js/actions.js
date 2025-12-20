import { state } from './state.js';
import { updateAllDisplays, showTerminalMessage, unlockITResources, updateDemandDisplay, updateMarginDisplay, updateButtons } from './ui.js';

// --- Private Helpers ---
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

// --- Public Actions (appelées par main.js) ---

export function makeCaps(amount) {
    state.caps += amount;
    state.unsold += amount;
    
    // UI Updates partiels pour performance (ou via updateAllDisplays)
    document.getElementById('caps').textContent = state.caps;
    document.getElementById('unsoldClips').textContent = state.unsold;

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
    calculatePublicDemand(); // Recalcul immédiat
}

export function raisePrice() {
    const marginSpan = document.getElementById('margin');
    let price = parseFloat(marginSpan.textContent);
    price = Math.max(0.01, price + 0.01);
    updateMarginDisplay(price);
    calculatePublicDemand(); // Recalcul immédiat
}

export function calculatePublicDemand() {
    const price = parseFloat(document.getElementById('margin').textContent);
    let demand = 200 * Math.exp(-10 * price);
    demand *= 1 + 0.05 * state.marketingLvl;
    demand = Math.max(0, Math.min(500, demand));
    
    updateDemandDisplay(demand);
    return demand;
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

// --- Fonctions automatiques (Loop) ---

export function autoGenerateCaps() {
    if(state.autoCapsers > 0){
        makeCaps(state.autoCapsers);
    }
}

export function autoSell() {
    const demand = parseFloat(document.getElementById('demand').textContent);
    const price = parseFloat(document.getElementById('margin').textContent);
    
    // Par défaut, le revenu est 0 si on ne vend rien
    state.revenuePerSecond = 0; 

    if (state.unsold <= 0 || demand <= 0) {
        // Important : on met à jour l'affichage même si c'est 0
        updateRevenueDisplay(); 
        return;
    }
    
    let sold = Math.floor(state.unsold * (demand / 100));
    if (sold > state.unsold) sold = state.unsold; 

    if (sold > 0) {
        state.unsold -= sold;
        
        // Calcul du gain
        const revenue = sold * price;
        state.funds += revenue;
        
        // On enregistre ce gain comme étant notre "Revenu par seconde"
        state.revenuePerSecond = revenue;

        // Update UI
        document.getElementById('unsoldClips').textContent = state.unsold;
        document.getElementById('funds').textContent = state.funds.toFixed(2);
        updateButtons(); 
    }
    
    // On met à jour l'affichage du revenu
    updateRevenueDisplay();
}

// Ajoute cette petite fonction utilitaire à la fin du fichier ou juste après autoSell
function updateRevenueDisplay() {
    const el = document.getElementById('avgRev');
    if(el) el.textContent = state.revenuePerSecond.toFixed(2);
}

export function processOps() {
    if (state.ops < state.opsMax) {
        state.ops += state.cpuCount;
        if (state.ops > state.opsMax) state.ops = state.opsMax;
        document.getElementById("ops").textContent = state.ops;
    }
}