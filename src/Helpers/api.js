import axios from 'axios';

export const putApiCall = (url, method, headers, data) => {
  var config = {
    method,
    url: 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/' + url,
    headers,
    data,
  };
  
  return axios(config)
  .then((response) => {
    return response;
  })
  .catch(function (error) {
    if (error.status === 403) {
      localStorage.removeItem('token');
    }
  });
}