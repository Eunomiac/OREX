// #region ████████ IMPORTS ████████ ~
import {
  // #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
  gsap, Dragger, InertiaPlugin, MotionPathPlugin, // GreenSock Animation Platform
  // #endregion ▮▮▮▮[External Libraries]▮▮▮▮
  // #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
  U,
  // #endregion ▮▮▮▮[Utility]▮▮▮▮
  // #region ▮▮▮▮▮▮▮[XCircles]▮▮▮▮▮▮▮ ~
  XElem,
  XItem, XDie, XSnap,
  // #endregion ▮▮▮▮[XCircles]▮▮▮▮
  // #region ▮▮▮▮▮▮▮[Mixins]▮▮▮▮▮▮▮ ~
  MIX, HasSnapPath
  // #endregion ▮▮▮▮[Mixins]▮▮▮▮
} from "../helpers/bundler.mjs";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export default class XCircle extends MIX(XElem).with(HasSnapPath) {
  // #region ████████ STATIC: Static Getters, Setters, Methods ████████ ~
  // #region ░░░░░░░[Enumerables]░░░░ Class Subtypes ░░░░░░░ ~
  static get TYPES() {
    return {
      ...super.TYPES,
      pink: "pink",
      yellow: "yellow",
      cyan: "cyan",
      purple: "purple"
    };
  }
  // #endregion ░░░░[Enumerables]░░░░
  // #region ░░░░░░░[Defaults]░░░░ Overrides of XElem Defaults ░░░░░░░ ~
  static get DEFAULT_DATA() {
    return {
      ...super.DEFAULT_DATA,
      CLASSES: [...super.DEFAULT_DATA.CLASSES, "x-circle"],
      PREFIX: "xCircle"
    };
  }
  // #endregion ░░░░[Defaults]░░░░
  // #region ░░░░░░░[Methods]░░░░ Static Methods ░░░░░░░ ~
  static Snap({x, y}) {
    const snapPoint = gsap.utils.snap({values: Array.from(this.SNAPPOINTS.keys())}, {x, y});
    const circle = this.SNAPPOINTS.get(snapPoint);
    return {...snapPoint, circle};
  }
  static UpdateCircleWatch(item) {
    if (item.snap) { return item.snap }
    const {x, y, circle} = this.Snap(item.pos);
    if (item.closestCircle?.name !== circle.name) {
      if (item.closestCircle) {
        item.closestCircle.unwatchItem(item).then(() => circle.watchItem(item));
      } else {
        circle.watchItem(item);
      }
    }
    return {x, y, circle};
  }
  static GetClosestTo(item) { return this.Snap(item).circle }
  // #endregion ░░░░[Methods]░░░░
  // #endregion ▄▄▄▄▄ STATIC ▄▄▄▄▄

  // #region ████████ CONSTRUCTOR ████████ ~
  constructor(x, y, radius, options = {}) {
    const circle$ = $(`
    <div style="height: ${2 * radius}px; width: ${2 * radius}px;">
      <svg height="100%" width="100%">
        <circle cx="${radius}" cy="${radius}" r="${radius}" stroke="none"></circle>
        <circle class="motion-path" cx="${radius}" cy="${radius}" r="${radius * 0.8}" fill="none" stroke="none"></circle>
      </svg>
    </div>`);
    super(circle$, {
      properties: {x, y},
      pathProperties: {
        x: radius * 0.8,
        y: radius * 0.8
      },
      classes: [`x-circle-${options.type ?? XCircle.DEFAULT_DATA.TYPE}`],
      ...options
    });
    /*DEVCODE*/console.log(this);/*!DEVCODE*/
    this._toggleSlowRotate(true);
  }
  // #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄

  // #region ████████ GETTERS & SETTERS ████████ ~
  get slots() { return (this._slots = this._slots ?? []) }

  // #region ========== Path Items: Positioning Contained Items Along Motion Path =========== ~
  get pathMap() { //~ IN ALL CASES, PATH STARTS AT 90deg, 0deg IS AT 12'O'CLOCK
    // Incorporates the weights of all items and returns a Map of [item]: [pathPos] in order of slots
    const pathMap = new Map();
    let totalWeights = 0;
    this.slots.forEach((slotItem) => {
      totalWeights += slotItem.pathWeight;
      pathMap.set(slotItem, totalWeights - 0.5 * slotItem.pathWeight);
    });
    for (const [item, pathWeight] of pathMap.entries()) {
      pathMap.set(item, gsap.utils.normalize(0, totalWeights, pathWeight));
    }
    return pathMap;
  }
  get pathPositions() { return Array.from(this.pathMap.values()) }
  get pathItems() { return Array.from(this.pathMap.keys()) }
  // #endregion _______ Path Items _______

  // #region ========== Animation: Tickers & Other Animations =========== ~
  get watchFuncs() { return (this._watchFuncs = this._watchFuncs ?? new Map()) }
  // #endregion _______ Animation _______
  // #endregion ░░░░[Read-Only]░░░░
  // #endregion ▄▄▄▄▄ GETTERS & SETTERS ▄▄▄▄▄

  // #region ████████ PRIVATE METHODS ████████ ~
  // #region ░░░░░░░[Animation]░░░░ Animation Effects, Tweens, Timelines ░░░░░░░ ~
  _killTweens(types) {
    if (types) {
      [types].flat().forEach((type) => {
        gsap.killTweensOf(this.elem, type);
        if (type === "rotation") {
          delete this._isSlowRotating;
        }
      });
    } else {
      gsap.killTweensOf(this.elem);
      delete this._isSlowRotating;
    }
  }
  _toggleSlowRotate(isRotating) {
    if (Boolean(isRotating) === Boolean(this._isSlowRotating)) { return }
    if (isRotating) {
      this._isSlowRotating = gsap.to(this.elem, {
        rotation: "+=360",
        duration: 100,
        repeat: -1,
        ease: "none",
        callbackScope: this,
        onUpdate() {
          this.slots.forEach((item) => item.straighten());
        }
      });
    } else {
      this._isSlowRotating.kill();
      delete this._isSlowRotating;
    }
  }
  // #endregion ░░░░[Animation]░░░░

  // #region ░░░░░░░[Items]░░░░ Managing Contained XItems ░░░░░░░ ~
  /*
    Whenever a "SnapsToCircle" XItem parents itself to .x-container (for any reason)
    ... static XCircle method checks to see which registered XCircles are valid receivers
        --> sends this data back to the XItem, which logs the XCircles that will be watching it
    ... if there are valid XCircles, XItem starts a gsap.ticker in which it sends each valid XCircle...
        1) Its angle to the XCircle's center (which will have to be converted to relAngle to account for circle's rotation)
        2) Its distance from the XCircle's center
    ... XCircle, on receiving this data every tick:
        1) Checks to see if it already has an XSnap item linked to the floating XItem
          ... NO?
            A) XCircle determines the TWO slots it must form a gap between such that the gap aims towards the XItem
            B) XCircle creates the XSnap item and inserts it into the gap
        2) Scales the pathweight of the XSnap item depending on the distance to the floating XItem
        3) Updates the distribution of all slotted XItems to reflect the new pathweight
        4) At the SAME TIME, rotates itself so that the absAngle to the XSnap item matches the absAngle to the floating XItem

    Whenever a "SnapsToCircle" XItem fires its onSnap() method (i.e. at the moment of a throw)
    ... XItem determines, via XCircle, which snap point it will land on
    ... XItem removes that XCircle from its watch-log, saving it as its snapCircle
    ... XItem tells all other XCircles in its watch-log to stop watching it, and removes them from its log as it does so
      ... those XCircles kill the associated XSnap item and redistribute their slots
    ... XItem tells the XCircle it's snapping to where it's going to land
    ... XCircle determines time until XItem lands (from tween)
    ... XCircle rotates so that the associated XSnap item's absAngle equals the absAngle to the snap coordinates, timing the tween
        so that it completes just as the XItem reaches its final snap point
      ... XCircle continues to update the pathWeight of the XSnap item so that the space grows as the XItem approaches

    Whenever a "SnapsToCircle" XItem fires its onThrowComplete() method after arriving at its snap position
    ... XItem kills its XSnap item, reparents itself to the XCircle, and tells the XCircle to redistribute its slots

    Whenever a "SnapsToCircle" XItem parents itself OUT of the .x-container (for any reason, including removal)
    ... XItem tells any remaining XCircles in its watch-log to stop watching it
      ... those XCircles kill the associated XSnap item and redistribute their slots
  */
  _areSlotsEqual(slots1, slots2) {
    return slots1.length === slots2.length
      && slots1.every((slot, i) => slot.name === slots2[i].name);
  }
  _areSameOrder(slots1, slots2) {
    if (slots1.length !== slots2.length) { return false }
    const posIndexOffset = slots2.findIndex((slot) => slot.name === slots1[0].name);
    if (U.isPosInt(posIndexOffset)
      && slots1.every((slot, i) => slot.name === gsap.utils.wrap(slots2, i + posIndexOffset).name)) {
      const negIndexOffset = posIndexOffset - slots1.length;
      return Math.abs(negIndexOffset) >= posIndexOffset ? posIndexOffset : negIndexOffset;
    }
    return false;
  }
  _getAdjacentSlots(pathPos) {
    // Given a path position, returns the two nearest slot positions
    const {pathPositions: pathVals} = this;
    const upperSlot = pathVals
      .findIndex((v, i, a) => i === (a.length - 1) || v >= pathPos);
    pathVals.reverse();
    const lowerSlot = this.pathMap.size - 1 - pathVals
      .findIndex((v, i, a) => i === (a.length - 1) || v <= pathPos);
    return [lowerSlot, upperSlot];
  }
  _getAngledPathPos({x, y}) {
    // Determines the path position closest to the provided point, relying on angle.
    if ([x, y].includes(undefined)) { return false }
    const angle = this._getRelAngleTo({x, y});
    return gsap.utils.normalize(-180, 180, angle);
  }
  _getNearestSlot({x, y}) {
    // Determines closest slot to the provided point, relying on angle.
    if ([x, y].includes(undefined)) { return false }
    const angle = this._getRelAngleTo({x, y});
    const pathPos = this._getAngledPathPos({x, y});
    if (pathPos !== false) {
      const [lowerSlot, upperSlot] = this._getAdjacentSlots(pathPos);
      if (upperSlot === 0
        || lowerSlot === upperSlot
        || gsap.utils.snap([
          this.pathPositions[lowerSlot],
          this.pathPositions[upperSlot]
        ], pathPos) === this.pathPositions[upperSlot]) { return upperSlot }
      return lowerSlot;
    }
    return false;
  }
  _getSlotItemPos(item) {
    // Returns the pixel coordinates, angle, pathPos and slot of a slot item
    return {
      ...this._getPosOnPath(this.pathMap.get(item)),
      slot: this.slots.findIndex((slotItem) => slotItem === item)
    };
  }
  _getSlotPathPositions(slots) {
    return [...slots ?? this.slots].map((item) => this._getSlotItemPos(item, slots).pathPos);
  }
  _getSnapItemFor(item) {
    return this.slots.find((slotItem) => slotItem.snapTarget?.name === item.name);
  }
  _getSnapPosFor(item) { return this._getSlotItemPos(this._getSnapItemFor(item)) }
  _getSlotsWithout(ref, slots = this.slots) { return slots.filter((slot) => slot !== ref) }
  _getSlotsPlus(items, index, slots = this.slots) {
    index = index ?? slots.length;
    return [
      ...slots.slice(0, index),
      ...[items].flat(),
      ...slots.slice(index)
    ];
  }
  async _distItems(newSlots, duration = 1) {
    const oldSlots = [...this.slots];

    if (this._areSlotsEqual(oldSlots, newSlots)) { return Promise.resolve() }
    const indexOffset = this._areSameOrder(oldSlots, newSlots);
    if (indexOffset !== false
      && (oldSlots[0] === newSlots[1] || oldSlots[1] === newSlots[0])) {
      newSlots = [
        oldSlots[oldSlots.length - 1],
        ...oldSlots.slice(1, -1),
        oldSlots[0]
      ];
    }

    this._slots = [...newSlots];
    const newPositions = this._getSlotPathPositions(this.slots);
    return Promise.allSettled(this.slots
      .map((item, i) => item.setPathPos(newPositions[i])));
  }
  // #endregion ░░░░[Items]░░░░
  // #endregion ▄▄▄▄▄ PRIVATE METHODS ▄▄▄▄▄

  // #region ████████ PUBLIC METHODS ████████ ~
  // #region ░░░░░░░[Items]░░░░ Contained Item Management ░░░░░░░ ~
  // #region ========== Adding / Removing =========== ~
  async addDice(numDice = 1, type = undefined) {
    const newDice = [...Array(numDice)].map(() => new XDie({parent: this, type}));
    return this._distItems(this._getSlotsPlus(newDice));
  }
  async killItem(item) {
    this._distItems(this._getSlotsWithout(item));
    item.kill();
  }
  // #endregion _______ Adding / Removing _______
  // #endregion ░░░░[Items]░░░░
  // #endregion ▄▄▄▄▄ PUBLIC METHODS ▄▄▄▄▄

  /*DEVCODE*/
  // #region ████████ TEST METHODS: For Debugging & Development ████████ ~
  // #region ░░░░░░░[INITIALIZATION]░░░░ DB Container, Hiding & Showing Debug Data ░░░░░░░ ~
  static get DBCONTAINER() {
    return (this._DBCONTAINER = this._DBCONTAINER
      ?? $("#dbContainer")[0]
      ?? $("<div id=\"dbContainer\" class=\"db x-container\" />").appendTo(".vtt.game")[0]);
  }
  dbShow() {
    this.showAngles();
    this.dbUpdate();
  }
  dbHide() {
    this.hideAngles();
    this._isDBActive = false;
  }
  // #endregion ░░░░[INITIALIZATION]░░░░
  // #region ░░░░░░░ PING ░░░░░░░ ~
  static PING({x, y}, parentID, {radius = 20, color = "yellow"} = {}) {
    const [pingElem] = $(`<svg class="db" height="100%" width="100%">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${color}" stroke="none" />
    </svg>`)
      .appendTo(XCircle.DBCONTAINER)
      .children()
      .last();
    if (parentID) {
      const [parentContext] = $(parentID);
      ({x, y} = MotionPathPlugin.convertCoordinates(parentContext, XCircle.DBCONTAINER.elem, {x, y}));
    }
    gsap.set(pingElem, {xPercent: -50, yPercent: -50, transformOrigin: "50% 50%", x, y});
    gsap.to(pingElem, {
      opacity: 0.75,
      scale: 1,
      startAt: {
        opacity: 0.25,
        scale: 5
      },
      duration: 1,
      ease: "bounce",
      onComplete() {
        gsap.to(pingElem, {
          opacity: 1,
          scale: 0.25,
          duration: 10,
          delay: 5,
          ease: "sine"
        });
      }
    });
  }
  get ping() { return this.constructor.PING }
  // #endregion ░░░░[PING]░░░░
  // #region ░░░░░░░[ANGLE DISPLAY]░░░░ Display Angle & Path Position on Circle ░░░░░░░ ~
  get angleGuide() { return (this._angleGuide = this._angleGuide ?? {}) }
  showAngles(numGuides = 4, isShowingAll = false) {
    [this._dbAngleContainer] = $(`
    <svg height="100%" width="100%">
      <circle id="db-${this.id}" class="db snap-circle" cx="${this.radius}" cy="${this.radius}" r="${this.radius * 1.25}" fill="none" stroke="none" />
    </svg>
    `).appendTo(XCircle.DBCONTAINER);
    gsap.set(this._dbAngleContainer, {xPercent: -50, yPercent: -50, x: this.x, y: this.y});
    MotionPathPlugin.convertToPath(`#db-${this.id}`);
    this._dbAnglePath = MotionPathPlugin.getRawPath(`#db-${this.id}`);
    MotionPathPlugin.cacheRawPathMeasurements(this._dbAnglePath);
    const makeMarker = (ang, isVerbose = true) => {
      // const pathPos = gsap.utils.normalize(0, 360, ang);
      const pathPos = Math.round(100 * gsap.utils.normalize(-180, 180, ang)) / 100;
      const {x, y, angle: pathAngle} = MotionPathPlugin.getPositionOnPath(this._dbAnglePath, pathPos, true);
      [this.angleGuide[ang]] = $(
        isVerbose
          ? `<div class="db angle-marker">${parseInt(pathAngle)}<br>${pathPos}</div>`
          : `<div class="db angle-marker small-marker">${parseInt(pathAngle)}</div>`
      ).appendTo(this.elem);
      gsap.set(this.angleGuide[ang], {x, y, xPercent: -50, yPercent: -50, rotation: -1 * this.rotation});
    };
    this.hideAngles();
    if (isShowingAll) {
      [...Array(numGuides)]
        .map((_, i) => gsap.utils.mapRange(0, numGuides, -180, 180, i))
        .forEach((angle) => makeMarker(angle, true));
    } else {
      makeMarker(0, false);
    }
  }
  hideAngles() { $(`#${this.id} .angle-marker`).remove() }
  // #endregion ░░░░[ANGLE DISPLAY]░░░░
  // #region ░░░░░░░[CONSOLE GETTERS]░░░░ Data Retrieval via Console Command ░░░░░░░ ~
  getPathReport() {
    const pathData = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((pathPos) => {
      const {x, y, angle} = MotionPathPlugin.getPositionOnPath(this.snap.path, pathPos, true);
      const convCoords = this.alignLocalPointTo(XElem.CONTAINER, {x, y});
      return {
        pos: {x: parseInt(x), y: parseInt(y)},
        convPos: {x: parseInt(convCoords.x), y: parseInt(convCoords.y)},
        angle: parseInt(angle),
        pathPos
      };
    });
    console.log(pathData);
  }
  // #endregion ░░░░[CONSOLE GETTERS]░░░░
  // #endregion ▄▄▄▄▄ TEST METHODS ▄▄▄▄▄
  /*!DEVCODE*/
}