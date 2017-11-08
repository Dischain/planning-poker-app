'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ControlledInput from '../ControlledInput.js';
import LoadingButton from '../LoadingButton.js';
import ErrorMessage from '../ErrorMessage.js';
import { 
  register,
  changeForm,
  setRegisterFormIsValid,
  setRegisterFormErrorMessages
} from '../../actions/registerActions.js';

const assign = Object.assign;

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
            <h2 className='form-page__form-heading'>Register</h2>
          </div>

          <form 
            className = 'form' 
            onSubmit = {this._onSubmit.bind(this)}            
          >
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
              errorMessage = {this.props.registerFormErrorMessages.password1}
            />
            <ControlledInput formId = {'password2'}
              fieldName = {'Confirm Password'}
              type = {'password'}
              value = {this.props.registerFormState.password2}
              onChange = {this._onChangePassword2.bind(this)}
              errorMessage = {this.props.registerFormErrorMessages.password2}
            />
            <input 
              type = 'file' 
              name = 'avatarField' 
              onChange = {this._onChangeFile.bind(this)}
            />
            
            <ErrorMessage errorMessage = {this.props.registerError} />

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

    if (this.props.isRegisterFormValid) {
      this.props.register({
        name: this.props.registerFormState.name,
        email: this.props.registerFormState.email,
        password2: this.props.registerFormState.password2,
        avatar: this.props.registerFormState.avatar
      });
    }
  }

  _onChangeFile(event) {
    let reader = new FileReader();
    let file = event.target.files[0];
    
    reader.onloadend = () => {
      let newState = assign({}, this.props.registerFormState, {
        avatar: file
      });
      
      this.props.dispatch(changeForm(newState));
    }

    reader.readAsDataURL(file)
  }

  _onChangeName(event) {
    let value = event.target.value;
    let newState = assign({}, this.props.registerFormState, {
      name: value
    });
    let errorMsgs = assign({}, this.props.registerFormErrorMessages);

    this.props.dispatch(changeForm(newState));

    if (value.length === 0) {
      errorMsgs.name = 'Empty field';
      this.props.dispatch(setRegisterFormIsValid(false));      
    } else {
      errorMsgs.name = '';
      this.props.dispatch(setRegisterFormIsValid(true));      
    }

    this.props.dispatch(setRegisterFormErrorMessages(errorMsgs));
  }

  _onChangeEmail(event) {
    let value = event.target.value;
    let newState = assign(this.props.registerFormState, {
      email: value
    });
    let errorMsgs = assign({}, this.props.registerFormErrorMessages);

    this.props.dispatch(changeForm(newState));

    if (!value.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,4}$/i)) {
      errorMsgs.email = 'Invalid email';
      this.props.dispatch(setRegisterFormIsValid(false));      
    } else {
      errorMsgs.email = '';
      this.props.dispatch(setRegisterFormIsValid(true));
    }

    this.props.dispatch(setRegisterFormErrorMessages(errorMsgs));
  }

  _onChangePassword1(event) {
    let value = event.target.value;    
    let newState = assign(this.props.registerFormState, {
      password1: value
    });
    let errorMsgs = assign({}, this.props.registerFormErrorMessages);

    this.props.dispatch(changeForm(newState));

    if (value !== this.props.registerFormState.password2) {
      errorMsgs.password1 = 'Passwords does not match';
      this.props.dispatch(setRegisterFormIsValid(false));
    } else if (value === '') {
      errorMsgs.password1 = 'Empty field';
      this.props.dispatch(setRegisterFormIsValid(false));
    } else {
      errorMsgs.password2 = errorMsgs.password1 = '';
      this.props.dispatch(setRegisterFormIsValid(true));
    }

    this.props.dispatch(setRegisterFormErrorMessages(errorMsgs));    
  }

  _onChangePassword2(event) {
    let value = event.target.value;    
    let newState = assign(this.props.registerFormState, {
      password2: value
    });
    let errorMsgs = assign({}, this.props.registerFormErrorMessages);
    
    this.props.dispatch(changeForm(newState));

    if (value !== this.props.registerFormState.password1) {
      errorMsgs.password2 = 'Passwords does not match';
      this.props.dispatch(setRegisterFormIsValid(false));
    } else if (value === '') {
      errorMsgs.password2 = 'Empty field';
      this.props.dispatch(setRegisterFormIsValid(false));
    } else {
      errorMsgs.password2 = errorMsgs.password1 = '';
      this.props.dispatch(setRegisterFormIsValid(true));
    }

    this.props.dispatch(setRegisterFormErrorMessages(errorMsgs));    
  }
}

function mapStateToProps({ registerReducer }) {
  return {
    registerFormState: registerReducer.registerFormState,
    sendingRegisterRequest: registerReducer.sendingRegisterRequest,
    registerError: registerReducer.registerError,
    isRegisterFormValid: registerReducer.isRegisterFormValid,    
    registerFormErrorMessages: registerReducer.registerFormErrorMessages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    register: userData => dispatch(register(userData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);