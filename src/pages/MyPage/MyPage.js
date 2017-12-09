import React from 'react';
import { Card, CardActions, CardText, CardHeader } from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
import FaceIcon from 'material-ui/svg-icons/action/face';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AppsIcon from 'material-ui/svg-icons/navigation/apps';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import './style/MyPage.scss';

import needLoggedIn from '../../lib/hoc/needLoggedIn';

@needLoggedIn
class MyPage extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            user,
            token,
        } = this.props.auth;

        const my = user || {};

        const renderAvatar = () => (
            <Badge
                badgeContent={my.level}
                primary
                badgeStyle={{
                    top: 10,
                    right: 10,
                }}
            >
                {my.thumbnail_image ?
                    <Avatar size={50} src={my.thumbnail_image}/> :
                    <Avatar size={50} icon={<FaceIcon/>}/>
                }
            </Badge>
        );

        const renderMenu = () => (
            <div style={{ flexGrow: 1 }}>
                <IconMenu
                    iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                >
                    <MenuItem primaryText="어플리케이션 관리" leftIcon={<AppsIcon/>}/>
                    <MenuItem primaryText="로그아웃" onClick={this.props.logout} leftIcon={<ExitToAppIcon/>}/>
                </IconMenu>
            </div>
        );

        const renderHeader = () => (
            <CardHeader
                className="MyPage-card-header"
                title={my.nickname}
                subtitle={my.email}
                avatar={renderAvatar()}
                titleStyle={{
                    fontSize: '1.5rem',
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {renderMenu()}
            </CardHeader>
        );

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
                    <TableRow/>
                </TableBody>
            </Table>
        );


        const renderContents = () => (
            <CardText>
                {renderUserInfo()}
            </CardText>
        );

        return (
            <Card className="container-large">
                {renderHeader()}
                {renderContents()}
            </Card>
        );
    }
}

export default MyPage;
