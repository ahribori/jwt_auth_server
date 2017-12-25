import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';

class LevelRenderer extends React.Component {
    render() {
        const user = this.props.data.level;
        return (
            <div style={{ lineHeight: '21px' }}>
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
            </div>
        );
    }
}

export default LevelRenderer;
