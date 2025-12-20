export const state = {
    caps: 0,
    unsold: 0,
    funds: 0,
    revenuePerSecond: 0,
    
    // AutoCapser
    autoCapsers: 0,
    priceAutoCapser: 15,
    
    // Marketing
    marketingLvl: 1,
    adCost: 100,

    // IT Resources
    trust: 0,
    nextTrustAt: 1000,
    ops: 0,
    cpuCount: 1,
    ramCount: 1,
    opsMax: 1000,
    itResourcesUnlocked: false,

    // Suivi du temps et milestones
    sessionStart: Date.now(),
    milestones: [100, 1000, 10000, 100000, 1000000, 10000000, 100000000],
    reached: new Set()
};