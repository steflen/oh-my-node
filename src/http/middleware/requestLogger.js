const morgan = require('morgan')

module.exports = httpLog =>
  morgan('common', {
    stream: {
      write: message => {
        httpLog.info(message.slice(0, -1))
      },
    },
  })
