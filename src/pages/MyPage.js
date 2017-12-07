import React from 'react';
import withAuth from '../lib/hoc/withAuth';

@withAuth
class MyPage extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    render() {
        const {
            user = {},
            token = '',
        } = this.props.auth;
        return (
            <div>
                <p>{token}</p>
                <p style={{ width: '500px' }}>{JSON.stringify(user)}</p>
            </div>
        );
    }
}

export default MyPage;
