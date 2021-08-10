/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('before:browser:launch', async (browser = {}, launchOptions) => {
    launchOptions.extensions.push(`${config.projectRoot}/app`);
    return launchOptions;
  });
};
