import {XOrbitType} from "./bundler.js";

const C = {
	xGroupOrbitalDefaults: {
		Main: {radiusRatio: 0.75, rotationRate: 1}
	},
	xDieStyles: {
		BasicDie: {
			color: "white"
		}
	},
	isDebugging: true,
	minFuzzyMatchScore: 0.8 // Determines strictness of FuzzyMatcher
};

export default C;