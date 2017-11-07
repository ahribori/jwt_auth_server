import React from 'react';
import { connect } from 'react-redux';
import * as auth from '../ducks/Auth';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    handleLoginRequest = () => {
        this.props.loginRequest(
            this.state.username,
            this.state.password,
        ).then(() => {
            const success = this.props.login.success;
            const token = this.props.login.response.data;
            if (success) {
                this.setToken(token);
            }
        })
    };

    setToken = (token) => {
        document.cookie = `access_token=${token};`;
        if (window.localStorage) {
            window.localStorage.setItem('access_token', token);
        }
    };

    getToken = () => {

    };

    clearToken = () => {
        console.log(document.cookie);
    };

    componentDidMount() {
        this.clearToken();
    }

    handleChange = e => {
        switch (e.target.name) {
            case 'username':
                return this.setState({ username: e.target.value });
            case 'password':
                return this.setState({ password: e.target.value });
            default:
        }
    };

    handleSubmit = e => {
        this.handleLoginRequest();
    };

    handleKeyPress = e => {
        if (e.charCode === 13) {
            this.handleLoginRequest();
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
                       style={inputStyle} />
                <label>password</label>
                <input type="password"
                       name="password"
                       value={this.state.password}
                       onChange={this.handleChange}
                       onKeyPress={this.handleKeyPress}
                       style={inputStyle} />
                <button onClick={this.handleSubmit}>Login</button>
            </div>
        );
    };

    render() {
        return this._renderLoginForm()
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.auth.get('login')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (username, password) => {
            return dispatch(auth.login(username, password))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);