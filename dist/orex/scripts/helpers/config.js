
export default {
    xGroupOrbitalDefaults: {
        Core: { radiusRatio: 0, rotationScaling: 0 },
        Main: { radiusRatio: 0.75, rotationScaling: 1 },
        Inner: { radiusRatio: 0.45, rotationScaling: 4 },
        Outer: { radiusRatio: 1.25, rotationScaling: 0.5 }
    },
    xDieStyles: {
        BasicDie: {
            color: "white"
        }
    },
    isDebugging: true,
    minFuzzyMatchScore: 0.8 // Determines strictness of FuzzyMatcher
};