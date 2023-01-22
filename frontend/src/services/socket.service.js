import io from 'socket.io-client'

export const socketEmits = {
  SEND_MSG: 'chat-send-msg',
  SET_TOPIC: 'chat-set-topic',
  USER_WATCH: 'user-watch'
}

export const socketEvents = {
  ADD_MSG: 'chat-add-msg',
  USER_UPDATED: 'user-updated',
  REVIEW_ADDED: 'review-added',
  REVIEW_REMOVED: 'review-removed',
  REVIEW_ABOUT_YOU: 'review-about-you'
}

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
export const socketService = createSocketService()

socketService.setup()

function createSocketService() {
  var socket = null
  const socketService = {
    setup() {
      socket = io(baseUrl)
    },
    on(eventName, cb) {
      socket.on(eventName, cb)
    },
    off(eventName, cb = null) {
      if (!socket) return
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName, data) {
      data = JSON.parse(JSON.stringify(data))
      socket.emit(eventName, data)
    },
    login(userId) {
      socket.emit(SOCKET_EMIT_LOGIN, userId)
    },
    logout() {
      socket.emit(SOCKET_EMIT_LOGOUT)
    },
    terminate() {
      socket = null
    }
  }
  return socketService
}
