import fetch from 'isomorphic-fetch'

export default function setState (opts) {
  const {
    token, selector, power, color, infrared, duration
  } = opts

  if (!color && !power) { return opts }

  opts.verbose && console.log('setting state')

  return fetch(`https://api.lifx.com/v1/lights/${selector}/state`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      power,
      color,
      infrared,
      duration
    })
  })
  .then(res => res.json())
  .then(json => ({ type: 'setState', json }))
  .then(msg => Promise.reject(msg))
}
