// set app environment
const manifest = chrome.runtime.getManifest();
const envScript = document.createElement('script');
envScript.innerHTML = `
  window.chessHelper__environment = {
    version: "${manifest.version}",
  };
`;
document.body.appendChild(envScript);


/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} filePath Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 */
function injectScript(filePath, tag) {
    const node = document.getElementsByTagName(tag)[0];
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', filePath);
    node.appendChild(script);
}

injectScript(chrome.extension.getURL('build.js'), 'body');
