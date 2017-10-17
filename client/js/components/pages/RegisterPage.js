'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ControlledInput from '../ControlledInput.js';
import LoadingButton from '../LoadingButton.js';
import { 
  changeFrom,
  setRegisterFormIsValid,
  setRegisterFormErrorMessages
} from '../../actions/registerActions.js';

const assign = Object.assign

// TODO: avatar upload
class RegisterPage extends Component {
  render() {
    let submitBtn;

    if (!this.props.isRegisterFormValid) {
      submitBtn = 
      <button className = 'form__submit-btn' type = 'submit'>Send</button>
    } else if (this.props.sendingRegisterRequest) {
      submitBtn = <LoadingButton btnText = {'Send'}/>
    } else {
      submitBtn = 
      <button className="form__submit-btn form__submit-btn_active" type="submit">Send</button>
    }

    return (
      <div className = 'form-page__wrapper'>        
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Login</h2>
          </div>

          <div className = 'form' onSubmit = {this._onSubmit}>
            <ControlledInput formId = {'name'}
              fieldName = {'Name'}
              type = {'text'}
              value = {this.props.registerFormState.name}
              placeholder = {'Enter Your Name'}
              onChange = {this._onChangeName.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.name}
            />
            <ControlledInput formId = {'email'}
              fieldName = {'Email'}
              type = {'text'}
              value = {this.props.registerFormState.email}
              placeholder = {'Enter Your Email'}
              onChange = {this._onChangeEmail.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.email}
            />
            <ControlledInput formId = {'password1'}
              fieldName = {'Password'}
              type = {'password'}
              value = {this.props.registerFormState.password1} 
              onChange = {this._onChangePassword1.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.password2}
            />
            <ControlledInput formId = {'password2'}
              fieldName = {'Confirm Password'}
              type = {'password'}
              value = {this.props.registerFormState.password1}
              onChange = {this._onChangePassword2.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.password2}
            />
            <div className = 'form__submit-btn-wrapper'>

            </div>
          </div>          
          
          <div className='form-page__form-footer'>
            <div className='form-page__form-error'></div>
          </div>
        </div>
      </div>
    );
  }

  _onChangeName(event) {
    let value = event.target.value;

    let newState = assign(this.props.registerFormState, {
      name: value
    });

    this.props.dispatch(changeFrom(newState));

    if (value.length === 0) {
      this.props.dispatch(setRegisterFormIsValid(false));
      this.props.dispatch(setRegisterFormErrorMessages(
        assign(this.props.registerFormErrorMessages, {
        field: 'name', info: 'Empty field'
      })));
    } else {
      this.props.dispatch(setRegisterFormIsValid(true));
      this.props.dispatch(setRegisterFormErrorMessages(
        assign(this.props.registerFormErrorMessages, {
        field: 'name', info: ''
      })));
    }
  }

  _onChangeEmail(event) {
    let value = event.target.value;

    let newState = assign(this.props.registerFormState, {
      email: value
    });

    if (value.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,4}$/i)) {
      this.props.dispatch(setRegisterFormIsValid(false));
      this.props.dispatch(setRegisterFormErrorMessages(
        assign(this.props.registerFormErrorMessages, {
        field: 'email', info: 'Invalid email'
      })));
    } else {
      this.props.dispatch(setRegisterFormIsValid(true));
      this.props.dispatch(setRegisterFormErrorMessages(
        assign(this.props.registerFormErrorMessages, {
        field: 'email', info: ''
      })));
    }
  }

  _onChangePassword1(event) {
    let value = event.target.value;
    
    let newState = assign(this.props.registerFormState, {
      password1: value
    });

    if (value !== this.props.registerFormState.password2
    || (value === this.props.registerFormState.password2 === '')) {
      this.props.dispatch(setRegisterFormIsValid(false));
      this.props.dispatch(setRegisterFormErrorMessages(
        assign(this.props.registerFormErrorMessages, {
        field: 'password2', info: 'Passwords does not match'
      })));
    } else {
      this.props.dispatch(setRegisterFormIsValid(true));
      this.props.dispatch(setRegisterFormErrorMessages(
        assign(this.props.registerFormErrorMessages, {
        field: 'password2', info: ''
      })));
    }
  }

  _onChangePassword2(event) {
    let value = event.target.value;
    
    let newState = assign(this.props.registerFormState, {
      password2: value
    });

    if (value !== this.props.registerFormState.password1
    || (value === this.props.registerFormState.password1 === '')) {
      this.props.dispatch(setRegisterFormIsValid(false));
      this.props.dispatch(setRegisterFormErrorMessages(
        assign(this.props.registerFormErrorMessages, {
        field: 'password2', info: 'Passwords does not match'
      })));
    } else {
      this.props.dispatch(setRegisterFormIsValid(true));
      this.props.dispatch(setRegisterFormErrorMessages(
        assign(this.props.registerFormErrorMessages, {
        field: 'password2', info: ''
      })));
    }
  }
}

function mapStateToProps(state) {
  return {
    registerFormState: state.registerFormState,
    sendingRegisterRequest: state.sendingRegisterRequest,
    registerError: state.registerError,
    isRegisterFormValid: state.isRegisterFormValid,    
    registerFormErrorMessages: state.registerFormErrorMessages
  };
}

export default connect(mapStateToProps)(RegisterPage);