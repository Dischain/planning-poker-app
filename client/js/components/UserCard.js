'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { STATIC_SERVER_BASE_PATH } from '../../config.js';

export default class UserCard extends Component {
  render() {
    const { id, name, avatar, size } = this.props;
    const userPath = '/usesrs/' + id;
    const block = 'user-card' + (size !== '' ? ('-' + size) : '');
    return (
      <li className = 'user-card clearfix display-block'>
        <img className = 'user-card__avatar float-left' 
          src = { STATIC_SERVER_BASE_PATH + '/' + avatar } width='75' height='75'></img>                  
        <div className = 'user-card__name float-left'>
          <Link to = { userPath }>{ name }</Link>
        </div>
      </li>
    );
  }
}