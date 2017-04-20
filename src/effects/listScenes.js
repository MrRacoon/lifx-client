import fetch from 'isomorphic-fetch'

export default function listScenes (opts) {
  const { token, listScenes } = opts
  if (!listScenes) { return opts }

  return fetch(`https://api.lifx.com/v1/scenes`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(resp => resp.json())
  .then(json => ({ type: 'listScenes', json }))
  .then(msg => Promise.reject(msg))
}
