'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ControlledInput from '../ControlledInput.js';
import ControllArea from '../ControlledArea.js';
import UserSelector from '../UserSelector.js';

import { changeNVTitle, changeNVTDesc } from '../../actions/votationsActions.js';

const assign = Object.assign;

class NewVotation extends Component {  
  render() {
    let { nvTitle, nvDescription } = this.props;

    return (
      <div className = 'nv-page'>
        <div className = 'nv-page__header'>
          <h2>Create a new votation</h2>
        </div>
        <div className = 'nv-page__wrapper'>
          <ControlledInput 
            formId = {'title'}
            fieldName = {'Title'}
            type = {'text'}
            value = {nvTitle} 
            onChange = {this._onChangeTitle.bind(this)}
          />
          <ControllArea 
            fieldName = {'Description'}
            value = {nvDescription} 
            onChange = {this._onChangeDesc.bind(this)}
          />
          <div className = 'btn-add'></div>
          <div className = 'btn-rm'></div>
          
          <UserSelector />
        </div>
      </div>
    );
  }

  _onChangeTitle(event) {
    let value = event.target.value;
    this.props.changeNVTitle(value);
  }

  _onChangeDesc(event) {
    let value = event.target.value;
    this.props.changeNVTDesc(value);
  }
}

function mapStateToProps({ votationsReducer }) {
  return {
    nvTitle:  votationsReducer.nvTitle,
    nvDescription: votationsReducer.nvDescription
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    changeNVTitle: val => dispatch(changeNVTitle(val)),
    changeNVTDesc: val => dispatch(changeNVTDesc(val))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewVotation);