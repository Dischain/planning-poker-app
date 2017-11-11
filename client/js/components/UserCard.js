'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

export default class UserCard extends Component {
  render() {
    const { id, name, avatar } = this.props;
    const userPath = '/usesrs/' + id;
    return (
      <li className = 'user-card clearfix display-block'>
        <img class = 'user-card__avatar float-left' 
          src = {avatar} width='75' height='75'></img>                  
        <div class='user-card__name float-left'>
          <Link to = {userPath}>{name}</Link>
        </div>
      </li>
    );
  }
}