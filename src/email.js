const nodemailer = require('nodemailer')

const sendMail = options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: 'maxbrokhman@yandex.ru',
    to: options.email,
    subject: options.subject,
    text: options.text,
  }

  transporter.sendMail(mailOptions)
}

module.exports = {
  sendMail,
}
