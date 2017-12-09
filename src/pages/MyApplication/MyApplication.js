import React from 'react';
import PageWithProfile from '../../templates/PageWithProfile';
import './style/MyApplication.scss';
import needLoggedIn from '../../lib/hoc/needLoggedIn';

@needLoggedIn
class MyApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <PageWithProfile {...this.props}>
                <div>내 어플리케이션</div>
            </PageWithProfile>
        );
    }
}

export default MyApplication;
