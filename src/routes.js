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
        <Route exact path="/login" component={Login} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/" component={MyPage} />
    </div>
);
