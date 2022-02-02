/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

// ████████ IMPORTS ████████
import {
	// ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮
	MAIN,
	// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase, // GreenSock Animation Platform
	// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	preloadTemplates,
	U,
	// ▮▮▮▮▮▮▮[XCircles]▮▮▮▮▮▮▮
	XElem,
	XCircle,
	XItem,
	XDie,
	XSnap
} from "./helpers/bundler.mjs";

gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);

// ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {

	// ▮▮▮▮▮▮▮[Configuration] Apply Configuration Settings ▮▮▮▮▮▮▮
	CONFIG.OREX = MAIN;

	// ▮▮▮▮▮▮▮[Classes] Register & Apply Class Extensions ▮▮▮▮▮▮▮
	/* 	game.OREX = {
    		OREXActor,
    		OREXItem
    	};
    	CONFIG.Actor.documentClass = OREXActor;
    	CONFIG.Item.documentClass = OREXItem;

    	Actors.unregisterSheet("core", ActorSheet);
    	Actors.registerSheet("OREX", HellboundActorSheet, {
    		makeDefault: true,
    		types: ["hellbound"],
    		label: "ba.sheet.hellboundSheet"
    	});
    	Actors.registerSheet("OREX", DemonCompanionSheet, {
    		makeDefault: false,
    		types: ["hellbound"],
    		label: "ba.sheet.demonSheet"
    	});
    	Actors.registerSheet("OREX", MajorNPCSheet, {
    		makeDefault: false,
    		types: ["majornpc"],
    		label: "ba.sheet.majorNPCSheet"
    	});
    	Actors.registerSheet("OREX", MinorNPCSheet, {
    		makeDefault: false,
    		types: ["minornpc"],
    		label: "ba.sheet.minorNPCSheet"
    	});
    	Actors.registerSheet("OREX", MobNPCSheet, {
    		makeDefault: false,
    		types: ["mobnpc"],
    		label: "ba.sheet.mobNPCSheet"
    	});

    	Items.unregisterSheet("core", ItemSheet);
    	Items.registerSheet("OREX", OREXItemSheet, {
    		makeDefault: true
    	}); */

	// ▮▮▮▮▮▮▮[Handlebar Templates] Preload Handlebars Templates ▮▮▮▮▮▮▮
	return preloadTemplates();
});
