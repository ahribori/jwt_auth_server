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

import AgGridExample from './pages/AgGridExample';

export default (
    <Switch>
        <Route exact path="/" component={MyPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/application" component={MyApplication} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/agGrid" component={AgGridExample} />
        <Route component={PageNotFound} />
    </Switch>
);
