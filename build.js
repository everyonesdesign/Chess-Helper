const fs = require('fs');

fs.readFile('app/scripts/contentscript.js', 'utf8', (error, contentScript) => {
  if (error) {
    return console.log(error);
  }

  fs.readFile('app/scripts/keyboard-helper.js', 'utf8', (error, keyboardScript) => {
    if (error) {
      return console.log(error);
    }

    const replacement = `(function () {${keyboardScript}})();`;
    const content = contentScript.replace('%%s%%', replacement);
    fs.writeFile('app/build.js', content, (err) => {
      if (err) {
        return console.log(err);
      }

      console.log('Success!');
    });
  });
});
