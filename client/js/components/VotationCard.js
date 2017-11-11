'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

export default class VotationCard extends Component {
  render() {
    const { id, name, desc, votes, createdAt, creatorName, creatorId, creatorAvatar } = this.props;
    const votationPath = '/votations/' + id
        , creatorPath = '/usesrs/' + creatorId;
    
    return (
      <li className  = 'votation-card display-block'>
        <div class = 'votation-card__name'>
          <h3><Link to = {votationPath} >{name}</Link></h3>
        </div>
        <div class = 'votation-card__desc text-gray'>
          <p>{desc}</p>
        </div>
        <div class = 'clearfix'>
          <div class = 'votation-card__votes float-left'>
            {votes.map((vote, i) => <div className = 'vote-sm' key = {i}>{vote}</div> )}
          </div>
          <div  class = 'user-card-sm float-right clearfix'>
            <div class = 'user-card-sm__date'>created
              <span>{createdAt}</span>
            </div>
            <img class = 'user-card-sm__avatar float-left' src={creatorAvatar} width='50' height='50'></img>                  
            <div class = 'user-card-sm__name float-left'>
            <Link to = {creatorPath} >{creatorName}</Link>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

VotationCard.prototypes = {
  id: PropTypes.number.isRequired, 
  name: PropTypes.string.isRequired, 
  desc: PropTypes.string.isRequired, 
  votes: PropTypes.array.isRequired, 
  createdAt: PropTypes.string.isRequired, 
  creatorName: PropTypes.string.isRequired, 
  creatorId: PropTypes.number.isRequired, 
  creatorAvatar: PropTypes.string.isRequired
};