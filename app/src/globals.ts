// boards for certain elements
export const boards = new WeakMap;

// we store areas and arrows we've drawn,
// if we don't remember it later on
// it will be really tricky to clear it
export const drawCache = new WeakMap;

// elements hidden from screen readers
export const ariaHiddenElements = new WeakMap;

// blindfold overlays
export const blindfoldOverlays = new WeakMap;
