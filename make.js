const fs = require('fs');

fs.readFile('app/src/index.js', 'utf8', (error, source) => {
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
