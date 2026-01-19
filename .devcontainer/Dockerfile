FROM node:24.1.0-slim as deps
RUN apt update && apt install python3 build-essential protobuf-compiler git -y

WORKDIR /workspace

COPY package*.json ./
COPY lerna*.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY libs ./libs

# Provide mirrord for k8s development
RUN curl -fsSL https://raw.githubusercontent.com/metalbear-co/mirrord/main/scripts/install.sh | bash

RUN npm install