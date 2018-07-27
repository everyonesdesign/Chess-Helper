const fs = require('fs');
const browserify = require('browserify');

// Create a write stream for the pipe to output to
const bundleFs = fs.createWriteStream('app/build.js');

const b = browserify({standalone: 'nodeModules'});
b.add('app/src/index.js');
b.bundle().pipe(bundleFs);
