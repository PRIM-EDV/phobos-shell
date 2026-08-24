const LSX_SERVER_HOSTNAME = window?.__env?.LSX_SERVER_HOSTNAME || window.location.hostname;
const LSX_SERVER_PORT = window?.__env?.LSX_SERVER_PORT || 3002;

const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss' : 'ws';
const WS_URL = `${WS_PROTOCOL}://${LSX_SERVER_HOSTNAME}:${LSX_SERVER_PORT}/api`;

export const LsxGatewayConfig = {
    defaultApiUrl: WS_URL
};
