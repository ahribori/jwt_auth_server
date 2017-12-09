import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import withAuth from '../../lib/hoc/withAuth';

@withAuth
class Join extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            username: '',
            password: '',
            passwordConfirm: '',
            nickname: '',
            email: '',
            usernameErrorText: '',
            passwordErrorText: '',
            passwordConfirmErrorText: '',
            nicknameErrorText: '',
            emailErrorText: '',
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

    join = async () => {
        const {
            username,
            password,
            passwordConfirm,
            nickname,
            email,
        } = this.state;

        this.setState({
            usernameErrorText: '',
            passwordErrorText: '',
            passwordConfirmErrorText: '',
            nicknameErrorText: '',
            emailErrorText: '',
        });

        if (username === '') {
            this.setState({
                usernameErrorText: '계정을 입력하세요',
            });
            this.usernameInput.focus();
            return;
        }
        if (password === '') {
            this.setState({
                usernameErrorText: '',
                passwordErrorText: '패스워드를 입력하세요',
            });
            this.passwordInput.focus();
            return;
        }
        if (password === '') {
            this.setState({
                usernameErrorText: '',
                passwordErrorText: '',
                passwordConfirmErrorText: '패스워드를 다시 입력하세요',
            });
            this.passwordConfirmInput.focus();
            return;
        }
        if (password !== passwordConfirm) {
            this.setState({
                usernameErrorText: '',
                passwordErrorText: '',
                passwordConfirmErrorText: '패스워드가 일치하지 않습니다',
                passwordConfirm: '',
            });
            this.passwordConfirmInput.focus();
            return;
        }
        if (nickname === '') {
            this.setState({
                usernameErrorText: '',
                passwordErrorText: '',
                passwordConfirmErrorText: '',
                nicknameErrorText: '닉네임을 입력하세요',
            });
            this.nicknameInput.focus();
            return;
        }

        await this.props.joinRequest(
            username,
            password,
            nickname,
            email,
        );

        if (!this.props.join.success) {
            const { field, message } = this.props.join.response.data;
            this.setState({
                usernameErrorText: '',
                passwordErrorText: '',
                passwordConfirmErrorText: '',
                nicknameErrorText: '',
                emailErrorText: '',
                [`${field}ErrorText`]: message,
                [`${field}`]: '',
            });
            if (this[`${field}Input`]) {
                this[`${field}Input`].focus();
            }
        }

        await this.props.loginRequest(username, password);
        await this.props.isLoggedIn();
        const { success } = this.props.login;
        const token = this.props.login.response.data;
        if (success) {
            this.props.setToken(token);
            this.setState({
                isLoggedIn: true,
            });
        } else {
            console.error(this.props.login.response.data.message);
        }
    };

    handleChange = (e) => {
        switch (e.target.name) {
            case 'username':
                return this.setState({ username: e.target.value });
            case 'password':
                return this.setState({ password: e.target.value });
            case 'passwordConfirm':
                return this.setState({ passwordConfirm: e.target.value });
            case 'nickname':
                return this.setState({ nickname: e.target.value });
            case 'email':
                return this.setState({ email: e.target.value });
            default:
        }
        return null;
    };

    handleSubmit = () => {
        this.join();
    };

    handleKeyPress = (e) => {
        if (e.charCode === 13) {
            this.join();
        }
    };

    renderJoinForm = () => {
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
                <CardTitle title="계정 만들기" subtitle="아리보리 계정 만들기"/>
                <CardText>
                    <TextField
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        floatingLabelText="계정"
                        style={inputStyle}
                        fullWidth
                        ref={(ref) => {
                            this.usernameInput = ref;
                        }}
                        errorText={this.state.usernameErrorText}
                    />
                    <TextField
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        floatingLabelText="패스워드"
                        style={inputStyle}
                        fullWidth
                        ref={(ref) => {
                            this.passwordInput = ref;
                        }}
                        errorText={this.state.passwordErrorText}
                    />
                    <TextField
                        type="password"
                        name="passwordConfirm"
                        value={this.state.passwordConfirm}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        floatingLabelText="패스워드 확인"
                        style={inputStyle}
                        fullWidth
                        ref={(ref) => {
                            this.passwordConfirmInput = ref;
                        }}
                        errorText={this.state.passwordConfirmErrorText}
                    />
                    <TextField
                        type="text"
                        name="nickname"
                        value={this.state.nickname}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        floatingLabelText="닉네임"
                        style={inputStyle}
                        fullWidth
                        ref={(ref) => {
                            this.nicknameInput = ref;
                        }}
                        errorText={this.state.nicknameErrorText}
                    />
                    <TextField
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        floatingLabelText="이메일"
                        style={inputStyle}
                        fullWidth
                        ref={(ref) => {
                            this.emailInput = ref;
                        }}
                        errorText={this.state.emailErrorText}
                    />
                </CardText>
                <CardActions>
                    <RaisedButton
                        onClick={this.handleSubmit}
                        onKeyPress={this.handleKeyPress}
                        fullWidth
                        label="계정 만들기"
                        primary
                        style={buttonStyle}
                    />
                </CardActions>
                <div className="link">
                    <Link to="/">이미 계정이 있으신가요?</Link>
                </div>
            </Card>
        );
    };

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to="/"/>;
        }
        return this.renderJoinForm();
    }
}

export default Join;
