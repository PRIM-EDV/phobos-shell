FROM node:24.1.0-slim AS package.json
RUN apt-get update && apt-get install -y jq

WORKDIR /opt/phobos-shell

COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

RUN jq 'del(.version)' package.json > package.json.slim && mv package.json.slim package.json
RUN jq 'del(.version)' apps/backend/package.json > apps/backend/package.json.slim && mv apps/backend/package.json.slim apps/backend/package.json
RUN jq 'del(.version)' apps/frontend/package.json > apps/frontend/package.json.slim && mv apps/frontend/package.json.slim apps/frontend/package.json


FROM node:24.1.0-slim AS modules
RUN apt update && apt install python3 protobuf-compiler build-essential gettext -y

WORKDIR /opt/phobos-shell

COPY --from=package.json /opt/phobos-shell ./

COPY lerna*.json ./
COPY libs ./libs

RUN npm install

# Build frontend
FROM modules AS frontend

COPY apps/frontend ./apps/frontend
RUN npx lerna run build --scope @phobos-shell/frontend --include-dependencies

# Build backend
FROM modules AS backend

COPY apps/backend ./apps/backend
RUN npx lerna run build --scope @phobos-shell/backend --include-dependencies

# Final image
FROM backend

WORKDIR /opt/phobos-shell
COPY --from=frontend /opt/phobos-shell/apps/frontend/dist/phobos-shell/browser ./apps/backend/public

# Run startscript
COPY ./docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]