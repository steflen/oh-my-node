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
    sslPassphrase: 'kiz-kiz-bam-bam',
  },
  log: {
    directory: 'logs',
    maxSize: '5m',
    zip: false,
    datePattern: 'YYYY-MM-DD',
    severity: 'silly',
  },
  jwt: {
    secret: 'wadde-hadde-dudde-da',
  },
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_MAILER,
  },
  mongo: {
    connectionString: 'mongodb://localhost:27017/oh-my-node',
    settings: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000,
      bufferCommands: false,
      connectTimeoutMS: 10000,
      useCreateIndex: true,
    },
  },
}
