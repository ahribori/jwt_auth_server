import React from 'react';
import { connect } from 'react-redux';
import url from 'url';
import CircularProgress from 'material-ui/CircularProgress';
import {
    pinkA200 as loadingProgressColor,
    white as loadingFontColor,
} from 'material-ui/styles/colors';
import FullScreenNotification from '../../templates/FullScreenNotification';
import postMessage from '../../lib/postMessage';
import * as application from '../../ducks/Application';

const mapStateToProps = (state) => {
    return {
        application: state.application.get('fetch_for_sdk'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getApplicationRequest: appKey => dispatch(application.fetchForSdk(appKey)),
    };
};

export default WrappedComponent => connect(mapStateToProps, mapDispatchToProps)(class sdkMiddleware extends React.Component {
    constructor(props) {
        super(props);
        const { query } = url.parse(window.location.href, window.location.search);
        const { a, o } = query || {};
        this.state = {
            pending: true,
            appKey: a,
            origin: o,
            verify: false,
            isLoggedIn: false,
            errorMessage: '',
        };
    }
    async componentDidMount() {
        console.log('sdk mount');
        if (this.state.appKey) {
            await this.props.getApplicationRequest(atob(this.state.appKey));
            console.log(this.props);
            this.handleResponse();
        } else {
            this.setState({ pending: false });
        }
        window.addEventListener('message', this.postMessageListener, false);
    }

    componentWillUnmount() {
        console.log('sdk unmount');
        window.removeEventListener('message', this.postMessageListener);
    }

    getOpener = () => window.opener;

    handleResponse() {
        const statusCode = this.props.application.response.status;
        if (statusCode === 200) {
            this.setState({ pending: false, verify: true }); // appKey 인증됨
            postMessage(this.getOpener(), {
                type: 'popupOnLoad',
            }, this.props.application.response.data.origin);
        } else {
            this.setState({ pending: false }); // appKey 인증되지 않음
            switch (statusCode) {
                case 400: this.setState({ errorMessage: '어플리케이션 키의 형식이 올바르지 않습니다' });
                    break;
                case 404: this.setState({ errorMessage: '어플리케이션을 찾을 수 없습니다' });
                    break;
                case 403: this.setState({ errorMessage: '등록된 어플리케이션 도메인의 요청이 아닙니다' });
                    break;
                case 500: this.setState({ errorMessage: '알 수 없는 문제가 발생했습니다' });
                    break;
                default:
            }
        }
    }

    postMessageListener = (event) => {
        try {
            const message = JSON.parse(event.data);
            const { source, origin } = event;
            console.log(message);
            postMessage(source, { token: 'ㅇㅇㅇ' }, origin);
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        if (this.state.pending) {
            return (
                <div className="loading">
                    <CircularProgress color={loadingProgressColor} size={150} thickness={7} />
                    <p style={{ color: loadingFontColor }}>로딩중...</p>
                </div>
            );
        }
        // ---------------- 로딩 끝 ----------------
        console.log('async request finished');
        if (this.state.appKey) { // appKey exist
            if (this.state.verify) { // application exist
                console.log('application exist');
                const newProps = {
                    sdk: true,
                };

                return (
                    <WrappedComponent {...newProps} {...this.props} />
                );
            }
            return (
                <FullScreenNotification>
                    <h2>{this.state.errorMessage}</h2>
                    <FullScreenNotification.Link
                        text="창 닫기"
                        onClick={() => {
                            window.close();
                        }}
                    />
                </FullScreenNotification>
            );
        }
        console.log('application not exist');
        // application not exist
        return (
            <WrappedComponent {...this.props} />
        );
    }
});
