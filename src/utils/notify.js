import path from 'path'
import nodify from 'node-notifier'

export default function notifier (opts, message) {
  const icon = path.resolve(__dirname, '..', '..', 'images', 'icon.png')
  nodify.notify({
    title: `lifx: ${message.type}`,
    message: JSON.stringify(message.json),
    icon,
    time: 0.7
  })
}
