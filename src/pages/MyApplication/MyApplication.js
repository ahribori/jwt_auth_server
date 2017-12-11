import React from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import * as application from '../../ducks/Application';
import PageWithProfile from '../../templates/PageWithProfile';
import RegisterModal from './components/RegisterModal';
import Loading from '../../components/Loading';
import './style/MyApplication.scss';
import needLoggedIn from '../../lib/hoc/needLoggedIn';

@needLoggedIn
class MyApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registerModalOpen: false,
            modifyModalOpen: false,
        };
    }

    async componentDidMount() {
        await this.props.fetchApplicationListRequest(this.props.auth.token);
    }

    openRegisterModal = () => {
        this.setState({
            registerModalOpen: true,
        });
    };
    openModifyModal = () => {
        this.setState({
            registerModalOpen: true,
        });
    };

    closeRegisterModal = () => {
        this.setState({
            registerModalOpen: false,
        });
    };

    closeModifyModal = () => {
        this.setState({
            modifyModalOpen: false,
        });
    };

    handleRegisterRequest = async (user, name, origin, callback_url, token) => {
        await this.props.registerApplicationRequest(user, name, origin, callback_url, token);
        await this.props.fetchApplicationListRequest(this.props.auth.token);
        console.log('갱신');
        return this.props.registerApplicationStore;
    };

    renderModals = () => (
        <RegisterModal
            open={this.state.registerModalOpen}
            handleClose={this.closeRegisterModal}
            handleRequest={this.handleRegisterRequest}
            auth={this.props.auth}
        />
    );

    renderApplicationCards = () => {
        const applicationList = this.props.fetchApplicationListStore.response.data || [];
        return applicationList.map(application => (
            <div className="card-item" key={application._id}>
                <Card>
                    <CardTitle
                        title={application.name}
                        subtitle={application.origin}
                    />
                    <CardText>
                        <pre>{application._id}</pre>
                    </CardText>
                </Card>
            </div>
        ));
    };

    render() {
        return (
            <PageWithProfile {...this.props}>
                <div className="toolbar">
                    <FloatingActionButton onClick={this.openRegisterModal}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <b>내 어플리케이션 만들기</b>
                </div>
                {this.props.fetchApplicationListStore ? (
                    <div className="card-container">
                        {this.renderApplicationCards()}
                    </div>
                ) : <Loading />}
                {this.renderModals()}
            </PageWithProfile>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fetchApplicationStore: state.application.get('fetch'),
        fetchApplicationListStore: state.application.get('fetch_list'),
        registerApplicationStore: state.application.get('register'),
        modifyApplicationStore: state.application.get('modify'),
        removeApplicationStore: state.application.get('remove'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchApplicationRequest: (id, token) => dispatch(application.fetch(id, token)),
        fetchApplicationListRequest: token => dispatch(application.fetchList(token)),
        registerApplicationRequest: (user, name, origin, callback_url, token) =>
            dispatch(application.register(user, name, origin, callback_url, token)),
        modifyApplicationRequest: (id, name, origin, callback_url, token) =>
            dispatch(application.modify(id, name, origin, callback_url, token)),
        removeApplicationRequest: (id, token) => dispatch(application.remove(id, token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyApplication);
