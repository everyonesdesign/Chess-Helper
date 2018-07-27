/**
 * Is user holding Ctrl (on PC) or Cmd (on Mac)
 * @param {Event} e
 * @return {Boolean}
 */
function holdingCtrlOrCmd(e) {
  if (navigator.platform === 'MacIntel') {
    return e.metaKey;
  }

  return e.ctrlKey;
}

/**
 * Write some message to the user
 * @param {String} text - text of the message
 */
function postMessage(text) {
  const messagesContainer = document.getElementById('ccHelper-messages');
  const message = document.createElement('div');
  message.className = 'ccHelper-messagesItem';
  message.textContent = text;
  messagesContainer.appendChild(message);

  setTimeout(() => {
    messagesContainer.removeChild(message);
  }, 3000);
}

module.exports = {
  holdingCtrlOrCmd,
  postMessage,
};
