import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ModifyIcon from 'material-ui/svg-icons/content/create';
import RemoveIcon from 'material-ui/svg-icons/content/remove';
import 'ag-grid/src/styles/ag-grid.scss';
import 'ag-grid/src/styles/ag-theme-material.scss';

import PageWithProfile from '../../templates/PageWithProfile';
import * as user from '../../ducks/User';
import './style/Users.scss';
import '../../style/AgGrid.scss';
import { Loading } from '../../templates';
import AccountRenderer from './components/AccountRenderer';
import LevelRenderer from './components/LevelRenderer';
import ProfileImageRenderer from './components/ProfileImageRenderer';
import ModifyModal from './components/ModifyModal';
import needAdmin from '../../lib/hoc/needAdmin';

@needAdmin
class Users extends React.Component {
    state = {
        pending: false,
        modifyModalOpen: false,
        selectedRow: [],
    };

    async componentDidMount() {
        await this.props.getUserListRequest(this.props.auth.token);
    }


    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;
    };

    onSelectionChanged = () => {
        this.setState({
            selectedRow: this.api.getSelectedRows(),
        });
    };

    handleModifyButtonClick = () => {
        this.openModifyModal();
    };

    handleRemoveButtonClick = async () => {
        const count = this.state.selectedRow.length;
        const bulk = [];
        this.state.selectedRow.map((row) => {
            bulk.push(row._id);
        });
        let message;
        if (count > 1) {
            message = `${this.state.selectedRow[0].username}계정을 포함한 ${count}개의 계정을 삭제하시겠습니까?`;
        } else {
            message = `${this.state.selectedRow[0].username}계정을 삭제하시겠습니까?`;
        }
        if (confirm(message)) {
            this.setState({ pending: true });
            await this.props.removeUserBulkRequest(bulk, this.props.auth.token);
            await this.props.getUserListRequest(this.props.auth.token);
            this.setState({ pending: false });
        }
    };

    openModifyModal = () => {
        this.setState({
            modifyModalOpen: true,
        });
    };

    closeModifyModal = () => {
        this.setState({
            modifyModalOpen: false,
        });
    };

    renderModifyButton = () => (this.state.selectedRow.length === 1 ? (
        <FloatingActionButton
            className="user-modify-btn"
            onClick={this.handleModifyButtonClick}
        >
            <ModifyIcon />
        </FloatingActionButton>
    ) : null);

    renderRemoveButton = () => (this.state.selectedRow.length >= 1 ? (
        <FloatingActionButton
            className="user-remove-btn"
            onClick={this.handleRemoveButtonClick}
        >
            <RemoveIcon />
        </FloatingActionButton>
    ) : null);

    renderGrid = () => {
        const data = [];
        const users = this.props.userList.response.data;
        users.map(usr => data.push({
            _id: usr._id,
            profile_image: usr.profile_image,
            username: { username: usr.username, account_type: usr.account_type },
            nickname: usr.nickname,
            level: { level: usr.level, level_details: usr.level_details },
            cash: usr.cash,
            point: usr.point,
            email: usr.email,
            email_verified: usr.email_verified ? '인증됨' : '인증되지 않음',
            last_login: new Date(usr.last_login).toLocaleString(),
        }));

        const containerStyle = {
            height: 620,
            width: '100%',
        };

        return (
            <div className="users-page">
                <div className="toolbox">
                    {this.renderRemoveButton()}
                    {this.renderModifyButton()}
                </div>
                <div style={containerStyle} className="ag-theme-material">
                    <AgGridReact
                        rowData={data}
                        rowSelection="multiple"
                        rowDeselection
                        pagination
                        paginationPageSize={10}
                        enableSorting
                        enableColResize
                        onGridReady={this.onGridReady}
                        onRowSelected={this.onRowSelected}
                        onSelectionChanged={this.onSelectionChanged}
                    >

                        {/* column definitions */}
                        <AgGridColumn
                            field="_id"
                            hide
                        />
                        <AgGridColumn
                            field="profile_image"
                            headerName=""
                            cellRendererFramework={ProfileImageRenderer}
                            suppressResize
                            width={65}
                        />
                        <AgGridColumn
                            field="username"
                            cellRendererFramework={AccountRenderer}
                            comparator={(a, b) => {
                                const valueA = a.account_type ? `_${a.account_type}` : a.username;
                                const valueB = b.account_type ? `_${b.account_type}` : b.username;
                                if (valueA < valueB) return -1;
                                if (valueA > valueB) return 1;
                                return 0;
                            }}
                            headerName="계정"
                            width={130}
                        />
                        <AgGridColumn
                            field="nickname"
                            headerName="닉네임"
                            width={130}
                        />
                        <AgGridColumn
                            field="level"
                            headerName="레벨"
                            cellRendererFramework={LevelRenderer}
                            comparator={(a, b) => a.level_details.exp - b.level_details.exp}
                            width={150}
                        />
                        <AgGridColumn
                            field="cash"
                            headerName="캐쉬"
                            width={120}
                        />
                        <AgGridColumn
                            field="point"
                            headerName="포인트"
                            width={120}
                        />
                        <AgGridColumn
                            field="email"
                            headerName="이메일"
                        />
                        <AgGridColumn
                            field="email_verified"
                            headerName="이메일 인증"
                            width={135}
                        />
                        <AgGridColumn
                            field="last_login"
                            headerName="마지막 로그인"
                            tooltipField="last_login"
                            width={250}
                        />
                    </AgGridReact>
                </div>
                <ModifyModal
                    open={this.state.modifyModalOpen}
                    handleClose={this.closeModifyModal}
                    data={this.state.selectedRow[0]}
                    auth={this.props.auth}
                    modifyUserRequest={this.props.modifyUserRequest}
                    modifyUser={this.props.modifyUser}
                    getUserListRequest={this.props.getUserListRequest}
                />
            </div>
        );
    };

    render() {
        return (
            <PageWithProfile width={1200} className="users-page" {...this.props}>
                {this.props.userList && !this.state.pending ? this.renderGrid() : <Loading />}
            </PageWithProfile>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userList: state.user.get('user_list'),
        modifyUser: state.user.get('modify'),
        removeUserBulk: state.user.get('remove_bulk'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserListRequest: token => dispatch(user.getUserList(token)),
        modifyUserRequest: (userObject, token) => dispatch(user.modifyUser(userObject, token)),
        removeUserBulkRequest: (bulk, token) => dispatch(user.removeUserBulk(bulk, token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
