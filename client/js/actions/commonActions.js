'use strict';

import { setLoginError } from './loginActions.js';
import { setRegisterError } from './registerActions.js';

export function setErrorMessage(type, message) {
  return (dispatch) => {
    const setError = type === 'login' ? setLoginError : setRegisterError;

    dispatch(setError(message));
  
    const form = document.querySelector('.form-page__form-wrapper');
    if (form) {
      form.classList.add('js-form__err-animation');
      
      setTimeout(() => {
        form.classList.remove('js-form__err-animation');
      }, 150);
  
      setTimeout(() => {
        dispatch(setError(''));
      }, 3000);
    }
  }  
}