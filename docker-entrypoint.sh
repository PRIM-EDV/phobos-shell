#!/bin/sh

# Generate web environment
envsubst < /opt/phobos-shell/apps/frontend/public/federation.manifest.template.json > /opt/phobos-shell/apps/frontend/public/federation.manifest.json
envsubst < /opt/phobos-shell/apps/frontend/public/js/env.template.js > /opt/phobos-shell/apps/frontend/public/js/env.js
cd "/opt/phobos-shell/apps/backend" && npm run start
