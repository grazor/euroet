export default (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (token)
    options = {
      ...options,
      headers: { ...options.headers, Authorization: `Token ${token}` },
    };

  return new Promise((resolve, reject) => {
    return fetch(url, options)
      .then(response => (response.status == 204 ? resolve({}) : response))
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
      .catch(error => reject({ status: null, error }));
  });
};
