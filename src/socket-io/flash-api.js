const socketIo = require('socket.io')

module.exports = () => {
  const io = socketIo()

  const flashIo = io.of('/flash')

  const flash = {
    info(data) {
      flashIo.emit('flashInfo', data)
    },
    error(data) {
      flashIo.emit('flashError', data)
    },
    success(data) {
      flashIo.emit('flashSuccess', data)
    },
    notice(data) {
      flashIo.emit('flashNotice', data)
    },
  }

  return {
    io,
    flash,
  }
}
