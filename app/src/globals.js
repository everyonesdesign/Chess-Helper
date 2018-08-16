module.exports = {
  // boards for certain elements
  boards: new WeakMap,

  // we store areas and arrows we've drawn,
  // if we don't remember it later on
  // it will be really tricky to clear it
  drawCache: new WeakMap,

  // elements hidden from screen readers
  ariaHiddenElements: new WeakMap,

  // blindfold overlays
  blindfoldOverlays: new WeakMap,
};
