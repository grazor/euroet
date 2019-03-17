/* eslint-disable prefer-promise-reject-errors */

export default (url, options = {}) => {
  const token = localStorage.getItem('token');
  let requestOptions = options;
  if (token)
    requestOptions = {
      ...options,
      headers: { ...options.headers, Authorization: `Token ${token}` },
    };

  return new Promise((resolve, reject) =>
    fetch(url, requestOptions)
      .then(response => (response.status === 204 ? resolve({}) : response))
      .then(
        response =>
          response.status >= 500
            ? reject({ status: response.status })
            : response,
      )
      .then(response =>
        response.json().then(data => ({ status: response.status, data })),
      )
      .then(
        ({ status, data }) =>
          status >= 400 ? reject({ status, data }) : resolve(data),
      )
      .catch(error => reject({ status: null, error })),
  );
};
