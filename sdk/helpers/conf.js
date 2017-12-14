const sdk = process.env.sdk || {};

const globalName = sdk.global_name;
const globalObjectName = `${globalName ? `${globalName}_` : ''}AUTH_SDK`;
const tokenStorageName = `${globalObjectName}_ACCESS_TOKEN`;
const serverOrigin = sdk.server_origin;

if (!serverOrigin) {
    throw new Error('serverOrigin not defined');
}

export default {
    globalName,
    globalObjectName,
    tokenStorageName,
    serverOrigin,
};
