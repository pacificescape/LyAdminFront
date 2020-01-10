import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LyAdminApp from './LyAdminApp';
import createStore from './redux/store';
import * as serviceWorker from './serviceWorker';

const store = createStore()

ReactDOM.render(
        <Router>
            <Route store={store} component={LyAdminApp} />
        </Router>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
