import fetch from 'isomorphic-fetch'

// curl -X POST "https://api.lifx.com/v1/lights/all/toggle" \
//      -H "Authorization: Bearer YOUR_APP_TOKEN"

export default function togglePower (info) {
  const { token, toggle, selector, duration } = info
  if (!toggle) { return info }
  console.log('toggling')
  const path = `https://api.lifx.com/v1/lights/${selector}/toggle`
  const method = 'PUT'
  const headers = { 'Authorization': `Bearer ${token}` }
  const body = JSON.stringify({ duration })
  return fetch(path, { method, headers, body })
    .then(res => res.json())
    .then(json => ({ type: 'togglePower', json }))
    .then(Promise.reject)
}
