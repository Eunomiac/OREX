export default {
	xGroupOrbitalDefaults: {
		Core: {name: XOrbitType.Core, radiusRatio: 0, rotationScaling: 0},
		Main: {name: XOrbitType.Main, radiusRatio: 0.75, rotationScaling: 1},
		Inner: {name: XOrbitType.Inner, radiusRatio: 0.45, rotationScaling: 4},
		Outer: {name: XOrbitType.Outer, radiusRatio: 1.25, rotationScaling: 0.5}
	},
	xDieStyles: {
		BasicDie: {
			color: "white"
		}
	},
	isDebugging: true,
	minFuzzyMatchScore: 0.8, // Determines strictness of FuzzyMatcher
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