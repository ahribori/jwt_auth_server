import React from 'react';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
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
        console.log(this.state)
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
                <input type="text" name="username" value={this.state.username} onChange={this.handleChange}
                       style={inputStyle} />
                <label>password</label>
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange}
                       style={inputStyle} />
                <button onClick={this.handleSubmit}>Login</button>
            </div>
        );
    };

    render() {
        return this._renderLoginForm()
    }
}

export default Login;