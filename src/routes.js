import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';

import {
    Login,
    Join,
    MyPage,
    MyApplication,
    Users,
    PageNotFound,
} from './pages';

import NILCallback from './pages/Login/components/SocialLogin/NILCallback';

export default (
    <Switch>
        <Route exact path="/" component={MyPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/application" component={MyApplication} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/nil" component={NILCallback} />
        <Route component={PageNotFound} />
    </Switch>
);
