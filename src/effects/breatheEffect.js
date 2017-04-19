import fetch from 'isomorphic-fetch'
// curl -X POST "https://api.lifx.com/v1/lights/all/effects/breathe" \
//      -H "Authorization: Bearer YOUR_APP_TOKEN" \
//      -d 'period=2' \
//      -d 'cycles=5' \
//      -d 'color=green'
export default function breatheEffect (opts) {
  const { token, selector, breathe, color } = opts

  if (!breathe || !color) { return opts }

  return fetch(`https://api.lifx.com/v1/lights/${selector}/effects/breathe`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      color
    })
  })
  .then(resp => resp.json())
  .then(json => Promise.reject(json))
}
