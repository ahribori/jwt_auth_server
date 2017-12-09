import React from 'react';
import PageWithProfile from '../../templates/PageWithProfile';
import './style/Users.scss';
import needLoggedIn from '../../lib/hoc/needLoggedIn';

@needLoggedIn
class Users extends React.Component {
    render() {
        return (
            <PageWithProfile {...this.props}>
                <div>회원 관리</div>
            </PageWithProfile>
        );
    }
}

export default Users;
