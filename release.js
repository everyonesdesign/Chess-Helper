const fs = require('fs')

const MANIFEST_LOCATION = './app/manifest.json';
const manifest = require(MANIFEST_LOCATION);

const oldVersion = manifest.version;

console.log('Releasing Keyboard for Chess.com!');
console.log(`Old version was ${oldVersion}`);

let [major, minor, patch] = oldVersion.split('.').map(i => parseInt(i));

if (process.argv.includes('--major')) {
  console.log('Major release');
  major++;
  minor = 0;
  patch = 0
} else if (process.argv.includes('--patch')) {
  console.log('Patch release');
  patch++;
} else {
  console.log('Minor release');
  patch = 0;
  minor++;
}

const newVersion = `${major}.${minor}.${patch}`;
console.log(`New version is ${newVersion}`);

console.log('Rewriting manifest file...');

const data = fs.readFileSync(MANIFEST_LOCATION, 'utf8');
const newContents = data.replace(/"version": "\d+.\d+.\d+"/, `"version": "${newVersion}"`);
fs.writeFileSync(MANIFEST_LOCATION, newContents, 'utf8');

console.log('Success!');

console.log('');
console.log('Use the following command to commit the new release:');
console.log(`git add .; git commit -m "v. ${newVersion}"`);

console.log('');
console.log('Use the following command to create a for the release:');
console.log(`git add tag ${newVersion} -a`);

console.log('');
console.log('Use the following command to push the changes:');
console.log('git push --follow-tags');
