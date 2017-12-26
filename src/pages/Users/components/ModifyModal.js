import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Loading from '../../../templates/Loading';

class ModifyModal extends React.Component {
    static propTypes = {
        open: PropTypes.bool,
        data: PropTypes.object,
        handleClose: PropTypes.func,
        handleRequest: PropTypes.func,
    };

    static defaultProps = {
        open: false,
        data: null,
        handleClose: () => {
        },
        handleRequest: () => {
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            pending: false,
            password: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            const data = { ...nextProps.data };
            this.setState({
                ...data,
                exp: data.level.level_details.exp,
            });
        }
    }

    submit = async () => {
        if (this.validateFields()) {
            this.setState({ pending: true });
            const response = await this.props.handleRequest(
                this.props.data._id,
                this.state.name,
                this.state.origin,
                this.props.auth.token,
            );
            this.setState({ pending: false });

            if (response.success) {
                this.setState({
                    name: '',
                    origin: '',
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
    };

    handleChange = (e) => {
        console.log(e.target.name, e.target.value);
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    renderFields = () => (
        <div>
            <TextField
                fullWidth
                floatingLabelText="닉네임"
                hintText="닉네임을 입력하세요"
                name="nickname"
                value={this.state.nickname}
                onChange={this.handleChange}
            />
            <TextField
                fullWidth
                type="password"
                floatingLabelText="패스워드"
                hintText="패스워드를 입력하세요"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
            />
            <TextField
                fullWidth
                floatingLabelText="이메일"
                hintText="이메일을 입력하세요"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
            />
            <TextField
                fullWidth
                floatingLabelText="캐쉬"
                hintText="캐쉬를 입력하세요"
                name="cash"
                value={this.state.cash}
                onChange={this.handleChange}
            />
            <TextField
                fullWidth
                floatingLabelText="포인트"
                hintText="포인트를 입력하세요"
                name="point"
                value={this.state.point}
                onChange={this.handleChange}
            />
            <TextField
                fullWidth
                floatingLabelText="경험치"
                hintText="경험치를 입력하세요"
                name="exp"
                value={this.state.exp}
                onChange={this.handleChange}
            />
        </div>
    );

    renderActions = () => [
        <FlatButton
            label="닫기"
            onClick={this.props.handleClose}
        />,
        <FlatButton
            label="적용"
            primary
            onClick={this.submit}
        />,
    ];

    renderModifyModal = () => (
        <Dialog
            modal
            title="사용자 계정 수정"
            actions={this.renderActions()}
            open={this.props.open}
            contentClassName="dialog"
        >
            {this.state.pending ? <Loading /> : this.renderFields()}
        </Dialog>
    );

    render() {
        return this.state._id ? this.renderModifyModal() : null;
    }
}

export default ModifyModal;
