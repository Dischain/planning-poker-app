'use strict';

export function upload(url, file, name, id) {
  let formData = new FormData();

  formData.append(name, file);
  console.log(name); console.log(file);
  return fetch(url, {
    headers: {
      'Accept': 'application/json, text/plain, */*',
       'Content-Type': 'multipart/form-data'
    },
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    body: { formData, id }
  });
}