import fetch from 'isomorphic-fetch'
export default function breatheEffect (opts) {
  const {
    token, selector, breathe,
    color, from, period, cycles, persist, power, peak
  } = opts

  if (!breathe || !color) { return opts }

  return fetch(`https://api.lifx.com/v1/lights/${selector}/effects/breathe`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      color,
      from_color: from,
      period,
      cycles,
      persist,
      power_on: power,
      peak
    })
  })
  .then(resp => resp.json())
  .then(json => ({ type: 'breatheEffect', json }))
  .then(msg => Promise.reject(msg))
}
