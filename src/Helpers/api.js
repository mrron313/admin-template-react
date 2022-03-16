import axios from 'axios';

export const putApiCall = (url, method, headers, data) => {
  var config = {
    method,
    url,
    headers,
    data,
  };
  
  return axios(config)
  .then((response) => {
    console.log(response, url, 'response')
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });
}