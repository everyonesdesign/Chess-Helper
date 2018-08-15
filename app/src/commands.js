const {
  postMessage,
} = require('./utils');
const {
  sendDataToAnalytics,
} = require('./analytics');

const commands = {
  blindfold: () => {
    document.body.classList.toggle('ccHelper-docBody--blindfolded');
    sendDataToAnalytics({
      category: 'command',
      action: 'activate',
      label: 'blindfold',
    });
  },
  resign: () => {
    const resignButton = document.querySelector('.resign-button-component');
    resignButton && resignButton.click();
    sendDataToAnalytics({
      category: 'command',
      action: 'activate',
      label: 'resign',
    });
  },
  draw: () => {
    const drawButton = document.querySelector('.draw-button-component');
    drawButton && drawButton.click();
    sendDataToAnalytics({
      category: 'command',
      action: 'activate',
      label: 'draw',
    });
  },
};

/**
 * Parse command text (or return null if not a command)
 * @param  {String} input
 * @return {Function?} - body of the found command
 */
function parseCommand(input) {
  if (input[0] === '/') {
    const command = commands[input.slice(1)];
    return command || (() => {
      postMessage(`Can't find command ${input}`);
    });
  }

  return null;
}

module.exports = {
  commands,
  parseCommand,
};
