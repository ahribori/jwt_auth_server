import React from 'react';
import {connect} from 'react-redux';
import * as auth from '../ducks/Auth';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardText, CardTitle} from 'material-ui/Card';
import {Link} from 'react-router-dom';

class Join extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            password_confirm: '',
            nickname: '',
            email: '',
        };
    }

    handleChange = e => {
        switch (e.target.name) {
            case 'username':
                return this.setState({username: e.target.value});
            case 'password':
                return this.setState({password: e.target.value});
            case 'password_confirm':
                return this.setState({password_confirm: e.target.value});
            case 'nickname':
                return this.setState({nickname: e.target.value});
            case 'email':
                return this.setState({email: e.target.value});
            default:
        }
    };

    handleSubmit = e => {
        this.props.joinRequest(
            this.state.username,
            this.state.password,
            this.state.nickname,
            this.state.email,
        )
    };

    _renderJoinForm = () => {
        const containerStyle = {
            width: '500px',
            margin: '0 auto',
            padding: '48px 40px 36px 40px'
        };

        const inputStyle = {
            display: 'block',
            margin: '0 auto'
        };

        const buttonStyle = {
            marginTop: '2rem'
        };

        return (
            <Card style={containerStyle} className="join container">
                <CardTitle title="계정 만들기" subtitle="아리보리 계정 만들기"/>
                <CardText>
                    <TextField
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        floatingLabelText="계정"
                        style={inputStyle}
                        fullWidth
                    />
                    <TextField
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        floatingLabelText="패스워드"
                        style={inputStyle}
                        fullWidth
                    />
                    <TextField
                        type="password"
                        name="password_confirm"
                        value={this.state.password_confirm}
                        onChange={this.handleChange}
                        floatingLabelText="패스워드 확인"
                        style={inputStyle}
                        fullWidth
                    />
                    <TextField
                        type="text"
                        name="nickname"
                        value={this.state.nickname}
                        onChange={this.handleChange}
                        floatingLabelText="닉네임"
                        style={inputStyle}
                        fullWidth
                    />
                    <TextField
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        floatingLabelText="이메일"
                        style={inputStyle}
                        fullWidth
                    />
                </CardText>
                <CardActions>
                    <RaisedButton
                        onClick={this.handleSubmit}
                        fullWidth
                        label='계정 만들기'
                        primary
                        style={buttonStyle}
                    />
                </CardActions>
                <div className="join link">
                    <Link to='/'>이미 계정이 있으신가요?</Link>
                </div>
            </Card>
        );
    };

    render() {
        return this._renderJoinForm()
    }
}

const mapStateToProps = (state) => {
    return {
        join: state.auth.get('join')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        joinRequest: (username, password, nickname, email) => {
            return dispatch(auth.join(username, password, nickname, email))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Join);