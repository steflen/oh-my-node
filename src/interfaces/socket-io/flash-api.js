const socketIo = require('socket.io')

module.exports = () => {
  const io = socketIo()

  const flashIo = io.of('/flash')

  // flashIo.on('connection', (socket) => {
  //   const roomName = 'flash'
  //   // this creates a new room if non exists already
  //   socket.join(roomName, (err) => {
  //     log.debug("client joined flashIo backend room")
  //   })
  //
  //   socket.on('init', (args) => {
  //     // console.log(args)
  //     log.debug("flashIo backend init, values => " + args)
  //   })
  //
  //   socket.on('error', (error) => {
  //     log.debug(`flashIo backend error: ${error}`)
  //   })
  //
  //   socket.on('disconnect', (status) => {
  //     log.debug(`flashIo backend connection ${roomName} lost, reason: ${status}`)
  //   })
  // })

  return {
    io,
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
}
