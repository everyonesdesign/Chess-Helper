const {
  postMessage,
} = require('./utils');

const commands = {
  blindfold: () => {
    document.body.classList.toggle('ccHelper--blindfolded');
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
