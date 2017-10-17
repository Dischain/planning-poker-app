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

import rootReducer from './reducers/index.js';

import '../css/main.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const store = createStoreWithMiddleware(rootReducer);

function checkAuth(nextState, replaceState) {

}

// TODO: add NotFound and HomePage
ReactDOM.render(
  <Provider store = {store}>
    <Router history = {browserHistory}>
      <Route component = {Layout}>
        <Route onEnter = {checkAuth}>
          <Route path = '/' component = {Dashboard} />
          <Route path = '/login' component = {LoginPage} />
          <Route path = '/register' component = {RegisterPage} />          
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'));