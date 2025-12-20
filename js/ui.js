import { state } from './state.js';

// Petit helper pour vérifier si un élément existe avant de toucher
const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
};

export function showTerminalMessage(text, duration = 5000) {
    const el = document.getElementById('terminalMessage');
    if (!el) return;
    el.textContent = text;
    el.classList.add('visible');
    
    // On attache le timeout à l'élément pour pouvoir le clear si un nouveau message arrive vite
    clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => {
        el.classList.remove('visible');
    }, duration);
}

export function unlockITResources(loading = false) {
    const div = document.getElementById('itResourcesDiv');
    
    // Si déjà visible, on ne fait rien
    if (state.itResourcesUnlocked && div.style.display !== 'none' && !loading) return;

    if (!state.itResourcesUnlocked || div.style.display === 'none') {
        div.style.display = 'flex';
        state.itResourcesUnlocked = true;

        if (!loading) {
            showTerminalMessage("IT Resources unlocked! (Initial Hardware: 1 CPU, 1 RAM)");
        }
        updateAllDisplays();
    }
}

export function hideITResources() {
    const div = document.getElementById('itResourcesDiv');
    if(div) div.style.display = 'none';
}

export function updateAllDisplays() {
    setText('caps', state.caps);
    setText('unsoldClips', state.unsold);
    setText('funds', state.funds.toFixed(2));
    setText('priceAutoCapser', state.priceAutoCapser.toFixed(2));
    setText('marketingLvl', state.marketingLvl);
    setText('adCost', state.adCost.toFixed(2));

    // IT Display
    setText('trust', state.trust);
    setText('nextTrust', state.nextTrustAt.toLocaleString());
    setText('ops', state.ops);
    setText('cpuCount', state.cpuCount);
    setText('ramCount', state.ramCount);
    setText('opsMax', state.opsMax);

    // Calcul dynamique de la demande pour l'affichage
    // Note: La logique de calcul est dans actions.js normalement, 
    // mais pour l'affichage simple on peut lire le DOM ou recalculer.
    // Ici on laisse la boucle principale mettre à jour la demande via publicDemand()
    
    updateButtons();
}

export function updateButtons() {
    // AutoCapser
    const btnAuto = document.getElementById('BuyAutoCapser');
    if(btnAuto) {
        btnAuto.disabled = state.funds < state.priceAutoCapser;
        btnAuto.textContent = `Buy AutoCapser ($${state.priceAutoCapser.toFixed(2)})`;
    }

    // Marketing
    const btnMark = document.getElementById('btnExpandMarketing');
    if(btnMark) btnMark.disabled = state.funds < state.adCost;

    // IT Buttons
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