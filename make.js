const fs = require('fs');
const browserify = require('browserify');

// Create a write stream for the pipe to output to
const bundleFs = fs.createWriteStream('app/build.js');

const b = browserify({standalone: 'nodeModules'});
b.add('app/src/index.js');
b.bundle().pipe(bundleFs);

bundleFs.on('finish', function() {
  fs.readFile('app/build.js', 'utf8', (error, source) => {
    if (error) {
      return console.log(error);
    }

    // escape backticks, so we can use them in the source
    // supports up to 2 layers of backticks
    // i.e. alert(`Hello, \` world!`);
    // this is a real magic 😈
    const escaped = source.replace(/(\\?)`/g, '\\$1$1`');

    const content = `
      const script = document.createElement('script');
      script.innerHTML = (\`${escaped}\`);
      window.addEventListener('load', () => {
        document.body.appendChild(script);
      });
    `;

    fs.writeFile('app/build.js', content, (err) => {
      if (err) {
        return console.log(err);
      }

      console.log('Success!');
    });
  });
});
