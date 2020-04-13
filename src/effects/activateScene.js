import fetch from 'isomorphic-fetch'

export default function activateScene (opts) {
  const { token, scene, duration } = opts

  if (!scene) { return opts }

  return fetch(`https://api.lifx.com/v1/scenes/scene_id:${scene}/activate`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ duration })
  })
  .then(resp => resp.json())
  .then(json => ({ type: 'activateScene', json }))
  .then(msg => Promise.reject(msg))
}
