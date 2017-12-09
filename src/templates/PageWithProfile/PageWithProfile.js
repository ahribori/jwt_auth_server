import React from 'react';
import { Card, CardTitle, CardActions, CardText, CardHeader } from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
import FaceIcon from 'material-ui/svg-icons/action/face';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AppsIcon from 'material-ui/svg-icons/navigation/apps';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import LinearProgress from 'material-ui/LinearProgress';

import './style/PageWithProfile.scss';

class PageWithProfile extends React.Component {
    render() {
        const {
            user,
        } = this.props.auth;

        const my = user || {};

        const renderAvatar = () => (
            <Badge
                badgeContent={my.level}
                primary
                badgeStyle={{
                    top: 15,
                    right: 15,
                }}
            >
                {my.thumbnail_image ?
                    <Avatar size={65} src={my.thumbnail_image} /> :
                    <Avatar size={65} icon={<FaceIcon />} />
                }
            </Badge>
        );

        const renderMenu = () => (
            <div style={{ flexGrow: 1 }}>
                <IconMenu
                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                >
                    <MenuItem primaryText="어플리케이션 관리" leftIcon={<AppsIcon />} />
                    <MenuItem primaryText="로그아웃" onClick={this.props.logout} leftIcon={<ExitToAppIcon />} />
                </IconMenu>
            </div>
        );

        const renderHeader = () => (
            <CardHeader
                className="PageWithProfile-card-header"
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
                <span className="level-details">
                    {my.level_details.progress}%
                </span>
                <LinearProgress
                    mode="determinate"
                    value={my.level_details.progress}
                    style={{
                        height: 4,
                        position: 'absolute',
                        top: 45,
                        left: 110,
                        width: 150,
                    }}
                />
            </CardHeader>
        );

        const renderContents = () => (
            <CardText>
                {this.props.children}
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

export default PageWithProfile;
