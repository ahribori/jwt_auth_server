import React from 'react';
import Avatar from 'material-ui/Avatar';
import FaceIcon from 'material-ui/svg-icons/action/face';

class ProfileImageRenderer extends React.Component {
    render() {
        return (
            <div style={{
                marginTop: 3,
            }}
            >
                {this.props.value ?
                    <Avatar size={40} src={this.props.value} /> :
                    <Avatar size={40} icon={<FaceIcon />} />}
            </div>
        );
    }
}

export default ProfileImageRenderer;
