const { execSync } = require('child_process');
const pkg = require('../package.json');

const image = `prim/phobos-shell:${pkg.version}`;
const latest = `prim/phobos-shell:latest`;

console.log(`Building Docker image: ${image}...`);
execSync(`docker build -t ${image} -t ${latest} .`, { stdio: 'inherit' });