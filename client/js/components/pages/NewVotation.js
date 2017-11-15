'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ControlledInput from '../ControlledInput.js';
import ControllArea from '../ControlledArea.js';

import { changeNVState } from '../../actions/votationsActions.js';

const assign = Object.assign;

class NewVotation extends Component {  
  render() {
    let { title, description } = this.props.nvState;
    console.log(this.props.nvState);
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
            value = {this.props.nvState.title} 
            onChange = {this._onChangeTitle.bind(this)}
          />
          <ControllArea 
            fieldName = {'Description'}
            value = {this.props.nvState.description} 
            onChange = {this._onChangeDesc.bind(this)}
          />
        </div>
      </div>
    );
  }

  _onChangeTitle(event) {
    let value = event.target.value;
    console.log(value)
    let newState = assign(this.props.nvState, {
      title: value
    });
    this.props.dispatch(changeNVState(newState));
  }

  _onChangeDesc(event) {
    let value = event.target.value;
    console.log(value)
    let newState = assign(this.props.nvState, {
      description: value
    });
    this.props.dispatch(changeNVState(newState));
  }
}

function mapStateToProps({ votationsReducer }) {
  return {
    nvState: votationsReducer.nvState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    changeNVState: data => dispatch(changeNVState(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewVotation);