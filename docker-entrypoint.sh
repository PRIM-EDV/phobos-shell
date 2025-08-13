#!/bin/sh

# Generate web environment
envsubst < /opt/phobos-shell/apps/backend/public/federation.manifest.template.json > /opt/phobos-shell/apps/backend/public/federation.manifest.json
envsubst < /opt/phobos-shell/apps/backend/public/js/env.template.js > /opt/phobos-shell/apps/backend/public/js/env.js

# Start the application
cd "/opt/phobos-shell/apps/backend" && npm run start
