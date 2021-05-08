// set app environment
const manifest = chrome.runtime.getManifest();
const envScript = document.createElement('script');
envScript.innerHTML = `
  window.chessHelper__environment = {
    version: "${manifest.version}",
    defaultLocale: "${manifest.default_locale}",
  };
`;

(document.head||document.documentElement).prepend(envScript);

/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} filePath Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 */
function injectScript(filePath) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', filePath);
  (document.head||document.documentElement).prepend(script);
}

injectScript(chrome.extension.getURL('build.js'));
