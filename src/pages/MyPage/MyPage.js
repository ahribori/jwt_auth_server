import React from 'react';
import { Card, CardActions, CardText, CardHeader, CardTitle } from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
import FaceIcon from 'material-ui/svg-icons/action/face';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AppsIcon from 'material-ui/svg-icons/navigation/apps';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import './style/MyPage.scss';

import withAuth from '../../lib/hoc/withAuth';

@withAuth
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

        const containerStyle = {
            padding: '48px 40px 36px 40px',
        };

        const my = user || {};
        console.log(this.props);


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
                className="mypage-card-header"
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

        const renderContents = () => (
            <CardText>
                <pre>{token}</pre>
                <p style={{ width: '500px' }}/>
            </CardText>
        );

        return (
            <Card style={containerStyle} className="container-large">
                {renderHeader()}
                {renderContents()}
            </Card>
        );
    }
}

export default MyPage;
