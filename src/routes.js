import React from 'react';
import {
    Route,
} from 'react-router-dom';

import {
    Login,
    Join,
    MyPage,
    MyApplication,
    Users,
    PageNotFound,
} from './pages';

export default (
    <div>
        <Route exact path="/" component={MyPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/application" component={MyApplication} />
        <Route exact path="/users" component={Users} />
        <Route component={PageNotFound} />
    </div>
);
