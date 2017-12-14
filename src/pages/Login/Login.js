import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import { withAuth, sdkMiddleWare } from '../../lib/hoc';

@withAuth
@sdkMiddleWare
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
        const token = this.props.getToken();
        if (token) {
            const isLogin = await this.props.isLoggedIn();
            if (isLogin) {
                this.setState({
                    isLoggedIn: true,
                });
            }
        }
    }

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
            this.props.setToken(token);
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
            this.props.logout();
        }
    };

    handleKeyPress = (e) => {
        if (e.charCode === 13) {
            this.login(this.state.username, this.state.password);
        }
    };

    renderLoginForm = () => {
        const containerStyle = {
            width: '500px',
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
            <Card style={containerStyle} className="container-small">
                <CardTitle title="로그인" subtitle="아리보리 계정 사용" />
                <CardText>
                    <form>
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
                            autoComplete="off"
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
                    </form>
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
                <div className="link">
                    <Link to="/join">아직 계정이 없으신가요?</Link>
                </div>
            </Card>
        );
    };

    render() {
        if (this.state.isLoggedIn) {
            if (this.props.sdk) {
                const app = this.props.application.response.data;
                const token = this.props.getToken();
                const callbackUrl = `${app.callback_url}?t=${btoa(token)}`;
                window.location.replace(callbackUrl);
                return '';
            }
            return <Redirect to="/" />;
        }
        return this.renderLoginForm();
    }
}

export default Login;
