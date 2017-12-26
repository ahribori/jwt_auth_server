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
import LevelRenderer from './components/LevelRenderer';
import ProfileImageRenderer from './components/ProfileImageRenderer';
import ModifyModal from './components/ModifyModal';
import needAdmin from '../../lib/hoc/needAdmin';

@needAdmin
class Users extends React.Component {
    state = {
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

    handleRemoveButtonClick = () => {
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
        users.map(user => data.push({
            _id: user._id,
            profile_image: user.profile_image,
            username: user.username,
            nickname: user.nickname,
            level: { level: user.level, level_details: user.level_details },
            cash: user.cash,
            point: user.point,
            email: user.email,
            email_verified: user.email_verified ? '인증됨' : '인증되지 않음',
            last_login: new Date(user.last_login).toLocaleString(),
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
                            comparator={(r1, r2) => r1.level_details.exp - r2.level_details.exp}
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
                />
            </div>
        );
    };

    render() {
        return (
            <PageWithProfile width={1200} className="users-page" {...this.props}>
                {this.props.userList ? this.renderGrid() : <Loading />}
            </PageWithProfile>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userList: state.user.get('user_list'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserListRequest: token => dispatch(user.getUserList(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
