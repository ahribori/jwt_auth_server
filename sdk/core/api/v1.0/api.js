export default class API {
    constructor() {
        console.log('API 1.0 constructor');
        return {
            getToken: this.getToken,
            setToken: this.setToken,
        };
    }

    getToken = () => {
        console.log('getToken');
    };

    setToken = () => {
        console.log('setToken');
    };
}
