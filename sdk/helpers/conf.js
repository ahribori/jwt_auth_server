const sdk = process.env.sdk || {};

const globalName = sdk.global_name;
const globalObjectName = `${globalName ? `${globalName}_` : ''}AUTH_SDK`;
const serverOrigin = sdk.server_origin;

if (!serverOrigin) {
    throw new Error('serverOrigin not defined');
}

export default {
    globalName,
    globalObjectName,
    serverOrigin,
};
