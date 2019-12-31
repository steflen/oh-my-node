// just the same as in dev ;)

const hostname = require('os').hostname()

module.exports = {
  app: {
    startupDelay: 2000,
    localHostname: hostname,
    title: 'Oh My Node',
  },
  server: {
    allowInsecure: true,
    httpPort: 8000,
    httpsPort: 8443,
    startupDelay: 1000,
  },
  log: {
    directory: 'logs',
    maxSize: '5m',
    zip: false,
    datePattern: 'YYYY-MM-DD',
    namespacePrefix: 'tatü-tata-',
    severity: 'silly',
  },
  discovery: {
    hostname: hostname,
    domain: `${hostname}.local`,

    port: 8881,
    type: 'http',
    protocol: 'tcp',
    txt: {
      best: 'regards',
      whoAmI: 'steLen',
    },
  },
}
