import fetch from 'isomorphic-fetch'
// curl -X POST "https://api.lifx.com/v1/lights/all/effects/pulse" \
//      -H "Authorization: Bearer YOUR_APP_TOKEN" \
//      -d 'period=2' \
//      -d 'cycles=5' \
//      -d 'color=green'
export default function breatheEffect (opts) {
  const {
    token, selector, pulse,
    color, from, period, cycles, persist, power
  } = opts

  if (!pulse || !color) { return opts }

  return fetch(`https://api.lifx.com/v1/lights/${selector}/effects/pulse`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      color,
      'from_color': from,
      period,
      cycles,
      persist,
      power_on: power
    })
  })
  .then(resp => resp.json())
  .then(json => ({ type: 'pulseEffect', json }))
  .then(msg => Promise.reject(msg))
}
