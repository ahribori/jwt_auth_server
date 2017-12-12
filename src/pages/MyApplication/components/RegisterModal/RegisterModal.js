import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Loading from '../../../../templates/Loading';

class RegisterModal extends React.Component {
    static propTypes = {
        open: PropTypes.bool,
        handleClose: PropTypes.func,
        handleRequest: PropTypes.func,
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
            nameErrorText: '',
            originErrorText: '',
            callbackUrlErrorText: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        const { open } = nextProps;
        if (!open) {
            this.setState({
                name: '',
                origin: '',
                callback_url: '',
                nameErrorText: '',
                originErrorText: '',
                callbackUrlErrorText: '',
            });
        }
    }

    submit = async () => {
        if (this.validateFields()) {
            this.setState({ pending: true });
            const response = await this.props.handleRequest(
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
                console.info(response.response.status);
            }
            return response;
        }
        return null;
    };

    validateFields = () => {
        let success = true;

        const validateName = () => {
            if (this.state.name === '') {
                success = false;
                return '어플리케이션 이름을 입력하세요';
            }
            return '';
        };
        const validateOrigin = () => {
            if (this.state.origin === '') {
                success = false;
                return '도메인을 입력하세요';
            }
            if (!new RegExp(/(https?:\/\/)([\w]+\.|localhost)([\w]+)?(\.[\w]+)?(\.[\w]+)?(:\d{2,5})?/)
                    .test(this.state.origin)) {
                success = false;
                return '올바른 형식이 아닙니다';
            }
            return '';
        };
        const validateCallbackUrl = () => {
            if (this.state.callback_url === '') {
                success = false;
                return '콜백 URL을 입력하세요';
            }
            if (!new RegExp(/(https?:\/\/)([\w]+\.|localhost)([\w]+)?(\.[\w]+)?(\.[\w]+)?(:\d{2,5})?(\/\w*)+/)
                    .test(this.state.callback_url)) {
                success = false;
                return '올바른 형식이 아닙니다';
            }
            return '';
        };
        const localState = {
            nameErrorText: validateName(),
            originErrorText: validateOrigin(),
            callbackUrlErrorText: validateCallbackUrl(),
        };

        this.setState(localState);

        return success;
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
                floatingLabelText="어플리케이션 이름"
                hintText="어플리케이션 이름을 입력하세요"
                errorText={this.state.nameErrorText}
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                ref={(ref) => {
                    this.nameRef = ref;
                }}
            />
            <TextField
                fullWidth
                floatingLabelText="도메인"
                hintText="https://my.domain.com"
                errorText={this.state.originErrorText}
                name="origin"
                value={this.state.origin}
                onChange={this.handleChange}
                ref={(ref) => {
                    this.originRef = ref;
                }}
            />
            <TextField
                fullWidth
                floatingLabelText="콜백 URL"
                hintText="https://my.domain.com/callback_path"
                errorText={this.state.callbackUrlErrorText}
                name="callback_url"
                value={this.state.callback_url}
                onChange={this.handleChange}
                ref={(ref) => {
                    this.callbackUrlRef = ref;
                }}
            />
        </div>
    );

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
