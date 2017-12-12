import React from 'react';
import { connect } from 'react-redux';
import cookie from 'browser-cookies';
import * as auth from '../../ducks/Auth';

const mapStateToProps = (state) => {
    return {
        join: state.auth.get('join'),
        login: state.auth.get('login'),
        verify: state.auth.get('verify'),
        user: state.auth.get('user'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        joinRequest: (username, password, nickname, email) => dispatch(auth.join(username, password, nickname, email)),
        loginRequest: (username, password) => dispatch(auth.login(username, password)),
        verifyRequest: token => dispatch(auth.verify(token)),
        getUserRequest: (_id, token) => dispatch(auth.getUser(_id, token)),
        logout: () => dispatch(auth.logout()),
    };
};

export default WrappedComponent => connect(mapStateToProps, mapDispatchToProps)(class needLoggedIn extends React.Component {
    getToken = () => {
        let token = null;
        if (window.localStorage) {
            token = window.localStorage.getItem('access_token');
        }
        if (!token) {
            token = cookie.get('access_token');
        }
        return token;
    };

    setToken = (token) => {
        cookie.set('access_token', token);
        if (window.localStorage) {
            window.localStorage.setItem('access_token', token);
        }
    };

    getUser = async (_id, token) => {
        await this.props.getUserRequest(_id, token);
        return this.props.user.response.data;
    };

    verifyToken = async (token) => {
        await this.props.verifyRequest(token);
        return this.props.verify;
    };

    isLoggedIn = async () => {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        const verify = await this.verifyToken(token);
        return verify.success;
    };

    clearToken = () => {
        if (window.localStorage) {
            window.localStorage.removeItem('access_token');
        }
        cookie.erase('access_token');
    };

    logout = () => {
        this.clearToken();
        this.props.logout();
    };

    render() {
        const newProps = {
            getToken: this.getToken,
            setToken: this.setToken,
            getUser: this.getUser,
            isLoggedIn: this.isLoggedIn,
            clearToken: this.clearToken,
            logout: this.logout,
        };

        return (
            <WrappedComponent {...newProps} {...this.props} logout={this.logout} />
        );
    }
});

