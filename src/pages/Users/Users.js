import React from 'react';
import { connect } from 'react-redux';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import LinearProgress from 'material-ui/LinearProgress';
import PageWithProfile from '../../templates/PageWithProfile';
import * as auth from '../../ducks/Auth';
import './style/Users.scss';
import { Loading, MessageInPage } from '../../templates';
import needAdmin from '../../lib/hoc/needAdmin';

@needAdmin
class Users extends React.Component {
    async componentDidMount() {
        await this.props.getUserListRequest(this.props.auth.token);
    }


    renderTable() {
        return (
            <Table
                className="users-grid"
            >
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn className="username">닉네임(계정)</TableHeaderColumn>
                        <TableHeaderColumn className="level">레벨</TableHeaderColumn>
                        <TableHeaderColumn className="cash">캐시</TableHeaderColumn>
                        <TableHeaderColumn className="point">포인트</TableHeaderColumn>
                        <TableHeaderColumn className="last_login">마지막 로그인</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {this.renderUsers()}
                </TableBody>
            </Table>
        );
    }

    renderUsers() {
        const users = this.props.userList.response.data;
        return users.map((user, index) => (
            <TableRow key={user._id}>
                <TableRowColumn className="username">
                    <b>{user.nickname}</b>
                    <div>({user.username})</div>
                </TableRowColumn>
                <TableRowColumn className="level">
                    <b>Lv. {user.level}</b>
                    <LinearProgress
                        mode="determinate"
                        value={user.level_details && user.level_details.progress}
                        style={{
                            height: 4,
                            width: 100,
                        }}
                    />
                    <span style={{ fontSize: '0.7rem' }}>
                        {user.level_details.expInCurrentLevel}/
                        {user.level_details.expRequireInCurrentLevel} ({user.level_details.progress}%)
                    </span>
                </TableRowColumn>
                <TableRowColumn className="cash">
                    {user.cash}
                </TableRowColumn>
                <TableRowColumn className="point">
                    {user.point}
                </TableRowColumn>
                <TableRowColumn className="last_login">{new Date(user.last_login).toLocaleString()}</TableRowColumn>
            </TableRow>
        ));
    }

    render() {
        return (
            <PageWithProfile width={1200} className="users-page" {...this.props}>
                {this.props.userList ? this.renderTable() : <Loading />}
            </PageWithProfile>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userList: state.auth.get('user_list'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserListRequest: token => dispatch(auth.getUserList(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
