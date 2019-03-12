export default (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (token)
    options = {
      ...options,
      headers: { ...options.headers, Authorization: `Token ${token}` },
    };

  return new Promise((resolve, reject) => {
    return fetch(url, options)
      .then(response => (response.status >= 400 ? reject(response) : response))
      .then(response => response.json())
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};
