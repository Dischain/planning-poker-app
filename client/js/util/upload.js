'use strict';

export function upload(url, file, name, id) {
  let formData = new FormData();
  
  formData.append(name, file);
  formData.append('id', id);

  return fetch(url, {
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Length': file.size
    },
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    body: formData
  });
}