import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Loading from '../../../../components/Loading';

class RegisterModal extends React.Component {
    static propTypes = {
        open: PropTypes.bool,
        handleClose: PropTypes.func,
    };

    static defaultProps = {
        open: false,
        handleClose: () => {
        },
        handleRequest: () => {
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            pending: false,
            name: '',
            origin: '',
            callback_url: '',
        };
    }

    submit = async () => {
        // TODO Validate
        this.setState({ pending: true });
        const response = await this.props.handleRequest(
            this.props.auth.user._id,
            this.state.name,
            this.state.origin,
            this.state.callback_url,
            this.props.auth.token,
        );
        this.setState({ pending: false });

        if (response.success) {
            this.setState({
                name: '',
                origin: '',
                callback_url: '',
            });
            this.props.handleClose();
        } else {
            console.log(response.status);
        }
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    renderFields = () => (
        <div>
            <TextField
                fullWidth
                hintText="어플리케이션 이름"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
            />
            <TextField
                fullWidth
                hintText="도메인 (https://my.domain.com)"
                name="origin"
                value={this.state.origin}
                onChange={this.handleChange}
            />
            <TextField
                fullWidth
                hintText="콜백 URL (https://my.domain.com/oauth)"
                name="callback_url"
                value={this.state.callback_url}
                onChange={this.handleChange}
            />
        </div>
    )

    renderActions = () => [
        <FlatButton
            label="닫기"
            primary
            onClick={this.props.handleClose}
        />,
        <FlatButton
            label="만들기"
            primary
            onClick={this.submit}
        />,
    ];

    renderRegisterModal = () => (
        <Dialog
            modal
            title="내 어플리케이션 만들기"
            actions={this.renderActions()}
            open={this.props.open}
            contentClassName="dialog"
        >
            {this.state.pending ? <Loading /> : this.renderFields()}
        </Dialog>
    );

    render() {
        return this.renderRegisterModal();
    }
}

export default RegisterModal;
