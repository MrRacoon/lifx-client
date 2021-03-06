import fetch from 'isomorphic-fetch'
/**
 * Lists the lights associated with the given token
 * @param  {String} token The api token
 * @return {Promise<(Response|Error)>}       [description]
 */
export default function listLights (opts) {
  const { token, status, selector } = opts
  if (!status) { return opts }

  return fetch(`https://api.lifx.com/v1/lights/${selector}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(resp => resp.json())
    .then(json => ({ type: 'listLights', json }))
    .then(msg => Promise.reject(msg))
}
