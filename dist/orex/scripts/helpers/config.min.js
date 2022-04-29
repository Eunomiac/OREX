export default {
    xGroupOrbitalDefaults: {
        Core: { name: "Core", radiusRatio: 0, rotationScaling: 0 },
        Main: { name: "Main", radiusRatio: 0.6, rotationScaling: 0.5 },
        Inner: { name: "Inner", radiusRatio: 0.25, rotationScaling: 1 },
        Outer: { name: "Outer", radiusRatio: 1.25, rotationScaling: 0.35 }
    },
    xDieStyles: {
        BasicDie: {
            color: "white"
        }
    },
    xRollStyles: {
        defaults: {
            color: "cyan",
            size: 200,
            position: { x: 500, y: 500 }
        }
    },
    isDebugging: true,
    minFuzzyMatchScore: 0.8,
    colors: {
        red: "",
        cyan: "",
        yellow: "",
        gold: "",
        orange: "",
        green: "",
        lime: "",
        magenta: "",
        blue: "",
        purple: ""
    }
};