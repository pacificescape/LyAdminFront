import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components'
import './index.css';
import LyAdminApp from './LyAdminApp';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
        <Router>
            <Route path='' component={LyAdminApp} />
        </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
