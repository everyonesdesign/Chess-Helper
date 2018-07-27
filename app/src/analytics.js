/**
 * Init google analytics for the app
 */
function initAnalytics() {
  /* eslint-disable */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','cchGa');
  /* eslint-enable */

  window.cchGa('create', 'UA-110216390-1', 'auto', 'chessHelper');
  sendDataToAnalytics({
    category: 'init',
    action: 'init',
  });
}

/**
 * There is a tricky layout bug: https://trello.com/c/aT95jsv5
 * Fixing it may require applying changes to the layout of the app
 * It's better to avoid this changes
 *
 * This function allows to register amount of such bug events
 * and will help us decide whether we need to fix that
 */
function sendLayoutOverlappingStatus() {
  const isLive = !!document.getElementById('live-app');
  if (!isLive) return;

  const input = document.getElementById('ccHelper-input');
  const board = document.querySelector('.chessboard');
  const inputRect = input.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const isOverlapping = (boardRect.top + boardRect.height + 40) > inputRect.top;

  sendDataToAnalytics({
    category: 'layout-bug-aT95jsv5',
    action: 'view',
    label: String(isOverlapping),
  });
}

/**
 * Send data to google analytics to make the extension better
 * @param  {String} category
 * @param  {String} action
 */
function sendDataToAnalytics({category, action, label}) {
  try {
    window.cchGa('chessHelper.send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
    });
  } catch (e) {}
}

module.exports = {
  initAnalytics,
  sendLayoutOverlappingStatus,
  sendDataToAnalytics,
};
