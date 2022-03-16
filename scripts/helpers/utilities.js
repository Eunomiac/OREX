<<<<<<< Updated upstream
import gsap from "/scripts/greensock/esm/all.js";
import { DB } from "./bundler.js";
// #region ▮▮▮▮▮▮▮[IMPORT CONFIG] Initialization Function for Imports ▮▮▮▮▮▮▮ ~
const _hyph = (str) => str; /* Hyphenopoly.config(
  {
    require: ["en-us"],
    // loader: "fs", // Whether to load using node's fs or https (default: fs)
    sync: true, // Whether hyphenator should work synchronously (default: false)
    paths: {},
    setup: {
      defaultLanguage: "en-us",
      // "compound": "hyphen", // hyphenate hyphenated words (e.g. 'computer-aided') at the hyphen only (default: hyphen)
      // "hyphen": String.fromCharCode(173), // = default: &shy; | \u00AD
      leftmin: 2, // minimum size of beginning component of hyphenated word (default: 0)
      rightmin: 2, // minimum size of ending component of hyphenated word (default: 0)
      minWordLength: 4, // minimum length of a word for it to be hyphenated (default: 6)
      // "mixedCase": true, // allow hyphenating mixed-case words (default: true)
      orphanControl: 3, // don't hyphenate last word AND keep it on the same line as the previous word (default: 1)
      hide: "text", // hide text (by setting it transparent) before hyphenator has finished (default: "all")
      // "timeout": 1000, // failure timeout in ms for hyphenation before text is unhidden (default: 1000)
      dontHyphenateClass: "no-hyphen", // elements with this class will not have their content hyphenated
      dontHyphenate: Object.fromEntries("video|audio|script|code|pre|img|br|samp|kbd|var|abbr|acronym|sub|sup|button|option|label|textarea|input|math|svg|style"
        .split(/\|/)
        .map((item) => [item, ![
          "textarea" // Add elements from above that SHOULD be hyphenated.
        ].includes(item)])),
      keepAlive: true, // whether to keep hyphenator loaded after initialization (default: false)
      // "normalize": false, // whether to resolve compound characters into precomposed characters (default: false)
      // "processShadows": false, // whether to search outside window.document for elements to hyphenate (default: false)
      // "safeCopy": true, // whether to remove soft hyphens when text is copied to clipboard (default: true)
      substitute: { // mapping out-of-language characters to in-language characters for hyphenating
        "en-us": {
          ...Object.fromEntries("àáâãäå".forEach((char) => [char, "a"])),
          ...Object.fromEntries("èéêë".forEach((char) => [char, "e"])),
          ...Object.fromEntries("ìíîï".forEach((char) => [char, "i"])),
          ...Object.fromEntries("òóôõö".forEach((char) => [char, "o"])),
          ...Object.fromEntries("ùúûü".forEach((char) => [char, "u"])),
          æ: "a",
          ç: "s",
          ñ: "n"
        }
      }
    }
  }
).get("en-us"); */
// #endregion ▮▮▮▮[IMPORT CONFIG]▮▮▮▮
=======
// #region ████████ IMPORTS ████████ ~
import { gsap } from "/scripts/greensock/esm/all.js";
>>>>>>> Stashed changes
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
// #region ▮▮▮▮▮▮▮[HELPERS] Internal Functions, Data & References Used by Utility Functions ▮▮▮▮▮▮▮ ~
/* eslint-disable array-element-newline */
const _noCapWords = [
    "above", "after", "at", "below", "by", "down", "for", "from", "in", "onto", "of", "off", "on", "out",
    "to", "under", "up", "with", "for", "and", "nor", "but", "or", "yet", "so", "the", "an", "a"
].map((word) => new RegExp(`\\b${word}\\b`, "gui"));
const _capWords = [
    "I", /[^a-z]{3,}|[\.0-9]/gu
].map((word) => (/RegExp/.test(Object.prototype.toString.call(word)) ? word : new RegExp(`\\b${word}\\b`, "gui")));
const _loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultricies
nibh sed massa euismod lacinia. Aliquam nec est ac nunc ultricies scelerisque porta vulputate odio.
Integer gravida mattis odio, semper volutpat tellus. Ut elit leo, auctor eget fermentum hendrerit,
aliquet ac nunc. Suspendisse porta turpis vitae mi posuere molestie. Cras lectus lacus, vulputate a
vestibulum in, mattis vel mi. Mauris quis semper mauris. Praesent blandit nec diam eget tincidunt. Nunc
aliquet consequat massa ac lacinia. Ut posuere velit sagittis, vehicula nisl eget, fringilla nibh. Duis
volutpat mattis libero, a porttitor sapien viverra ut. Phasellus vulputate imperdiet ligula, eget
eleifend metus tempor nec. Nam eget sapien risus. Praesent id suscipit elit. Sed pellentesque ligula
diam, non aliquet magna feugiat vitae. Pellentesque ut tortor id erat placerat dignissim. Pellentesque
ut dui vel leo laoreet sodales nec ac tellus. In hac habitasse platea dictumst. Proin sed ex sed augue
sollicitudin interdum. Sed id lacus porttitor nisi vestibulum tincidunt. Nulla facilisi. Vestibulum
feugiat finibus magna in pretium. Proin consectetur lectus nisi, non commodo lectus tempor et. Cras
viverra, mi in consequat aliquet, justo mauris fringilla tellus, at accumsan magna metus in eros. Sed
vehicula, diam ut sagittis semper, purus massa mattis dolor, in posuere.`;
const _randomWords = [
    "aboveboard", "account", "achiever", "acoustics", "act", "action", "activity", "actor", "addition", "adjustment",
    "advertisement", "advice", "afterglow", "afterimage", "afterlife", "aftermath", "afternoon", "afterthought",
    "agreement", "air", "aircraft", "airfield", "airlift", "airline", "airmen", "airplane", "airport", "airtime", "alarm",
    "allover", "allspice", "alongside", "also", "amount", "amusement", "anger", "angle", "animal", "another", "ants",
    "anyhow", "anymore", "anyone", "anyplace", "anytime", "anywhere", "apparatus", "apparel", "appliance", "approval",
    "arch", "argument", "arithmetic", "arm", "army", "around", "art", "ashtray", "attack", "attraction", "aunt",
    "authority", "babies", "baby", "babysitter", "back", "backache", "backbone", "backbreaker", "backdrop", "backfire",
    "background", "backhand", "backlash", "backlog", "backpack", "backside", "backslap", "backslide", "backspace",
    "backspin", "backstroke", "backtrack", "backward", "badge", "bag", "bait", "balance", "ball", "ballroom", "bankbook",
    "bankroll", "base", "baseball", "basin", "basket", "basketball", "bat", "bath", "battle", "beachcomb", "bead", "bear",
    "because", "become", "bed", "bedrock", "bedroll", "bedroom", "beds", "bee", "beef", "beginner", "behavior", "belief",
    "believe", "bell", "bellboy", "bellhop", "bells", "below", "berry", "bike", "bikes", "bird", "birds", "birth",
    "birthday", "bit", "bite", "blackball", "blackberries", "blackbird", "blackboard", "blackjack", "blacklist",
    "blackmail", "blackout", "blacksmith", "blacktop", "blade", "blood", "blow", "blowgun", "bluebell", "blueberry",
    "bluebird", "bluefish", "bluegrass", "blueprint", "board", "boardwalk", "boat", "bodyguard", "bomb", "bone", "book",
    "bookcase", "bookend", "bookkeeper", "bookmark", "bookmobile", "books", "bookseller", "bookshelf", "bookworm", "boot",
    "border", "bottle", "boundary", "bowlegs", "bowtie", "box", "boy", "brainchild", "brake", "branch", "brass", "breath",
    "brick", "bridge", "brother", "bubble", "bucket", "bugspray", "building", "bulb", "burst", "bushes", "business",
    "butter", "butterball", "buttercup", "butterfingers", "buttermilk", "butternut", "butterscotch", "button", "bypass",
    "cabbage", "cabdriver", "cable", "cactus", "cake", "cakes", "calculator", "calendar", "camera", "camp", "can",
    "cancan", "candlelight", "candlestick", "cannon", "cannot", "canvas", "cap", "caption", "car", "card", "cardsharp",
    "care", "carefree", "careworn", "carfare", "carload", "carpenter", "carpool", "carport", "carriage", "cars",
    "carsick", "cart", "cartwheel", "cast", "cat", "cats", "cattle", "catwalk", "cause", "cave", "caveman", "celery",
    "cellar", "cemetery", "cent", "centercut", "chalk", "chance", "change", "channel", "cheese", "cheeseburger",
    "cherries", "cherry", "chess", "chicken", "chickens", "children", "chin", "church", "circle", "clam", "class",
    "clockwise", "cloth", "clover", "club", "coach", "coal", "coast", "coat", "cobweb", "coffeemaker", "coil", "collar",
    "color", "comeback", "committee", "commonplace", "commonwealth", "company", "comparison", "competition", "condition",
    "connection", "control", "cook", "copper", "corn", "cornmeal", "cough", "country", "courthouse", "cover", "cow",
    "cows", "crack", "cracker", "crate", "crayon", "cream", "creator", "creature", "credit", "crewcut", "crib", "crime",
    "crook", "crossbow", "crossbreed", "crosscut", "crossover", "crosswalk", "crow", "crowd", "crown", "cub", "cup",
    "current", "curtain", "curve", "cushion", "dad", "dairymaid", "daisywheel", "daughter", "day", "daybed", "daybook",
    "daybreak", "daydream", "daylight", "daytime", "deadend", "deadline", "death", "debt", "decision", "deer", "degree",
    "design", "desire", "desk", "destruction", "detail", "development", "digestion", "dime", "dinner", "dinosaurs",
    "direction", "dirt", "discovery", "discussion", "dishcloth", "dishpan", "dishwasher", "dishwater", "diskdrive",
    "distance", "distribution", "division", "dock", "doctor", "dog", "dogs", "doll", "dolls", "donkey", "door",
    "doorstop", "downtown", "downunder", "drain", "drawbridge", "drawer", "dress", "drink", "driveway", "driving", "drop",
    "duck", "duckbill", "duckpin", "ducks", "dust", "ear", "earache", "earring", "earth", "earthquake", "earthward",
    "earthworm", "edge", "education", "effect", "egg", "egghead", "eggnog", "eggs", "eggshell", "elbow", "end", "engine",
    "error", "event", "everything", "example", "exchange", "existence", "expansion", "experience", "expert", "eye",
    "eyeballs", "eyecatching", "eyeglasses", "eyelash", "eyelid", "eyes", "eyesight", "eyewitness", "face", "fact",
    "fairies", "fall", "fang", "farm", "fatherland", "fear", "feeling", "field", "finger", "fire", "fireball", "fireboat",
    "firebomb", "firebreak", "firecracker", "firefighter", "firehouse", "fireman", "fireproof", "fireworks", "fish",
    "fishbowl", "fisherman", "fisheye", "fishhook", "fishmonger", "fishnet", "fishpond", "fishtail", "flag", "flame",
    "flavor", "flesh", "flight", "flock", "floor", "flower", "flowers", "fly", "fog", "fold", "food", "foot", "football",
    "foothill", "footlights", "footlocker", "footprints", "forbearer", "force", "forearm", "forebear", "forebrain",
    "forecast", "foreclose", "foreclosure", "foredoom", "forefather", "forefeet", "forefinger", "forefoot", "forego",
    "foregone", "forehand", "forehead", "foreknowledge", "foreleg", "foreman", "forepaws", "foresee", "foreshadow",
    "forestall", "forethought", "foretold", "forever", "forewarn", "foreword", "forget", "fork", "forklift", "form",
    "fowl", "frame", "friction", "friend", "friends", "frog", "frogs", "front", "fruit", "fruitcup", "fuel", "furniture",
    "gate", "gearshift", "geese", "ghost", "giants", "giraffe", "girl", "girls", "glass", "glassmaking", "glove", "gold",
    "goodbye", "goodnight", "government", "governor", "grade", "grain", "grandaunt", "granddaughter", "grandfather",
    "grandmaster", "grandmother", "grandnephew", "grandparent", "grandson", "grandstand", "granduncle", "grape", "grass",
    "grassland", "graveyard", "grip", "ground", "group", "growth", "guide", "guitar", "gumball", "gun", "hair", "haircut",
    "hall", "hamburger", "hammer", "hand", "handbook", "handgun", "handmade", "handout", "hands", "harbor", "harmony",
    "hat", "hate", "head", "headache", "headlight", "headline", "headquarters", "health", "heat", "hereafter", "hereby",
    "herein", "hereupon", "highchair", "highland", "highway", "hill", "himself", "history", "hobbies", "hole", "holiday",
    "home", "homemade", "hometown", "honey", "honeybee", "honeydew", "honeysuckle", "hook", "hookup", "hope", "horn",
    "horse", "horseback", "horsefly", "horsehair", "horseman", "horseplay", "horsepower", "horseradish", "horses", "hose",
    "hospital", "hot", "hour", "house", "houseboat", "household", "housekeeper", "houses", "housetop", "however", "humor",
    "hydrant", "ice", "icicle", "idea", "impulse", "income", "increase", "industry", "ink", "insect", "inside",
    "instrument", "insurance", "intake", "interest", "invention", "iron", "island", "itself", "jail", "jailbait", "jam",
    "jar", "jeans", "jelly", "jellybean", "jellyfish", "jetliner", "jetport", "jewel", "join", "judge", "juice", "jump",
    "jumpshot", "kettle", "key", "keyboard", "keyhole", "keynote", "keypad", "keypunch", "keystone", "keystroke",
    "keyword", "kick", "kiss", "kittens", "kitty", "knee", "knife", "knot", "knowledge", "laborer", "lace", "ladybug",
    "lake", "lamp", "land", "language", "laugh", "leather", "leg", "legs", "letter", "letters", "lettuce", "level",
    "library", "lifeblood", "lifeguard", "lifelike", "lifeline", "lifelong", "lifetime", "lifework", "limelight",
    "limestone", "limit", "line", "linen", "lip", "liquid", "loaf", "lock", "locket", "longhand", "look", "loss", "love",
    "low", "lukewarm", "lumber", "lunch", "lunchroom", "machine", "magic", "maid", "mailbox", "mainline", "man", "marble",
    "mark", "market", "mask", "mass", "match", "matchbox", "meal", "meantime", "meanwhile", "measure", "meat", "meeting",
    "memory", "men", "metal", "mice", "middle", "milk", "mind", "mine", "minister", "mint", "minute", "mist", "mitten",
    "mom", "money", "monkey", "month", "moon", "moonbeam", "moonlight", "moonlit", "moonscape", "moonshine", "moonstruck",
    "moonwalk", "moreover", "morning", "mother", "motion", "motorcycle", "mountain", "mouth", "move", "muscle", "name",
    "nation", "nearby", "neck", "need", "needle", "nerve", "nest", "nevermore", "newsboy", "newsbreak", "newscaster",
    "newsdealer", "newsletter", "newsman", "newspaper", "newsprint", "newsreel", "newsroom", "night", "nightfall",
    "nobody", "noise", "noisemaker", "north", "northeast", "nose", "note", "notebook", "nowhere", "number", "nursemaid",
    "nut", "nutcracker", "oatmeal", "observation", "ocean", "offer", "office", "oil", "oneself", "onetime", "orange",
    "oranges", "order", "oven", "overboard", "overcoat", "overflow", "overland", "pacemaker", "page", "pail", "pan",
    "pancake", "paper", "parcel", "part", "partner", "party", "passbook", "passenger", "passkey", "Passover", "passport",
    "payment", "peace", "pear", "pen", "pencil", "peppermint", "person", "pest", "pet", "pets", "pickle", "pickup",
    "picture", "pie", "pies", "pig", "pigs", "pin", "pinhole", "pinstripe", "pinup", "pinwheel", "pipe", "pizzas",
    "place", "plane", "planes", "plant", "plantation", "plants", "plastic", "plate", "play", "playback", "playground",
    "playhouse", "playthings", "pleasure", "plot", "plough", "pocket", "point", "poison", "pollution", "ponytail",
    "popcorn", "porter", "position", "postcard", "pot", "potato", "powder", "power", "price", "produce", "profit",
    "property", "prose", "protest", "pull", "pump", "punishment", "purpose", "push", "quarter", "quartz", "queen",
    "question", "quicksand", "quiet", "quill", "quilt", "quince", "quiver", "rabbit", "rabbits", "racquetball", "rail",
    "railroad", "railway", "rain", "raincheck", "raincoat", "rainstorm", "rainwater", "rake", "range", "rat", "rate",
    "rattlesnake", "rattletrap", "ray", "reaction", "reading", "reason", "receipt", "recess", "record", "regret",
    "relation", "religion", "repairman", "representative", "request", "respect", "rest", "reward", "rhythm", "rice",
    "riddle", "rifle", "ring", "rings", "river", "riverbanks", "road", "robin", "rock", "rod", "roll", "roof", "room",
    "root", "rose", "route", "rub", "rubberband", "rule", "run", "sack", "sail", "sailboat", "salesclerk", "salt", "sand",
    "sandlot", "sandstone", "saucepan", "scale", "scapegoat", "scarecrow", "scarf", "scene", "scent", "school",
    "schoolbook", "schoolboy", "schoolbus", "schoolhouse", "science", "scissors", "screw", "sea", "seashore", "seat",
    "secretary", "seed", "selection", "self", "sense", "servant", "shade", "shadyside", "shake", "shame", "shape",
    "sharecropper", "sharpshooter", "sheep", "sheepskin", "sheet", "shelf", "ship", "shirt", "shock", "shoe", "shoelace",
    "shoemaker", "shoes", "shop", "shortbread", "show", "showoff", "showplace", "side", "sidekick", "sidewalk", "sign",
    "silk", "silver", "silversmith", "sink", "sister", "sisterhood", "sisters", "sixfold", "size", "skate", "skateboard",
    "skin", "skintight", "skirt", "sky", "skylark", "skylight", "slave", "sleep", "sleet", "slip", "slope", "slowdown",
    "slumlord", "smash", "smell", "smile", "smoke", "snail", "snails", "snake", "snakes", "snakeskin", "sneeze", "snow",
    "snowball", "snowbank", "snowbird", "snowdrift", "snowshovel", "soap", "society", "sock", "soda", "sofa", "softball",
    "somebody", "someday", "somehow", "someone", "someplace", "something", "sometimes", "somewhat", "somewhere", "son",
    "song", "songs", "sort", "sound", "soundproof", "soup", "southeast", "southwest", "soybean", "space", "spacewalk",
    "spade", "spark", "spearmint", "spiders", "spillway", "spokesperson", "sponge", "spoon", "spot", "spring", "spy",
    "square", "squirrel", "stage", "stagehand", "stamp", "standby", "standoff", "standout", "standpoint", "star",
    "starfish", "start", "statement", "station", "steam", "steamship", "steel", "stem", "step", "stepson", "stew",
    "stick", "sticks", "stitch", "stocking", "stockroom", "stomach", "stone", "stop", "stoplight", "stopwatch", "store",
    "story", "stove", "stranger", "straw", "stream", "street", "stretch", "string", "stronghold", "structure",
    "substance", "subway", "sugar", "suggestion", "suit", "summer", "sun", "sunbaked", "sunbathe", "sundial", "sundown",
    "sunfish", "sunflower", "sunglasses", "sunlit", "sunray", "sunroof", "sunup", "supercargo", "supercharge",
    "supercool", "superego", "superfine", "supergiant", "superhero", "superhighways", "superhuman", "superimpose",
    "supermarket", "supermen", "supernatural", "superpower", "superscript", "supersensitive", "supersonic", "superstar",
    "superstrong", "superstructure", "supertanker", "superweapon", "superwoman", "support", "surprise", "sweater",
    "sweetheart", "sweetmeat", "swim", "swing", "system", "table", "tablecloth", "tablespoon", "tabletop", "tableware",
    "tail", "tailcoat", "tailgate", "taillight", "taillike", "tailpiece", "tailspin", "takeoff", "takeout", "takeover",
    "talebearer", "taleteller", "talk", "tank", "tapeworm", "taproom", "taproot", "target", "taskmaster", "taste", "tax",
    "taxicab", "taxpayer", "teaching", "teacup", "team", "teammate", "teamwork", "teapot", "teaspoon", "teenager",
    "teeth", "telltale", "temper", "tendency", "tenderfoot", "tenfold", "tent", "territory", "test", "textbook",
    "texture", "theory", "therefore", "thing", "things", "thought", "thread", "thrill", "throat", "throne", "throwaway",
    "throwback", "thumb", "thunder", "thunderbird", "thunderstorm", "ticket", "tiger", "time", "timekeeper", "timesaving",
    "timeshare", "timetable", "tin", "title", "toad", "toe", "toes", "together", "tomatoes", "tongue", "toolbox", "tooth",
    "toothbrush", "toothpaste", "toothpick", "top", "touch", "touchdown", "town", "township", "toy", "toys", "trade",
    "trail", "train", "trains", "tramp", "transport", "tray", "treatment", "tree", "trees", "trick", "trip", "trouble",
    "trousers", "truck", "trucks", "tub", "turkey", "turn", "turnabout", "turnaround", "turnbuckle", "turndown",
    "turnkey", "turnoff", "turntable", "twig", "twist", "typewriter", "umbrella", "uncle", "underachieve", "underage",
    "underarm", "underbelly", "underbid", "undercharge", "underclothes", "undercover", "undercut", "underdevelop",
    "underestimate", "underexpose", "underfoot", "underground", "underwear", "unit", "upbeat", "upbringing", "upcoming",
    "update", "upend", "upgrade", "upheaval", "uphill", "uphold", "upkeep", "upland", "uplift", "upload", "upmarket",
    "upon", "uppercase", "upperclassman", "uppercut", "uproar", "uproot", "upset", "upshot", "upside", "upstage",
    "upstairs", "upstanding", "upstart", "upstate", "upstream", "uptake", "upthrust", "uptight", "uptime", "uptown",
    "upward", "upwind", "use", "vacation", "value", "van", "vase", "vegetable", "veil", "vein", "verse", "vessel", "vest",
    "view", "visitor", "voice", "volcano", "volleyball", "voyage", "waistline", "walk", "walkways", "wall", "walleyed",
    "wallpaper", "war", "wardroom", "warfare", "warmblooded", "warpath", "wash", "washbowl", "washcloth", "washhouse",
    "washout", "washrag", "washroom", "washstand", "washtub", "waste", "wastebasket", "wasteland", "wastepaper",
    "wastewater", "watch", "watchband", "watchdog", "watchmaker", "watchman", "watchtower", "watchword", "water",
    "watercolor", "watercooler", "watercraft", "waterfall", "waterfront", "waterline", "waterlog", "watermelon",
    "waterpower", "waterproof", "waterscape", "watershed", "waterside", "waterspout", "watertight", "wave", "wavelike",
    "waves", "wax", "waxwork", "way", "waybill", "wayfarer", "waylaid", "wayside", "wayward", "wealth", "weather",
    "weathercock", "weatherman", "weatherproof", "week", "weekday", "weekend", "weeknight", "weight", "whatever",
    "whatsoever", "wheel", "wheelchair", "wheelhouse", "whip", "whistle", "whitecap", "whitefish", "whitewall",
    "whitewash", "widespread", "wilderness", "wind", "window", "wine", "wing", "winter", "wipeout", "wire", "wish",
    "without", "woman", "women", "wood", "woodshop", "wool", "word", "work", "worm", "wound", "wren", "wrench", "wrist",
    "writer", "writing", "yak", "yam", "yard", "yarn", "year", "yoke", "zebra", "zephyr", "zinc", "zipper", "zoo"
];
const _numberWords = {
    ones: [
        "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
        "twenty"
    ],
    tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
    tiers: ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"],
    bigPrefixes: ["", "un", "duo", "tre", "quattuor", "quin", "sex", "octo", "novem"],
    bigSuffixes: ["", "decillion", "vigintillion", "trigintillion", "quadragintillion", "quinquagintillion", "sexagintillion", "septuagintillion", "octogintillion", "nonagintillion", "centillion"]
};
const _ordinals = {
    zero: "zeroeth", one: "first", two: "second", three: "third", four: "fourth", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth",
    twenty: "twentieth", thirty: "thirtieth", forty: "fortieth", fifty: "fiftieth", sixty: "sixtieth", seventy: "seventieth", eighty: "eightieth", ninety: "ninetieth"
};
const _romanNumerals = {
    grouped: [
        ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"],
        ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
        ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
        ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
        ["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
        ["", "ↈ", "ↈↈ", "ↈↈↈ"]
    ],
    ungrouped: [
        ["", "Ⅰ", "ⅠⅠ", "ⅠⅠⅠ", "ⅠⅤ", "Ⅴ", "ⅤⅠ", "ⅤⅠⅠ", "ⅤⅠⅠⅠ", "ⅠⅩ"],
        ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
        ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
        ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
        ["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
        ["", "ↈ", "ↈↈ", "ↈↈↈ"]
    ]
};
const UIDLOG = [];
/* eslint-enable array-element-newline, object-property-newline */
// #endregion ▮▮▮▮[HELPERS]▮▮▮▮
// #region ████████ GETTERS: Basic Data Lookup & Retrieval ████████ ~
// @ts-expect-error Leauge of foundry developers is wrong about user not being on game.
const GMID = () => game?.user?.find((user) => user.isGM)?.id ?? false;
const getUID = () => {
    let uid;
    do {
        uid = randString(5);
    } while (UIDLOG.includes(uid));
    UIDLOG.push(uid);
    return uid;
};
/* eslint-enable @typescript-eslint/no-explicit-any */
// #endregion ░░░░[TypeScript]░░░░
const isNumber = (ref) => typeof ref === "number" && !isNaN(ref);
const isArray = (ref) => Array.isArray(ref);
const isSimpleObj = (ref) => ref === Object(ref) && !isArray(ref);
const isList = (ref) => ref === Object(ref) && !isArray(ref); // Boolean(ref) && Object.getPrototypeOf(ref) === Object.prototype;
const isFunc = (ref) => typeof ref === "function";
const isInt = (ref) => isNumber(ref) && Math.round(ref) === ref;
const isFloat = (ref) => isNumber(ref) && /\./.test(`${ref}`);
const isPosInt = (ref) => isInt(ref) && ref >= 0;
const isIndex = (ref) => isList(ref) || isArray(ref);
const isIterable = (ref) => typeof ref === "object" && ref !== null && Symbol.iterator in ref;
const isHTMLCode = (ref) => typeof ref === "string" && /^<.*>$/u.test(ref);
const isUndefined = (ref) => ref === undefined;
const isDefined = (ref) => !isUndefined(ref);
const isEmpty = (ref) => !(() => { for (const i in ref) {
    return true;
} return false; })();
const hasItems = (ref) => !isEmpty(ref);
const isInstance = (classRef, ref) => ref instanceof classRef;
const isInstanceFunc = (clazz) => (instance) => instance instanceof clazz;
const areEqual = (...refs) => {
    do {
        const ref = refs.pop();
        if (refs.length && !checkEquality(ref, refs[0])) {
            return false;
        }
    } while (refs.length);
    return true;
    function checkEquality(ref1, ref2) {
        if (typeof ref1 !== typeof ref2) {
            return false;
        }
        if ([ref1, ref2].includes(null)) {
            return ref1 === ref2;
        }
        switch (typeof ref1) {
            case "object": {
                if (isArray(ref1)) {
                    if (!isArray(ref2)) {
                        return false;
                    }
                    if (ref1.length !== ref2.length) {
                        return false;
                    }
                    for (let i = 0; i < ref1.length; i++) {
                        if (!checkEquality(ref1[i], ref2[i])) {
                            return false;
                        }
                    }
                    return true;
                }
                else if (isList(ref1)) {
                    if (!isList(ref2) || Object.keys(ref1).length !== Object.keys(ref2).length) {
                        return false;
                    }
                    return checkEquality(Object.keys(ref1), Object.keys(ref2)) && checkEquality(Object.values(ref1), Object.values(ref2));
                }
                try {
                    return JSON.stringify(ref1) === JSON.stringify(ref2);
                }
                catch {
                    return false;
                }
            }
            default: {
                return ref1 === ref2;
            }
        }
    }
};
const pFloat = (ref, sigDigits, isStrict = false) => {
    if (typeof ref === "string") {
        ref = parseFloat(ref);
    }
    if (typeof ref === "number") {
        if (isNaN(ref)) {
            return isStrict ? NaN : 0;
        }
        if (isUndefined(sigDigits)) {
            return ref;
        }
        return Math.round(ref * (10 ** sigDigits)) / (10 ** sigDigits);
    }
    return isStrict ? NaN : 0;
};
const pInt = (ref, isStrict = false) => (isNaN(pFloat(ref, 0, isStrict)) ? NaN : Math.round(pFloat(ref, 0, isStrict)));
const radToDeg = (rad, isConstrained = true) => {
    rad = isConstrained ? rad % (2 * Math.PI) : rad;
    rad *= 180 / Math.PI;
    return rad;
};
const degToRad = (deg, isConstrained = true) => {
    deg = isConstrained ? deg % 360 : deg;
    deg *= Math.PI / 180;
    return deg;
};
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄
// #region ████████ STRINGS: String Parsing, Manipulation, Conversion, Regular Expressions ████████
// #region ░░░░░░░[Case Conversion]░░░░ Upper, Lower, Sentence & Title Case ░░░░░░░ ~
const uCase = (str) => `${str ?? ""}`.toUpperCase();
const lCase = (str) => `${str ?? ""}`.toLowerCase();
const sCase = (str) => {
    let [first, ...rest] = `${str ?? ""}`.split(/\s+/);
    first = testRegExp(first, _capWords) ? first : `${uCase(first.charAt(0))}${lCase(first.slice(1))}`;
    if (hasItems(rest)) {
        rest = rest.map((word) => (testRegExp(word, _capWords) ? word : lCase(word)));
    }
    return [first, ...rest].join(" ").trim();
};
const tCase = (str) => `${str ?? ""}`.split(/\s/)
    .map((word, i) => (i && testRegExp(word, _noCapWords) ? lCase(word) : sCase(word)))
    .join(" ").trim();
// #endregion ░░░░[Case Conversion]░░░░
// #region ░░░░░░░[RegExp]░░░░ Regular Expressions ░░░░░░░ ~
const testRegExp = (str, patterns = [], flags = "gui", isTestingAll = false) => patterns
    .map((pattern) => (pattern instanceof RegExp
    ? pattern
    : new RegExp(`\\b${pattern}\\b`, flags)))[isTestingAll ? "every" : "some"]((pattern) => pattern.test(`${str}`));
const regExtract = (ref, pattern, flags) => {
    /* Wrapper around String.match() that removes the need to worry about match()'s different handling of the 'g' flag.
            - IF your pattern contains unescaped parentheses -> Returns Array of all matching groups.
            - OTHERWISE -> Returns string that matches the provided pattern. */
    const splitFlags = [];
    [...(flags ?? "").replace(/g/g, ""), "u"].forEach((flag) => {
        if (flag && !splitFlags.includes(flag)) {
            splitFlags.push(flag);
        }
    });
    const isGrouping = /[)(]/.test(pattern.toString().replace(/\\\)|\\\(/g, ""));
    if (isGrouping) {
        splitFlags.push("g");
    }
    flags = splitFlags.join("");
    pattern = new RegExp(pattern, flags);
    const matches = `${ref}`.match(pattern) || [];
    return isGrouping ? Array.from(matches) : matches.pop();
};
// #endregion ░░░░[RegExp]░░░░
// #region ░░░░░░░[Formatting]░░░░ Hyphenation, Pluralization, "a"/"an" Fixing ░░░░░░░ ~
// const hyphenate = (str: unknown) => (/^<|\u00AD|\u200B/.test(`${str}`) ? `${str}` : _hyph(`${str}`));
const unhyphenate = (str) => `${str}`.replace(/\u00AD|\u200B/gu, "");
const parseArticles = (str) => `${str}`.replace(/\b(a|A)\s([aeiouAEIOU])/gu, "$1n $2");
const pluralize = (singular, num, plural) => {
    if (pFloat(num) === 1) {
        return singular;
    }
    return plural ?? `${singular.replace(/y$/, "ie").replace(/s$/, "se")}s`;
};
const oxfordize = (items, useOxfordComma = true) => {
    const lastItem = items.pop();
    return [
        items.join(", "),
        useOxfordComma ? "," : "",
        " and ",
        lastItem
    ].join("");
};
const ellipsize = (text, maxLength) => (`${text}`.length > maxLength ? `${`${text}`.slice(0, maxLength - 3)}…` : `${text}`);
// #region ========== Numbers: Formatting Numbers Into Strings =========== ~
const signNum = (num, delim = "") => `${pFloat(num) < 0 ? "-" : "+"}${delim}${Math.abs(pFloat(num))}`;
const padNum = (num, numDecDigits) => {
    const [leftDigits, rightDigits] = `${pFloat(num)}`.split(/\./);
    if (getType(rightDigits) === "int") {
        if (rightDigits.length > numDecDigits) {
            return `${pFloat(num, numDecDigits)}`;
        }
        else if (rightDigits.length < numDecDigits) {
            return `${leftDigits}.${rightDigits}${"0".repeat(numDecDigits - rightDigits.length)}`;
        }
        else {
            return `${pFloat(num)}`;
        }
    }
    return `${leftDigits}.${"0".repeat(numDecDigits)}`;
};
const stringifyNum = (num) => {
    // Can take string representations of numbers, either in standard or scientific/engineering notation.
    // Returns a string representation of the number in standard notation.
    if (pFloat(num) === 0) {
        return "0";
    }
    const stringyNum = lCase(num).replace(/[^\d.e+-]/g, "");
    const base = regExtract(stringyNum, /^-?[\d.]+/);
    const exp = pInt(regExtract(stringyNum, /e([+-]?\d+)$/));
    if (typeof base === "string" && typeof exp === "string") {
        let baseInts = regExtract(base, /^-?(\d+)/), baseDecs = regExtract(base, /\.(\d+)/);
        if (isArray(baseInts) && isArray(baseDecs)) {
            baseInts = baseInts.pop()?.replace(/^0+/, "");
            baseDecs = lCase(baseDecs?.pop()).replace(/0+$/, "");
            if (!isUndefined(baseInts) && !isUndefined(baseDecs)) {
                const numFinalInts = Math.max(0, baseInts.length + exp);
                const numFinalDecs = Math.max(0, baseDecs.length - exp);
                const finalInts = [
                    baseInts.slice(0, numFinalInts),
                    baseDecs.slice(0, Math.max(0, exp))
                ].join("") || "0";
                const finalDecs = [
                    baseInts.length - numFinalInts > 0
                        ? baseInts.slice(baseInts.length - numFinalInts - 1)
                        : "",
                    baseDecs.slice(baseDecs.length - numFinalDecs)
                ].join("");
                return [
                    stringyNum.charAt(0) === "-" ? "-" : "",
                    finalInts,
                    "0".repeat(Math.max(0, numFinalInts - finalInts.length)),
                    finalDecs.length ? "." : "",
                    "0".repeat(Math.max(0, numFinalDecs - finalDecs.length)),
                    finalDecs
                ].join("");
            }
        }
    }
    return `${num}`;
};
const verbalizeNum = (num) => {
    // Converts a float with absolute magnitude <= 9.99e303 into words.
    num = stringifyNum(num);
    const getTier = (trioNum) => {
        if (trioNum < _numberWords.tiers.length) {
            return _numberWords.tiers[trioNum];
        }
        return [
            _numberWords.bigPrefixes[(trioNum % 10) - 1],
            _numberWords.bigSuffixes[Math.floor(trioNum / 10)]
        ].join("");
    };
    const parseThreeDigits = (trio) => {
        if (pInt(trio) === 0) {
            return "";
        }
        const digits = `${trio}`.split("").map((digit) => pInt(digit));
        let result = "";
        if (digits.length === 3) {
            const hundreds = digits.shift();
            if (isUndefined(hundreds)) {
                throw new Error(`[U.verbalizeNum] Undefined digit in trio '${digits.join("")}'.`);
            }
            result += hundreds > 0 ? `${_numberWords.ones[hundreds]} hundred` : "";
            if (hundreds && (digits[0] || digits[1])) {
                result += " and ";
            }
        }
        if (pInt(digits.join("")) <= _numberWords.ones.length) {
            result += _numberWords.ones[pInt(digits.join(""))];
        }
        else {
            result += `${_numberWords.tens[pInt(digits.shift())]}${pInt(digits[0]) > 0 ? `-${_numberWords.ones[pInt(digits[0])]}` : ""}`;
        }
        return result;
    };
    const numWords = [];
    if (num.charAt(0) === "-") {
        numWords.push("negative");
    }
    const [integers, decimals] = num.replace(/[,|\s|-]/g, "").split(".");
    const intArray = integers.split("").reverse().join("")
        .match(/.{1,3}/g)
        ?.map((v) => v.split("").reverse().join("")) ?? [];
    const intStrings = [];
    while (intArray.length) {
        const thisTrio = intArray.pop();
        if (thisTrio) {
            const theseWords = parseThreeDigits(thisTrio);
            if (theseWords) {
                intStrings.push(`${theseWords} ${getTier(intArray.length)}`);
            }
        }
    }
    numWords.push(intStrings.join(", ").trim());
    if (getType(decimals) === "int") {
        if (integers === "0") {
            numWords.push("zero");
        }
        numWords.push("point");
        for (const digit of decimals.split("")) {
            numWords.push(_numberWords.ones[pInt(digit)]);
        }
    }
    return numWords.join(" ");
};
const ordinalizeNum = (num, isReturningWords = false) => {
    if (isReturningWords) {
        const [numText, suffix] = lCase(verbalizeNum(num)).match(/.*?[-|\s]?(\w*?)$/) ?? ["", ""];
        return numText.replace(new RegExp(`${suffix}$`), suffix in _ordinals ? _ordinals[suffix] : `${suffix}th`);
    }
    if (/\.|1[1-3]$/.test(`${num}`)) {
        return `${num}th`;
    }
    return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][pInt(`${num}`.charAt(`${num}`.length - 1))]}`;
};
const romanizeNum = (num, isUsingGroupedChars = true) => {
    if (isFloat(num)) {
        throw new Error(`Error: Can't Romanize Floats (${num})`);
    }
    if (num >= 400000) {
        throw new Error(`Error: Can't Romanize >= 400,000 (${num})`);
    }
    if (num <= 0) {
        throw new Error(`Error: Can't Romanize <= 0 (${num})`);
    }
    const romanRef = _romanNumerals[isUsingGroupedChars ? "grouped" : "ungrouped"];
    const romanNum = stringifyNum(num)
        .split("")
        .reverse()
        .map((digit, i) => romanRef[i][pInt(digit)])
        .reverse()
        .join("");
    return isUsingGroupedChars
        ? romanNum.replace(/ⅩⅠ/gu, "Ⅺ").replace(/ⅩⅡ/gu, "Ⅻ")
        : romanNum;
};
// #endregion _______ Numbers _______
// #endregion ░░░░[Formatting]░░░░
// #region ░░░░░░░[Content]░░░░ Lorem Ipsum, Random Content Generation ░░░░░░░ ~
const loremIpsum = (numWords = 200) => {
    const lrWordList = _loremIpsumText.split(/\n?\s+/g);
    const words = [...lrWordList[randNum(0, lrWordList.length - 1)]];
    while (words.length < numWords) {
        words.push(...lrWordList);
    }
    words.length = numWords;
    return `${sCase(words.join(" ")).trim().replace(/[^a-z\s]*$/ui, "")}.`;
};
const randString = (length = 5) => [...new Array(length)].map(() => String.fromCharCode(randInt(...["a", "z"].map((char) => char.charCodeAt(0))))).join("");
const randWord = (numWords = 1, wordList = _randomWords) => [...Array(numWords)].map(() => randElem([...wordList])).join(" ");
// #endregion ░░░░[Content]░░░░
// #region ░░░░░░░[Localization]░░░░ Simplified Localization Functionality ░░░░░░░ ~
/* const Loc = (locRef, formatDict = {}) => {
    if (/^"?scion\./u.test(JSON.stringify(locRef)) && typeof game.i18n.localize(locRef) === "string") {
        for (const [key, val] of Object.entries(formatDict)) {
            formatDict[key] = Loc(val);
        }
        return game.i18n.format(locRef, formatDict) || "";
    }
    return locRef;
}; */
// #endregion ░░░░[Localization]░░░░
// #endregion ▄▄▄▄▄ STRINGS ▄▄▄▄▄
// #region ████████ SEARCHING: Searching Various Data Types w/ Fuzzy Matching ████████ ~
const isIn = (needle, haystack = [], fuzziness = 0) => {
    // Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack.
    // STEP ONE: POPULATE SEARCH TESTS ACCORDING TO FUZZINESS SETTING
    const SearchTests = [
        (ndl, item) => new RegExp(`^${ndl}$`, "gu").test(`${item}`),
        (ndl, item) => new RegExp(`^${ndl}$`, "gui").test(`${item}`)
    ];
    if (fuzziness >= 1) {
        const fuzzyTests = [
            (ndl, item) => new RegExp(`^${ndl}`, "gui").test(`${item}`),
            (ndl, item) => new RegExp(`${ndl}$`, "gui").test(`${item}`),
            (ndl, item) => new RegExp(`${ndl}`, "gui").test(`${item}`),
            (ndl, item) => new RegExp(`${item}`, "gui").test(`${ndl}`)
        ];
        SearchTests.push(...fuzzyTests);
        if (fuzziness >= 2) {
            SearchTests.push(...fuzzyTests
                .map((func) => (ndl, item) => func(`${ndl}`.replace(/\W/g, ""), `${item}`.replace(/\W/gu, ""))));
            if (fuzziness >= 3) {
                SearchTests.push(() => false); // Have to implement Fuse matching
            }
        }
    }
    // STEP TWO: PARSE NEEDLE & CONSTRUCT SEARCHABLE HAYSTACK.
    const searchNeedle = `${needle}`;
    const searchStack = (() => {
        if (isArray(haystack)) {
            return [...haystack];
        }
        if (isList(haystack)) {
            return Object.keys(haystack);
        }
        try {
            return Array.from(haystack);
        }
        catch {
            throw new Error(`Haystack type must be [list, array], not ${typeof haystack}: ${JSON.stringify(haystack)}`);
        }
    })();
    if (!isArray(searchStack)) {
        return false;
    }
    // STEP THREE: SEARCH HAY FOR NEEDLE USING PROGRESSIVELY MORE FUZZY SEARCH TESTS
    let matchIndex = -1;
    while (!isPosInt(matchIndex)) {
        const testFunc = SearchTests.shift();
        if (!testFunc) {
            return false;
        }
        matchIndex = searchStack.findIndex((item) => testFunc(searchNeedle, `${item}`));
    }
    if (isPosInt(matchIndex)) {
        return isList(haystack) ? Object.values(haystack)[matchIndex] : haystack[matchIndex];
    }
    return false;
};
const isInExact = (needle, haystack) => isIn(needle, haystack, 0);
// #endregion ▄▄▄▄▄ SEARCHING ▄▄▄▄▄
// #region ████████ NUMBERS: Number Casting, Mathematics, Conversion ████████ ~
const randNum = (min, max, snap = 0) => gsap.utils.random(min, max, snap);
const randInt = (min, max) => randNum(min, max, 1);
const coinFlip = () => randNum(0, 1, 1) === 1;
const cycleNum = (num, [min = 0, max = Infinity] = []) => gsap.utils.wrap(min, max, num);
const cycleAngle = (angle) => cycleNum(angle, [-180, 180]);
const roundNum = (num, sigDigits = 0) => (sigDigits === 0 ? pInt(num) : pFloat(num, sigDigits));
const sum = (...nums) => nums.flat().reduce((num, tot) => tot + num, 0);
const average = (...nums) => sum(...nums) / nums.flat().length;
// #region ░░░░░░░[Positioning]░░░░ Relationships On 2D Cartesian Plane ░░░░░░░ ~
const getDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => (((x1 - x2) ** 2) + ((y1 - y2) ** 2)) ** 0.5;
const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }, { x: xO = 0, y: yO = 0 } = { x: 0, y: 0 }) => {
    x1 -= xO;
    y1 -= yO;
    x2 -= xO;
    y2 -= yO;
    return cycleAngle(radToDeg(Math.atan2(y2 - y1, x2 - x1)));
};
const getAngleDelta = (angleStart, angleEnd) => cycleAngle(angleEnd - angleStart);
// #endregion ░░░░[Positioning]░░░░
// #endregion ▄▄▄▄▄ NUMBERS ▄▄▄▄▄
// #region ████████ ARRAYS: Array Manipulation ████████ ~
const randElem = (array) => gsap.utils.random(array);
const randIndex = (array) => randInt(0, array.length - 1);
const makeCycler = (array, index = 0) => {
    // Given an array and a starting index, returns a generator function that can be used
    // to iterate over the array indefinitely, or wrap out-of-bounds index values
    const wrapper = gsap.utils.wrap(array);
    index--;
    return (function* cycler() {
        while (true) {
            index++;
            yield wrapper(index);
        }
    }());
};
const getLast = (array) => (array.length ? array[array.length - 1] : undefined);
const unique = (array) => {
    const returnArray = [];
    array.forEach((item) => { if (!returnArray.includes(item)) {
        returnArray.push(item);
    } });
    return returnArray;
};
const removeFirst = (array, element) => array.splice(array.findIndex((v) => v === element));
const pullElement = (array, checkFunc = (_v = true, _i = 0, _a = []) => { checkFunc(_v, _i, _a); }) => {
    const index = array.findIndex((v, i, a) => checkFunc(v, i, a));
    return index !== -1 && array.splice(index, 1).pop();
};
const pullIndex = (array, index) => pullElement(array, (v, i) => i === index);
const checkVal = ({ k, v }, checkTest) => {
    if (typeof checkTest === "function") {
        if (isDefined(v)) {
            return checkTest(v, k);
        }
        return checkTest(k);
    }
    if (typeof checkTest === "number") {
        checkTest = `${checkTest}`;
    }
    return (new RegExp(checkTest)).test(`${v}`);
};
const remove = (obj, checkTest) => {
    // Given an array or list and a search function, will remove the first matching element and return it.
    if (isArray(obj)) {
        const index = obj.findIndex((v) => checkVal({ v }, checkTest));
        if (index >= 0) {
            let remVal;
            for (let i = 0; i <= obj.length; i++) {
                if (i === index) {
                    remVal = obj.shift();
                }
                else {
                    obj.push(obj.shift());
                }
            }
            return remVal;
        }
    }
    else if (isList(obj)) {
        const [remKey] = Object.entries(obj).find(([k, v]) => checkVal({ k, v }, checkTest)) ?? [];
        if (remKey) {
            const remVal = obj[remKey];
            // const {[remKey]: remVal} = obj;
            delete obj[remKey];
            return remVal;
        }
    }
    return false;
};
const replace = (obj, checkTest, repVal) => {
    // As remove, except instead replaces the element with the provided value.
    // Returns true/false to indicate whether the replace action succeeded.
    let repKey;
    if (isList(obj)) {
        [repKey] = Object.entries(obj).find((v) => checkVal({ v }, checkTest)) || [false];
        if (repKey === false) {
            return false;
        }
    }
    else if (isArray(obj)) {
        repKey = obj.findIndex((v) => checkVal({ v }, checkTest));
        if (repKey === -1) {
            return false;
        }
    }
    if (typeof repKey !== "number") {
        repKey = `${repKey}`;
    }
    if (typeof repVal === "function") {
        // @ts-expect-error Hopefully just temporary to get this to compile: Need to figure out how to properly define testFunc<keyFunc | valFunc> (keyFunc/valFunc types?)
        obj[repKey] = repVal(obj[repKey], repKey);
    }
    else {
        // @ts-expect-error Hopefully just temporary to get this to compile: Need to figure out how to properly define testFunc<keyFunc | valFunc> (keyFunc/valFunc types?)
        obj[repKey] = repVal;
    }
    return true;
};
// Given an object and a predicate function, returns array of two objects:
//   one with entries that pass, one with entries that fail.
const partition = (obj, predicate = () => true) => [
    objFilter(obj, predicate),
    objFilter(obj, (v, k) => !predicate(v, k))
];
function objMap(obj, keyFunc, valFunc) {
    // An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
    // If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
    if (!valFunc) {
        valFunc = keyFunc;
        keyFunc = false;
    }
    if (!keyFunc) {
        keyFunc = ((k) => k);
    }
    if (isArray(obj)) {
        return obj.map(valFunc);
    }
    return Object.fromEntries(Object.entries(obj).map(([key, val]) => [keyFunc(key, val), valFunc(val, key)]));
}
const objFilter = (obj, keyFunc, valFunc) => {
    // An object-equivalent Array.filter() function, which accepts filter functions for both keys and/or values.
    // If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
    if (!valFunc) {
        valFunc = keyFunc;
        keyFunc = false;
    }
    if (!keyFunc) {
        keyFunc = ((k) => k);
    }
    if (isArray(obj)) {
        return obj.filter(valFunc);
    }
    const kFunc = keyFunc || (() => true);
    const vFunc = valFunc || (() => true);
    // @ts-expect-error TEMPORARY
    return Object.fromEntries(Object.entries(obj).filter(([key, val]) => kFunc(key) && vFunc(val)));
};
const objForEach = (obj, func) => {
    // An object-equivalent Array.forEach() function, which accepts one function(val, key) to perform for each member.
    if (isArray(obj)) {
        obj.forEach(func);
    }
    else {
        Object.entries(obj).forEach(([key, val]) => func(val, key));
    }
};
// Prunes an object of certain values (undefined by default)
const objCompact = (obj, preserve = []) => objFilter(obj, (val) => preserve.includes(`${val}`));
const objClone = (obj, isStrictlySafe = false) => {
    try {
        return JSON.parse(JSON.stringify(obj));
    }
    catch (err) {
        if (isStrictlySafe) {
            throw err;
        }
        if (isArray(obj)) {
            return [...obj];
        }
        if (isList(obj)) {
            return { ...obj };
        }
    }
    return obj;
};
function objMerge(target, source, { isMutatingOk = false, isStrictlySafe = false, isConcatenatingArrays = true } = {}) {
    DB.group("U.objMerge()");
    DB.log("target, source", target, source);
    /* Returns a deep merge of source into target. Does not mutate target unless isMutatingOk = true. */
    target = isMutatingOk ? target : objClone(target, isStrictlySafe);
    if (source instanceof Application) {
        DB.log("... SOURCE is APPLICATION, returning SOURCE:", source);
        DB.groupEnd();
        return source;
    }
    if (isUndefined(target)) {
        DB.log("... TARGET undefined, returning SOURCE:", objClone(source));
        DB.groupEnd();
        return objClone(source);
    }
    if (isUndefined(source)) {
        DB.log("... SOURCE undefined, returning TARGET:", target);
        DB.groupEnd();
        return target;
    }
    if (isIndex(source)) {
        for (const [key, val] of Object.entries(source)) { // @ts-expect-error TEMPORARY
            if (isConcatenatingArrays && isArray(target[key]) && isArray(val)) { // @ts-expect-error TEMPORARY
                target[key] = [...target[key], ...val];
            }
            else if (val !== null && typeof val === "object") { // @ts-expect-error TEMPORARY
                if (target[key] === undefined && !(val instanceof Application)) {
                    if (isArray(val)) { // @ts-expect-error TEMPORARY
                        target[key] = [];
                    }
                    else if (isList(val)) { // @ts-expect-error TEMPORARY
                        target[key] = {}; // @ts-expect-error TEMPORARY
                    }
                    else {
                        target[key] = new val.__proto__.constructor();
                    }
                } // @ts-expect-error TEMPORARY
                target[key] = objMerge(target[key], val, { isMutatingOk: true, isStrictlySafe });
            }
            else { // @ts-expect-error TEMPORARY
                target[key] = val;
            }
        }
    }
    DB.log("... RETURNING", target);
    DB.groupEnd();
    return target;
}
const objExpand = (obj) => {
    const expObj = {};
    for (let [key, val] of Object.entries(obj)) {
        if (isList(val)) {
            val = objExpand(val);
        }
        setProperty(expObj, key, val);
    }
    return expObj;
};
const objFlatten = (obj) => {
    const flatObj = {};
    for (const [key, val] of Object.entries(obj)) {
        if ((isArray(val) || isList(val)) && hasItems(val)) {
            for (const [subKey, subVal] of Object.entries(objFlatten(val))) {
                flatObj[`${key}.${subKey}`] = subVal;
            }
        }
        else {
            flatObj[key] = val;
        }
    }
    return flatObj;
};
// #endregion ▄▄▄▄▄ OBJECTS ▄▄▄▄▄
// #region ████████ FUNCTIONS: Function Wrapping, Queuing, Manipulation ████████ ~
const getDynamicFunc = (funcName, func, context) => {
    if (typeof func === "function") {
        const dFunc = { [funcName](...args) { return func(...args); } }[funcName];
        return context ? dFunc.bind(context) : dFunc;
    }
    return false;
};
function get(target, property, unit) {
    if (unit) {
        const propVal = regExtract(gsap.getProperty(target, property, unit), /[\d.]+/);
        if (typeof propVal === "string") {
            return pFloat(propVal);
        }
        throw new Error(`Unable to extract property '${property}' in '${unit}' units from ${target}`);
    }
    return gsap.getProperty(target, property);
}
const set = (targets, vars) => gsap.set(targets, vars);
// #endregion ░░░░[GreenSock]░░░░
const getRawCirclePath = (r, { x: xO, y: yO } = { x: 0, y: 0 }) => {
    [r, xO, yO] = [r, xO, yO].map((val) => roundNum(val, 2));
    const [b1, b2] = [0.4475 * r, (1 - 0.4475) * r];
    const [xT, yT] = [xO, yO - r];
    return [[
            ...[xT, yT],
            ...[b2, 0, r, b1, r, r],
            ...[0, b2, -b1, r, -r, r],
            ...[-b2, 0, -r, -b1, -r, -r],
            ...[0, -b2, b1, -r, r, -r]
        ]];
};
const drawCirclePath = (radius, origin) => {
    const [[xT, yT, ...segments]] = getRawCirclePath(radius, origin);
    const path = [`m ${xT} ${yT}`];
    segments.forEach((coord, i) => {
        if (i % 6 === 0) {
            path.push("c");
        }
        path.push(coord);
    });
    path.push("z");
    return path.join(" ");
};
const formatAsClass = (str) => `${str}`.replace(/([A-Z])|\s/g, "-$1").replace(/^-/, "").trim().toLowerCase();
const getGSAngleDelta = (startAngle, endAngle) => signNum(roundNum(getAngleDelta(startAngle, endAngle), 2)).replace(/^(.)/, "$1=");
// #endregion ▄▄▄▄▄ HTML ▄▄▄▄▄
// #region ████████ EXPORTS ████████
export default {
    // ████████ GETTERS: Basic Data Lookup & Retrieval ████████
    GMID, getUID,
    // ████████ TYPES: Type Checking, Validation, Conversion, Casting ████████
    isNumber, isSimpleObj, isList, isArray, isFunc, isInt, isFloat, isPosInt, isIterable, isHTMLCode,
    isUndefined, isDefined, isEmpty, hasItems, isInstance, isInstanceFunc,
    areEqual,
    pFloat, pInt, radToDeg, degToRad,
    // ████████ REGEXP: Regular Expressions, Replacing, Matching ████████
    testRegExp,
    regExtract,
    // ████████ STRINGS: String Parsing, Manipulation, Conversion ████████
    // ░░░░░░░ Case Conversion ░░░░░░░
    uCase, lCase, sCase, tCase,
    // ░░░░░░░ Formatting ░░░░░░░
    /* hyphenate, */ unhyphenate, pluralize, oxfordize, ellipsize,
    parseArticles,
    signNum, padNum, stringifyNum, verbalizeNum, ordinalizeNum, romanizeNum,
    // ░░░░░░░ Content ░░░░░░░
    loremIpsum, randString, randWord,
    // ░░░░░░░ Localization ░░░░░░░
    //~ loc,
    // ████████ SEARCHING: Searching Various Data Types w/ Fuzzy Matching ████████
    isIn, isInExact,
    // ████████ NUMBERS: Number Casting, Mathematics, Conversion ████████
    randNum, randInt,
    coinFlip,
    cycleNum, cycleAngle, roundNum,
    sum, average,
    // ░░░░░░░ Positioning ░░░░░░░
    getDistance,
    getAngle, getAngleDelta,
    // ████████ ARRAYS: Array Manipulation ████████
    randElem, randIndex,
    makeCycler,
    getLast,
    unique,
    removeFirst, pullElement, pullIndex,
    // ████████ OBJECTS: Manipulation of Simple Key/Val Objects ████████
    remove, replace, partition,
    objMap, objFilter, objForEach, objCompact,
    objClone, objMerge, objExpand, objFlatten,
    // ████████ FUNCTIONS: Function Wrapping, Queuing, Manipulation ████████
    getDynamicFunc,
    // ████████ HTML: Parsing HTML Code, Manipulating DOM Objects ████████
    // ░░░░░░░ GreenSock ░░░░░░░
    gsap, get, set,
    getRawCirclePath, drawCirclePath,
    formatAsClass,
    getGSAngleDelta
};
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄