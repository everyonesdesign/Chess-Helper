/// <reference types="cypress" />

const extensionLoader = require('cypress-browser-extension-plugin/loader');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('before:browser:launch', async (browser = {}, launchOptions) => {
    const loader = extensionLoader.load({
      source: './app',
      alias: 'ChessHelper',
    });

    const args = await loader(browser, []);
    launchOptions.args.push(...args);
    return launchOptions;
  });
};
