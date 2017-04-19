import fetch from 'isomorphic-fetch'

export default function setState (info) {
  const {
    token, selector, power, color, infrared, duration
  } = info
  if (!color && !power) { return info }
  console.log('setting state')

  const path = `https://api.lifx.com/v1/lights/${selector}/state`
  const method = 'PUT'
  const headers = { 'Authorization': `Bearer ${token}` }
  const body = JSON.stringify({
    power, color, infrared, duration
  })

  return fetch(path, { method, headers, body })
    .then(res => res.json())
    .then(json => ({ type: 'setState', json }))
    .then(msg => Promise.reject(msg))
}
