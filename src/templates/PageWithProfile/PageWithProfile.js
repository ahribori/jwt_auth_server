import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardActions, CardText, CardHeader } from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FaceIcon from 'material-ui/svg-icons/action/face';
import PeopleIcon from 'material-ui/svg-icons/social/people';
import AppsIcon from 'material-ui/svg-icons/navigation/apps';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import LinearProgress from 'material-ui/LinearProgress';

import './style/PageWithProfile.scss';

class PageWithProfile extends React.Component {
    static propTypes = {
        width: PropTypes.number,
    };

    static defaultProps = {
        width: 800,
    };

    pushHistory(to) {
        const { pathname } = this.props.history.location;
        if (pathname !== to) {
            this.props.history.push(to);
        }
    }

    render() {
        const {
            user,
        } = this.props.auth;

        const my = user || {};

        const renderAvatar = () => (
            <Badge
                badgeContent={my.level || 0}
                primary
                badgeStyle={{
                    top: 15,
                    right: 15,
                }}
            >
                {my.profile_image ?
                    <Avatar size={65} src={my.profile_image} /> :
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
                    <MenuItem
                        primaryText="내 프로필"
                        onClick={() => {
                            this.pushHistory('/');
                        }}
                        leftIcon={<FaceIcon />}
                    />
                    <MenuItem
                        primaryText="내 어플리케이션"
                        onClick={() => {
                            this.pushHistory('/application');
                        }}
                        leftIcon={<AppsIcon />}
                    />
                    {
                        my.admin &&
                        <MenuItem
                            primaryText="회원 관리"
                            onClick={() => {
                                this.pushHistory('/users');
                            }}
                            leftIcon={<PeopleIcon />}
                        />
                    }
                    <MenuItem
                        primaryText="로그아웃"
                        onClick={this.props.logout}
                        leftIcon={<ExitToAppIcon />}
                    />
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
                    {my.level_details && `${my.level_details.progress}%`}
                </span>
                <LinearProgress
                    mode="determinate"
                    value={my.level_details && my.level_details.progress}
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
            <Card
                className={`container-large ${this.props.className}`}
                style={{
                    maxWidth: this.props.width,
                }}
            >
                {renderHeader()}
                {renderContents()}
            </Card>
        );
    }
}

export default PageWithProfile;
