import React from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import PageWithProfile from '../../templates/PageWithProfile';
import './style/MyPage.scss';
import needLoggedIn from '../../lib/hoc/needLoggedIn';

@needLoggedIn
class MyPage extends React.Component {
    render() {
        const {
            user,
            token,
        } = this.props.auth;

        const my = user || {};

        const renderUserInfo = () => (
            <Table
                selectable={false}
            >
                <TableBody displayRowCheckbox={false}>
                    <TableRow>
                        <TableRowColumn>계정</TableRowColumn>
                        <TableRowColumn>{my.username}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>권한</TableRowColumn>
                        <TableRowColumn>{my.admin ? '관리자' : '일반'}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>이메일 인증 여부</TableRowColumn>
                        <TableRowColumn>{my.email_verified ? '인증됨' : '인증되지 않음'}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>레벨</TableRowColumn>
                        <TableRowColumn>{my.level}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>캐쉬</TableRowColumn>
                        <TableRowColumn>{my.cash} 캐쉬</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>포인트</TableRowColumn>
                        <TableRowColumn>{my.point} 포인트</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>엑세스 토큰</TableRowColumn>
                        <TableRowColumn>
                            <pre>{token}</pre>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow />
                </TableBody>
            </Table>
        );

        return (
            <PageWithProfile {...this.props}>
                {renderUserInfo()}
            </PageWithProfile>
        );
    }
}

export default MyPage;
