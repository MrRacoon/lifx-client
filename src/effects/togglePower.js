import fetch from 'isomorphic-fetch'

export default function togglePower (opts) {
  const { token, toggle, selector, duration } = opts
  if (!toggle) { return opts }
  opts.verbose && console.log('toggling')

  return fetch(`https://api.lifx.com/v1/lights/${selector}/toggle`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ duration })
  })
  .then(res => res.json())
  .then(json => ({ type: 'togglePower', json }))
  .then(msg => Promise.reject(msg))
}
