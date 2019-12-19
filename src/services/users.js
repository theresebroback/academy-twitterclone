const API_URL = '/api';

export function signUp({ name, handle, password }) {
  return fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': localStorage.getItem('twitter_clone_token')
    },
    body: JSON.stringify({ name, handle, password })
  })
  .then((res) => res.json());
}
