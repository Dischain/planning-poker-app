'use strict';

export function upload(filen, name) {
  let formData = new FormData();

  formData.append(name, file);
  console.log(name); console.log(file);
  return fetch(API_BASE_PATH + '/upload', {
    headers: {
      'Accept': 'application/json, text/plain, */*'      
    },
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    body: formData
  });
}