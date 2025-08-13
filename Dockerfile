FROM node:24.1.0-slim AS deps
RUN apt update && apt install python3 build-essential gettext -y

WORKDIR /opt/phobos-shell

COPY package*.json ./
COPY lerna*.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY libs ./libs

RUN npm install

# Build frontend
FROM deps AS frontend

COPY apps/frontend ./apps/frontend
RUN npx lerna run build --scope @phobos-shell/frontend --include-dependencies

# Build backend
FROM deps AS backend

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