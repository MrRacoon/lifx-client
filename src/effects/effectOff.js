import fetch from 'isomorphic-fetch'

export default function effectOff (opts) {
  const { token, effectOff, selector, power } = opts
  if (!effectOff) { return opts }

  return fetch(`https://api.lifx.com/v1/lights/${selector}/effects/off`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      power_off: !power
    })
  })
  .then(resp => resp.json())
  .then(json => ({ type: 'effectOff', json }))
  .then(msg => Promise.reject(msg))
}
