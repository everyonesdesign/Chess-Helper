module.exports = {
  // we store areas and arrows we've drawn,
  // if we don't remember it later on
  // it will be really tricky to clear it
  drawCache: new WeakMap,
};
