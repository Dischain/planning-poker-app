import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Layout from './components/Layout.js';
import LoginPage from './components/pages/LoginPage.js';
import RegisterPage from './components/pages/RegisterPage.js';
import Dashboard from './components/pages/Dashboard.js';
import HomePage from './components/pages/HomePage.js';
import NewVotation from './components/pages/NewVotation.js';

import rootReducer from './reducers/index.js';
import { fetchUser } from './actions/userActions.js';

import 'file?name=[name].[ext]!../img/search-icon-sm.png';
import 'file?name=[name].[ext]!../img/email-icon-sm.png';
import 'file?name=[name].[ext]!../img/plus-icon.png';
import 'file?name=[name].[ext]!../img/rm-icon.png';
import '../css/main.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const store = createStoreWithMiddleware(rootReducer);

function checkAuth(nextState, replaceState) {
  store.dispatch(fetchUser());

  if (!store.getState().loginReducer.loggedIn) {
    replaceState('/login');
  } else {
    replaceState(null, nextState.location.pathname);
  }
}

// TODO: add NotFound
ReactDOM.render(
  <Provider store = {store}>
    <Router history = {browserHistory}>
      <Route component = {Layout}>
        <Route path = '/' component = {HomePage} />
        <Route path = '/login' component = {LoginPage} />
        <Route path = '/register' component = {RegisterPage} />
        <Route onEnter = {checkAuth}>
          <Route path = '/dashboard' component = {Dashboard} />
          <Route path = '/new' component = {NewVotation} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'));
