import React from 'react';
import { Redirect } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import {
    pinkA200 as loadingProgressColor,
    white as loadingFontColor,
} from 'material-ui/styles/colors';
import FullScreenNotification from '../../templates/FullScreenNotification';
import withAuth from './withAuth';

export default WrappedComponent => withAuth(class needAdmin extends React.Component {
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
        const isLoggedIn = await this.props.isLoggedIn();
        const token = this.props.getToken();
        if (isLoggedIn) {
            const { _id } = this.props.verify.response.data;
            const user = await this.props.getUser(_id, token);
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

    logout = () => {
        this.props.logout();
        this.setState({
            isLoggedIn: false,
        });
    };

    render() {
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
                        <FullScreenNotification.Link
                            text="로그인 하러 가기"
                            onClick={() => {
                                this.logout();
                            }}
                        />
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
            <WrappedComponent{...this.state} {...this.props} logout={this.logout} />
        );
    }
});

