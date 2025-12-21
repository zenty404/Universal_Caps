/**
 * UI.JS
 * Ce fichier gère uniquement l'affichage (le DOM).
 */

import { state } from './state.js';

// --- Fonctions Utilitaires ---
const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
};

// --- Gestion des Messages ---
export function showTerminalMessage(text, duration = 5000) {
    const el = document.getElementById('terminalMessage');
    if (!el) return;

    el.textContent = text;
    el.classList.add('visible');
    
    clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => {
        el.classList.remove('visible');
    }, duration);
}

// --- Gestion de la visibilité des sections ---
export function unlockITResources(loading = false) {
    const divIT = document.getElementById('itResourcesDiv');
    const divProjects = document.getElementById('projectsDiv');

    if (state.itResourcesUnlocked && divIT.style.display !== 'none' && !loading) return;

    if (!state.itResourcesUnlocked || divIT.style.display === 'none') {
        divIT.style.display = 'flex';
        state.itResourcesUnlocked = true;

        if (divProjects) divProjects.style.display = 'flex';

        if (!loading) {
            showTerminalMessage("IT Resources unlocked! (Initial Hardware: 1 CPU, 1 RAM)");
        }
        updateAllDisplays();
    }
}

export function hideITResources() {
    const divIT = document.getElementById('itResourcesDiv');
    const divProjects = document.getElementById('projectsDiv');
    
    if(divIT) divIT.style.display = 'none';
    if(divProjects) divProjects.style.display = 'none';
}

// --- Mise à jour de l'Interface ---
export function updateAllDisplays() {
    // 1. Économie
    setText('caps', Math.floor(state.caps).toLocaleString());
    
    // CORRECTION ICI : unsoldCaps
    setText('unsoldCaps', Math.floor(state.unsold).toLocaleString());
    
    setText('funds', state.funds.toFixed(2));
    setText('avgRev', state.revenuePerSecond.toFixed(2));
    
    // 2. Business & Marketing
    setText('priceAutoCapser', state.priceAutoCapser.toFixed(2));
    setText('marketingLvl', state.marketingLvl);
    setText('adCost', state.adCost.toFixed(2));

    // 3. IT Resources
    setText('trust', state.trust);
    setText('nextTrust', state.nextTrustAt.toLocaleString());
    setText('ops', state.ops);
    setText('cpuCount', state.cpuCount);
    setText('ramCount', state.ramCount);
    setText('opsMax', state.opsMax);

    updateButtons();
}

export function updateButtons() {
    const btnAuto = document.getElementById('BuyAutoCapser');
    if(btnAuto) {
        btnAuto.disabled = state.funds < state.priceAutoCapser;
        btnAuto.textContent = `Buy AutoCapser ($${state.priceAutoCapser.toFixed(2)})`;
    }

    const btnMark = document.getElementById('btnExpandMarketing');
    if(btnMark) btnMark.disabled = state.funds < state.adCost;

    const btnCpu = document.getElementById('btnBuyCPU');
    if(btnCpu) btnCpu.disabled = state.trust < 1;

    const btnRam = document.getElementById('btnBuyRAM');
    if(btnRam) btnRam.disabled = state.trust < 1;
}

export function updateDemandDisplay(value) {
    setText('demand', value.toFixed(0));
}

export function updateMarginDisplay(value) {
    setText('margin', value.toFixed(2));
}