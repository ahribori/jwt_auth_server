import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import cookie from 'browser-cookies';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import { connect } from 'react-redux';
import * as auth from '../ducks/Auth';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            username: '',
            password: '',
            usernameErrorText: '',
            passwordErrorText: '',
        };
    }

    async componentDidMount() {
        const token = this.getToken();
        if (token) {
            const isLogin = await this.isLogin();
            if (isLogin) {
                this.setState({
                    isLoggedIn: true,
                });
            }
        }
    }

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

    getUser = async (_id, token) => {
        await this.props.getUserRequest(_id, token);
        return this.props.user.response.data;
    };

    verifyToken = async (token) => {
        await this.props.verifyRequest(token);
        return this.props.verify;
    };

    clearToken = () => {
        if (window.localStorage) {
            window.localStorage.removeItem('access_token');
        }
        cookie.erase('access_token');
    };

    login = async (username, password) => {
        if (username === '') {
            this.setState({
                usernameErrorText: '계정을 입력하세요',
            });
            this.usernameInput.focus();
            return;
        }
        if (password === '') {
            this.setState({
                passwordErrorText: '패스워드를 입력하세요',
            });
            this.passwordInput.focus();
            return;
        }
        // request login
        await this.props.loginRequest(username, password);
        // then
        const { success } = this.props.login;
        const token = this.props.login.response.data;
        if (success) {
            this.setToken(token);
            this.setState({
                isLoggedIn: true,
            });
        } else {
            const response = this.props.login.response.data;
            switch (response.errorCode) {
                case 'AUTH_E0404':
                    this.setState({
                        usernameErrorText: response.message,
                        username: '',
                    });
                    this.usernameInput.focus();
                    break;
                case 'AUTH_E0403':
                    this.setState({
                        passwordErrorText: response.message,
                        password: '',
                    });
                    this.passwordInput.focus();
                    break;
                default:
            }
        }
    };

    logout = () => {
        this.clearToken();
        this.setState({
            isLoggedIn: false,
        });
    };

    isLogin = async () => {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        const verify = await this.verifyToken(token);
        return verify.success;
    };

    handleChange = (e) => {
        switch (e.target.name) {
            case 'username':
                if (this.state.usernameErrorText !== '' && e.target.value !== '') {
                    this.setState({
                        usernameErrorText: '',
                    });
                }
                return this.setState({ username: e.target.value });
            case 'password':
                if (this.state.passwordErrorText !== '' && e.target.value !== '') {
                    this.setState({
                        passwordErrorText: '',
                    });
                }
                return this.setState({ password: e.target.value });
            default:
        }
        return null;
    };

    handleSubmit = () => {
        if (!this.state.isLoggedIn) {
            this.login(this.state.username, this.state.password);
        } else {
            this.logout();
        }
    };

    handleKeyPress = (e) => {
        if (e.charCode === 13) {
            this.login(this.state.username, this.state.password);
        }
    };

    _renderLoginForm = () => {
        const containerStyle = {
            width: '500px',
            margin: '0 auto',
            padding: '48px 40px 36px 40px',
        };

        const inputStyle = {
            display: 'block',
            margin: '0 auto',
        };

        const buttonStyle = {
            marginTop: '2rem',
        };

        return (
            <Card style={containerStyle} className="login container">
                <CardTitle title="로그인" subtitle="아리보리 계정 사용" />
                <CardText>
                    <TextField
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        floatingLabelText="계정"
                        errorText={this.state.usernameErrorText}
                        fullWidth
                        style={inputStyle}
                        ref={(ref) => {
                            this.usernameInput = ref;
                        }}
                    />
                    <TextField
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        floatingLabelText="패스워드"
                        errorText={this.state.passwordErrorText}
                        fullWidth
                        style={inputStyle}
                        ref={(ref) => {
                            this.passwordInput = ref;
                        }}
                    />
                </CardText>
                <CardActions>
                    <RaisedButton
                        onClick={this.handleSubmit}
                        fullWidth
                        label={this.state.isLoggedIn ? '로그아웃' : '로그인'}
                        primary
                        style={buttonStyle}
                    />
                </CardActions>
                <div className="login link">
                    <Link to="/join">아직 계정이 없으신가요?</Link>
                </div>
            </Card>
        );
    };

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to="/" />;
        }
        return this._renderLoginForm();
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
