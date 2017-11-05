import React from 'react';
import {
    Route
} from 'react-router-dom';

import {
    Home,
    About
} from './pages';

export default (
    <div>
        <Route exact path="/home" component={Home} />
        <Route exact path="/about" component={About} />
    </div>
);
