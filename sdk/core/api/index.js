import api1_0 from './v1.0';
import log from '../../helpers/log';

const API = {
    1.0: api1_0,
};

const getAPI = (version = 1.0) => {
    const api = API[Number(version)];
    if (!api) {
        log.error(`v${version} API는 존재하지 않습니다`);
    }
    return api;
};

export default getAPI;
