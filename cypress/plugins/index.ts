/// <reference types="../support" />

/**
 * @type {Cypress.PluginConfig}
 */
export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  on('before:browser:launch', async (_browser, launchOptions) => {
    launchOptions.extensions.push(`${config.projectRoot}/app`);
    return launchOptions;
  });
};
