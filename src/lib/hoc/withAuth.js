import React from 'react';
import { connect } from 'react-redux';
import cookie from 'browser-cookies';
import * as auth from '../../ducks/Auth';

const mapStateToProps = (state) => {
    return {
        login: state.auth.get('login'),
        verify: state.auth.get('verify'),
        user: state.auth.get('user'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (username, password) => dispatch(auth.login(username, password)),
        verifyRequest: token => dispatch(auth.verify(token)),
        getUserRequest: (_id, token) => dispatch(auth.getUser(_id, token)),
    };
};

export default WrappedComponent => connect(mapStateToProps, mapDispatchToProps)(class withAuth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            auth: {
                user: null,
                token: null,
            },
        };
    }

    async componentDidMount() {
        const isLoggedIn = await this.isLoggedIn();
        const token = this.getToken();
        if (isLoggedIn) {
            const { _id } = this.props.verify.response.data;
            const user = await this.getUser(_id, token);
            this.setState({
                isLoggedIn: true,
                auth: {
                    user,
                    token,
                },
            });
        }
    }

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

    render() {
        const {
            login,
            verify,
            user,
            loginRequest,
            verifyRequest,
            getUserRequest,
            ...props
        } = this.props;

        if (!this.state.isLoggedIn) {
            return 'Loading...';
        }
        return (
            <WrappedComponent {...this.state} {...props} />
        );
    }
});

