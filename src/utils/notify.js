import path from 'path'
import nodify from 'node-notifier'

export default function notifier (message) {
  const icon = path.resolve(__dirname, '..', '..', 'images', 'icon.png')
  nodify.notify({ title: 'Lifx-client', message, icon, time: 0.7 })
}
