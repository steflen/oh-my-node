$(document).ready(() => {
  PNotify.defaultStack = {
    dir1: 'up',
    dir2: 'left',
    firstpos1: 25,
    firstpos2: 25,
  }

  const flashIo = io.connect('/flash', {
    reconnection: false,
  })

  // flashIo.on('connect', function() {
  //   console.log("flashIo frontend connect")
  //   flashIo.emit('init', {
  //     value: 'hallo init',
  //   })
  // })
  //
  // flashIo.on('update', function(data) {
  //   console.log("flashIo frontend update")
  // })

  // flash messages that originate from socket.io (can occur at runtime)
  flashIo.on('flashError', data => {
    PNotify.error({
      text: data,
      addClass: 'nonblock',
      stack: PNotify.defaultStack,
      hide: true,
      delay: 5000,
    })
  })

  flashIo.on('flashInfo', data => {
    console.log('flashInfo ==> ' + data)
    PNotify.info({
      text: data,
      addClass: 'nonblock',
      stack: PNotify.defaultStack,
      hide: true,
      delay: 5000,
    })
  })

  flashIo.on('flashSuccess', data => {
    PNotify.success({
      text: data,
      addClass: 'nonblock',
      stack: PNotify.defaultStack,
      hide: true,
      delay: 5000,
    })
  })

  flashIo.on('flashNotice', data => {
    PNotify.notice({
      text: data,
      addClass: 'nonblock',
      stack: PNotify.defaultStack,
      hide: true,
      delay: 5000,
    })
  })

  // messages that originate from express flash stack (only on page load)
  if (flash.info) {
    PNotify.info({
      text: flash.info,
      addClass: 'nonblock',
      stack: PNotify.defaultStack,
      hide: true,
      delay: 5000,
    })
  }
  if (flash.error) {
    PNotify.error({
      text: flash.error,
      addClass: 'nonblock',
      stack: PNotify.defaultStack,
      hide: true,
      delay: 5000,
    })
  }
  if (flash.success) {
    PNotify.success({
      text: flash.success,
      addClass: 'nonblock',
      stack: PNotify.defaultStack,
      hide: true,
      delay: 5000,
    })
  }
  if (flash.notice) {
    PNotify.notice({
      text: flash.notice,
      addClass: 'nonblock',
      stack: PNotify.defaultStack,
      hide: true,
      delay: 5000,
    })
  }
})
