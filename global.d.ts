// type FoundryClass = any;

// declare const Hooks: FoundryClass;
// declare const window: FoundryClass;
// declare const CONFIG: FoundryClass;
// declare const game: FoundryClass;

declare namespace global {
  interface CONFIG {
    OREX: {};
  }
}

declare namespace CONFIG {
	interface OREX { }
}