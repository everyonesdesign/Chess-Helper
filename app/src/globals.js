module.exports = {
  // we store areas and arrows we've drawn,
  // if we don't remember it later on
  // it will be really tricky to clear it
  drawCache: new WeakMap,

  // store callbacks bound per board
  // now we only store callbacks connected with
  // redrawing
  boardsCallbacks: new WeakMap,

  // elements hidden from screen readers
  ariaHiddenElements: new WeakMap,

  // blindfold overlays
  blindfoldOverlays: new WeakMap,
};
