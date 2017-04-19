import fetch from 'isomorphic-fetch'
/**
 * Lists the lights associated with the given token
 * @param  {String} token The api token
 * @return {Promise<(Response|Error)>}       [description]
 */
export default function listLights (info) {
  info.verbose && console.log('info', info)
  if (!info.status) { return info }

  info.verbose && console.log('listing nodes')
  const { token } = info

  const method = 'GET'
  const path = 'https://api.lifx.com/v1/lights/all'
  const headers = { 'Authorization': `Bearer ${token}` }

  return fetch(path, { method, headers })
    .then(resp => resp.json())
    .then(json => ({ type: 'listLights', json }))
    .then(msg => Promise.reject(msg))
}
