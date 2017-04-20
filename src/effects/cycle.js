import fetch from 'isomorphic-fetch'

export default function cycle (opts) {
  const { token, selector, cycle, states, defaults } = opts
  if (!cycle) { return opts }

  return fetch(`https://api.lifx.com/v1/lights/${selector}/cycle`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: { states, defaults, direction: 'forward' }
  })
  .then(resp => resp.json())
  .then(json => ({ type: 'cycle', json }))
  .then(msg => Promise.reject(msg))
}
