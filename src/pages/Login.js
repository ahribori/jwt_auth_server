import React from 'react';
import {connect} from 'react-redux';
import * as auth from '../ducks/Auth';
import cookie from 'browser-cookies';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            username: '',
            password: '',
        };
    }

    login = async (username, password) => {
        // request login
        await this.props.loginRequest(username, password);
        // then
        const success = this.props.login.success;
        const token = this.props.login.response.data;
        if (success) {
            this.setToken(token);
            this.setState({
                isLoggedIn: true,
            })
        } else {
            console.error(this.props.login.response.data.message);
        }
    };

    logout = () => {
        this.clearToken();
        this.setState({
            isLoggedIn: false,
        })
    };

    setToken = (token) => {
        cookie.set('access_token', token);
        if (window.localStorage) {
            window.localStorage.setItem('access_token', token);
        }
    };

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

    clearToken = () => {
        if (window.localStorage) {
            window.localStorage.removeItem('access_token');
        }
        cookie.erase('access_token');
    };

    verifyToken = async token => {
        await this.props.verifyRequest(token);
        return this.props.verify;
    };

    getUser = async (_id, token) => {
        await this.props.getUserRequest(_id, token);
        return this.props.user.response.data;
    };

    isLogin = async () => {
        const token = this.getToken();
        if (!token) {
            return false;
        } else {
            const verify = await this.verifyToken(token);
            return verify.success;
        }
    };

    async componentDidMount() {
        const token = this.getToken();
        if (token) {
            this.setState({
                isLoggedIn: true,
            })
        }
        const isLogin = await this.isLogin();
        if (isLogin) {
            this.setState({
                isLoggedIn: true,
            })
        } else {
            this.setState({
                isLoggedIn: false,
            })
        }
    }

    handleChange = e => {
        switch (e.target.name) {
            case 'username':
                return this.setState({username: e.target.value});
            case 'password':
                return this.setState({password: e.target.value});
            default:
        }
    };

    handleSubmit = e => {
        if (!this.state.isLoggedIn) {
            this.login(this.state.username, this.state.password);
        } else {
            this.logout();
        }
    };

    handleKeyPress = e => {
        if (e.charCode === 13) {
            this.login(this.state.username, this.state.password);
        }
    };

    _renderLoginForm = () => {
        const containerStyle = {
            width: '200px',
            margin: '0 auto'
        };

        const inputStyle = {
            display: 'block',
            margin: '0.5rem'
        };

        return (
            <div style={containerStyle}>
                <label>username</label>
                <input type="text"
                       name="username"
                       value={this.state.username}
                       onChange={this.handleChange}
                       onKeyPress={this.handleKeyPress}
                       style={inputStyle}/>
                <label>password</label>
                <input type="password"
                       name="password"
                       value={this.state.password}
                       onChange={this.handleChange}
                       onKeyPress={this.handleKeyPress}
                       style={inputStyle}/>
                <button onClick={this.handleSubmit}>{this.state.isLoggedIn ? 'Logout' : 'Login'}</button>
            </div>
        );
    };

    render() {
        return this._renderLoginForm()
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.auth.get('login'),
        verify: state.auth.get('verify'),
        user: state.auth.get('user'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (username, password) => {
            return dispatch(auth.login(username, password))
        },
        verifyRequest: token => {
            return dispatch(auth.verify(token))
        },
        getUserRequest: (_id, token) => {
            return dispatch(auth.getUser(_id, token))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);