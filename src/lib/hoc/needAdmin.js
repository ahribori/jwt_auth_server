import React from 'react';
import { connect } from 'react-redux';
import cookie from 'browser-cookies';
import { Redirect } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import {
    pinkA200 as loadingProgressColor,
    white as loadingFontColor,
} from 'material-ui/styles/colors';
import * as auth from '../../ducks/Auth';
import FullScreenNotification from '../../templates/FullScreenNotification';

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

export default WrappedComponent => connect(mapStateToProps, mapDispatchToProps)(class needAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: true,
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
                pending: false,
                isLoggedIn: true,
                auth: {
                    user,
                    token,
                },
            });
        } else {
            this.setState({
                pending: false,
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

    clearToken = () => {
        if (window.localStorage) {
            window.localStorage.removeItem('access_token');
        }
        cookie.erase('access_token');
    };

    logout = () => {
        this.clearToken();
        this.setState({
            isLoggedIn: false,
        });
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

        if (!this.state.pending) {
            if (!this.state.isLoggedIn) {
                return <Redirect to="/login" />;
            }
            if (!this.props.user.success) {
                return (
                    <FullScreenNotification>
                        <h2>사용자를 찾을 수 없습니다</h2>
                        <p
                            onClick={() => {
                                this.logout();
                            }}
                            style={{ cursor: 'pointer' }}
                        >로그인 하러 가기
                        </p>
                    </FullScreenNotification>
                );
            }
            if (!this.state.auth.user.admin) {
                return (
                    <FullScreenNotification>
                        <h2>관리자 권한이 필요합니다</h2>
                        <FullScreenNotification.Link text="돌아가기" />
                        <FullScreenNotification.Link text="로그인 하러 가기" onClick={() => {
                            this.logout();
                        }} />
                    </FullScreenNotification>
                );
            }
        }
        if (this.state.pending) {
            return (
                <div className="loading">
                    <CircularProgress color={loadingProgressColor} size={150} thickness={7} />
                    <p style={{ color: loadingFontColor }}>로딩중...</p>
                </div>
            );
        }
        return (
            <WrappedComponent logout={this.logout} {...this.state} {...props} />
        );
    }
});

