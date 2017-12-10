import React from 'react';
import { connect } from 'react-redux';
import * as application from '../../ducks/Application';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import PageWithProfile from '../../templates/PageWithProfile';
import './style/MyApplication.scss';
import needLoggedIn from '../../lib/hoc/needLoggedIn';

@needLoggedIn
class MyApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationList: [],
        };
    }

    async componentDidMount() {
        await this.props.fetchApplicationListRequest(this.props.auth.token);
        this.setState({
            applicationList: this.props.fetchApplicationListStore.response.data,
        });
    }

    renderApplicationCards = () => this.state.applicationList.map(application => (
        <Card key={application._id}>
            <CardTitle
                title={application.name}
                subtitle={application.origin}
            />
            <CardText>
                <pre>{application._id}</pre>
            </CardText>
        </Card>
    ));

    render() {
        return (
            <PageWithProfile {...this.props}>
                <div className="center">
                    <div className="flexContainer">
                        {this.renderApplicationCards()}
                    </div>
                </div>
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
