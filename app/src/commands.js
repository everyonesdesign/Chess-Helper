const {
  postMessage,
} = require('./utils');

const commands = {
  blindfold: () => {
    document.body.classList.toggle('ccHelper-docBody--blindfolded');
  },
  resign: () => {
    const resignButton = document.querySelector('.resign-button-component');
    resignButton && resignButton.click();
  },
  draw: () => {
    const drawButton = document.querySelector('.draw-button-component');
    drawButton && drawButton.click();
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
