FROM node:24.1.0-slim AS deps
RUN apt update && apt install python3 build-essential -y

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
COPY --from=frontend /opt/phobos-shell/apps/frontend/dist/phobos-shell/browser ./dist/public

# Run startscript
COPY ./docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]

# # RUN npm run proto:generate
# RUN npm run build

# FROM node:22.14.0 AS server
# ENV TZ="Europe/Berlin"

# # RUN apt update && apt install protobuf-compiler -y

# EXPOSE 3100
# WORKDIR /opt/auth/backend

# # Install server source dependancies
# COPY ./backend/*.json ./
# RUN npm install

# # Build server
# COPY ./backend/src ./src
# # COPY ./backend/lib ./lib
# # COPY ./protocol ../protocol

# # RUN npm run proto:generate

# # Get webapp artifact
# COPY --from=frontend /opt/auth/frontend/dist/phobos-auth/browser ./dist/public

# # Run startscript
# CMD npm run start