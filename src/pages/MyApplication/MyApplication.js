import React from 'react';
import { connect } from 'react-redux';
import {
    grey800 as fontColor,
} from 'material-ui/styles/colors';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import * as application from '../../ducks/Application';
import PageWithProfile from '../../templates/PageWithProfile';
import RegisterModal from './components/RegisterModal';
import ModifyModal from './components/ModifyModal';
import { Loading, MessageInPage } from '../../templates';
import './style/MyApplication.scss';
import needLoggedIn from '../../lib/hoc/needLoggedIn';

@needLoggedIn
class MyApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registerModalOpen: false,
            modifyModalOpen: false,
            selectedApplication: null,
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

    openModifyModal = (e) => {
        const index = e.currentTarget.dataset.id;
        const currentData = this.props.fetchApplicationListStore.response.data[index];
        this.setState({
            modifyModalOpen: true,
            selectedApplication: currentData,
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

    handleRegisterRequest = async (name, origin, token) => {
        await this.props.registerApplicationRequest(name, origin, token);
        await this.props.fetchApplicationListRequest(this.props.auth.token);
        return this.props.registerApplicationStore;
    };

    handleModifyRequest = async (id, name, origin, token) => {
        await this.props.modifyApplicationRequest(id, name, origin, token);
        await this.props.fetchApplicationListRequest(this.props.auth.token);
        return this.props.modifyApplicationStore;
    };

    handleRemoveRequest = async (id, token) => {
        await this.props.removeApplicationRequest(id, token);
        await this.props.fetchApplicationListRequest(this.props.auth.token);
        return this.props.removeApplicationStore;
    };

    renderModals = () => (
        <div>
            <RegisterModal
                open={this.state.registerModalOpen}
                handleClose={this.closeRegisterModal}
                handleRequest={this.handleRegisterRequest}
                auth={this.props.auth}
            />
            <ModifyModal
                open={this.state.modifyModalOpen}
                handleClose={this.closeModifyModal}
                handleRequest={this.handleModifyRequest}
                handleRomoveRequest={this.handleRemoveRequest}
                auth={this.props.auth}
                data={this.state.selectedApplication}
            />
        </div>
    );

    renderApplicationCards = () => {
        const applicationList = this.props.fetchApplicationListStore.response.data || [];
        return applicationList.length === 0 ?
            <MessageInPage message="어플리케이션이 없습니다" /> :
            applicationList.map((app, index) => (
                <div className="card-item" key={app._id}>
                    <Card>
                        <SettingsIcon
                            data-id={index}
                            className="settings-icon"
                            style={{ color: fontColor }}
                            onClick={this.openModifyModal}
                        />
                        <CardTitle
                            title={app.name}
                            subtitle={app.origin}
                            titleStyle={{
                                paddingRight: 20,
                            }}
                        />
                        <CardText>
                            <pre style={{
                                fontSize: '0.7rem',
                            }}
                            >{app._id}
                            </pre>
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
                    <b style={{ color: fontColor }}>내 어플리케이션 만들기</b>
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
        registerApplicationRequest: (name, origin, token) =>
            dispatch(application.register(name, origin, token)),
        modifyApplicationRequest: (id, name, origin, token) =>
            dispatch(application.modify(id, name, origin, token)),
        removeApplicationRequest: (id, token) => dispatch(application.remove(id, token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyApplication);
