
export default function selector (opts) {
  return function _selector (obj) {
    const { id, label, group, location } = opts
    return Object.assign({}, obj, {
      selector:
        (id && `id:${id}`) ||
        (label && `label:${label}`) ||
        (group && `group:${group}`) ||
        (location && `location:${location}`) ||
        'all'
    })
  }
}
