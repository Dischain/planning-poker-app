'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ControlledInput from '../ControlledInput.js';
import LoadingButton from '../LoadingButton.js';
import ErrorMessage from '../ErrorMessage.js';
import {
  login,
  changeForm,
  setLoginFormIsValid,
  setLoginFormErrorMessages
} from '../../actions/loginActions.js';

const assign = Object.assign;

// TODO: create separete container component for submit btn
class LoginPage extends Component {
  render() {
    let submitBtn;

    if (!this.props.isLoginFormValid) {
      submitBtn = 
      <button className = 'form__submit-btn' type = 'submit'>Login</button>
    } else if (this.props.sendingLoginRequest) {
      submitBtn = <LoadingButton btnText = {'Login'}/>
    } else {
      submitBtn = 
      <button className="form__submit-btn form__submit-btn_active" type="submit">Login</button>
    }

    return (
      <div className = 'form-page__wrapper'>        
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Login</h2>
          </div>

          <form className = 'form' onSubmit = {this._onSubmit.bind(this)}>
            <ControlledInput formId = {'email'}
              fieldName = {'Email'}
              type = {'text'}
              value = {this.props.loginFormState.email}
              placeholder = {'Enter Your Email'}
              onChange = {this._onChangeEmail.bind(this)}
              errorMessage = {this.props.loginFormErrorMessages.email}
            />
            <ControlledInput formId = {'password'}
              fieldName = {'Password'}
              type = {'password'}
              value = {this.props.loginFormState.password} 
              onChange = {this._onChangePassword.bind(this)}
              errorMessage = {this.props.loginFormErrorMessages.password}
            />

            <ErrorMessage errorMessage = {this.props.loginError} />

            <div className = 'form__submit-btn-wrapper'>
              {submitBtn}
            </div>
          </form>                
        </div>
      </div>
    );
  }

  _onSubmit(event) {
    event.preventDefault();

    if (this.props.isLoginFormValid) {
      this.props.login({
        email: this.props.loginFormState.email,
        password: this.props.loginFormState.password,        
      });
    }
  }

  _onChangeEmail(event) {
    let value = event.target.value;

    let newState = assign(this.props.loginFormState, {
      email: value
    });
    let errorMsgs = assign({}, this.props.loginFormErrorMessages);

    this.props.dispatch(changeForm(newState));

    if (!value.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,4}$/i)) {
      errorMsgs.email = 'Invalid email';
      this.props.dispatch(setLoginFormIsValid(false));      
    } else if (value.length === 0) {
      errorMsgs.email = 'Empty field';
      this.props.dispatch(setLoginFormIsValid(false)); 
    } else {
      errorMsgs.email = '';
      this.props.dispatch(setLoginFormIsValid(true));
    }

    this.props.dispatch(setLoginFormErrorMessages(errorMsgs));
  }

  _onChangePassword(event) {
    let value = event.target.value;
    let newState = assign(this.props.loginFormState, {
      password: value
    });
    let errorMsgs = assign({}, this.props.loginFormErrorMessages);

    this.props.dispatch(changeForm(newState));

    if (value.length === 0) {
      errorMsgs.password = 'Empty field';
      this.props.dispatch(setLoginFormIsValid(false)); 
    } else {
      errorMsgs.password = '';
      this.props.dispatch(setLoginFormIsValid(true));
    }

    this.props.dispatch(setLoginFormErrorMessages(errorMsgs));
  }
}

function mapStateToProps({ loginReducer }) {
  return {
    loginFormState: loginReducer.loginFormState,
    sendingLoginRequest: loginReducer.sendingLoginRequest,
    loginError: loginReducer.loginError,
    isLoginFormValid: loginReducer.isLoginFormValid,    
    loginFormErrorMessages: loginReducer.loginFormErrorMessages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    login: userData => dispatch(login(userData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);