'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

export default class UserCard extends Component {
  render() {
    const { id, name, avatar, size, path } = this.props;    
    
    const defaultSize = (
      <li className = 'user-card clearfix display-block'>
        <img className = 'user-card__avatar float-left'
          src = { avatar } width='75' height='75'></img>                  
        <div className = 'user-card__name float-left'>
          <Link to = { path }>{ name }</Link>
        </div>
      </li>
    );

    const { createdAt, creatorPath, creatorAvatar, creatorName } = this.props;
    const smallSize = (
      <div  className = 'user-card-sm float-right clearfix'>
        <div className = 'user-card-sm__date'>created
          <span>{ createdAt }</span>
        </div>
        <img className = 'user-card-sm__avatar float-left' src={creatorAvatar} width='50' height='50'></img>                  
        <div className = 'user-card-sm__name float-left'>
        <Link to = { creatorPath } >{ creatorName }</Link>
        </div>
      </div>
    );

    const extraSmallSize = (
      <li className = 'user-card-xsm usr-selector__item clearfix'>
        <img className = 'user-card-xsm__avatar float-left' 
          src = { avatar } 
          width='35' height='35'>
        </img>                  
        <div className='user-card-xsm__name float-left'>
          <Link to = { path }>{ name }</Link>
        </div>
      </li>
    );

    let card;
    
    switch (size) {
      case 'sm':
        card = smallSize;
        break;
      case 'xsm':
        card = extraSmallSize;
        break;
      default:
        card = defaultSize;
    }
    
    return card;
  }
}

UserCard.prototypes = {
  id: PropTypes.number, 
  name: PropTypes.string, 
  avatar: PropTypes.string,
  size: PropTypes.string,
  path: PropTypes.string,
  createdAt: PropTypes.string, 
  creatorPath: PropTypes.string, 
  creatorAvatar: PropTypes.string, 
  creatorName: PropTypes.string
};