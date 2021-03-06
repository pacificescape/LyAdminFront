import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import LyAdminApp from './LyAdminApp';
import { Provider } from 'react-redux'
import createStore from './redux/store';
import * as serviceWorker from './serviceWorker';

const store = createStore()

if (window.location.href.indexOf('login') !== -1) {
    fetch(window.location.href)
}

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <Route path="/" component={LyAdminApp} />
        </Provider>
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
