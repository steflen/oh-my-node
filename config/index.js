function setup() {
  if (process.env.NODE_ENV === 'development') {
    Error.stackTraceLimit = Infinity
    return require('./development')
  }
  return require('./production')
}

module.exports = {
  Config: Object.assign(
    {
      [process.env.NODE_ENV || 'development']: true,
      env: process.env.NODE_ENV || 'development',
    },
    setup()
  ),
}
