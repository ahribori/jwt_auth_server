import React from 'react';
import {
    Route,
} from 'react-router-dom';

import {
    Login,
    Join,
    MyPage,
} from './pages';

export default (
    <div>
        <Route exact path="/" component={Login} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/myPage" component={MyPage} />
    </div>
);
