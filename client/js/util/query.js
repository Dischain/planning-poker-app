'use strict';

export function constructQuery(data) {
  return Object.keys(data).reduce((init, key, i) => {
    return i !== 0 ? 
      init + '&' + key + '=' + data[key] :
      init + key + '=' + data[key]      
  }, '?');
}