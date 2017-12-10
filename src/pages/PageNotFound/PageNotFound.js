import React from 'react';
import { Link } from 'react-router-dom';
import FullScreenNotification from '../../templates/FullScreenNotification';

class PageNotFound extends React.Component {
    render() {
        const linkStyle = {
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'white',
        };

        return (
            <FullScreenNotification>
                <h2>페이지를 찾을 수 없습니다</h2>
                <Link to="/" style={linkStyle}>
                    홈으로 가기
                </Link>
            </FullScreenNotification>
        );
    }
}

export default PageNotFound;
