const sendGrid = require('@sendgrid/mail')

class Mailer {
  constructor({ config, appLog }) {
    this.log = appLog
    this.config = config
    sendGrid.setApiKey(config.sendGrid.apiKey)
  }

  sendActivationCode(destination, activationCode, sandboxMode = false) {
    return sendGrid
      .send({
        to: destination,
        from: this.config.sendGrid.origin,
        subject: 'Code for Registration',
        html: `Your activation code for first time login is: ${activationCode}`,
        mailSettings: {
          sandboxMode: {
            enable: sandboxMode,
          },
        },
      })
      .then(([response, body]) => {
        this.log.info('Email has been sent')
        this.log.info(response.statusMessage)

        if (response.statusCode >= 300) {
          this.log.error('SendGrid request error')
          this.log.error(body)
        }
      })
  }

  sendPasswordReset(destination, oneTimePassword, sandboxMode = false) {
    return sendGrid
      .send({
        to: destination,
        from: this.config.sendGrid.origin,
        subject: 'Code for Password reset',
        html: `Your code for password reset is: ${oneTimePassword}`,
        mailSettings: {
          sandboxMode: {
            enable: sandboxMode,
          },
        },
      })
      .then(([response, body]) => {
        this.log.info('Email has been sent')
        this.log.info(response.statusMessage)

        if (response.statusCode >= 300) {
          this.log.error('SendGrid request error')
          this.log.error(body)
        }
      })
  }
}

module.exports = Mailer
