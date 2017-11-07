import React from 'react';

class Join extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            nickname: '',
            email: '',
        };
    }

    handleChange = e => {
        switch (e.target.name) {
            case 'username':
                return this.setState({ username: e.target.value });
            case 'password':
                return this.setState({ password: e.target.value });
            case 'nickname':
                return this.setState({ nickname: e.target.value });
            case 'email':
                return this.setState({ email: e.target.value });
            default:
        }
    };

    handleSubmit = e => {
        console.log(this.state)
    };

    _renderJoinForm = () => {
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
                <label>nickname</label>
                <input type="text" name="nickname" value={this.state.nickname} onChange={this.handleChange}
                       style={inputStyle} />
                <label>email</label>
                <input type="email" name="email" value={this.state.email} onChange={this.handleChange}
                       style={inputStyle} />
                <button onClick={this.handleSubmit}>Join</button>
            </div>
        );
    };

    render() {
        return this._renderJoinForm()
    }
}

export default Join;