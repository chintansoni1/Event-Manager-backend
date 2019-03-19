'use strict'

import nodemailer from 'nodemailer'
import {
  EMAIL_CONFIG
} from '../config/email-config'

const emailTransport = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: EMAIL_CONFIG.USERNAME,
    pass: EMAIL_CONFIG.PASSWORD
  }
})

const emailOptions = {
  from: EMAIL_CONFIG.USERNAME,
  to: '',
  subject: '',
  html: ''
}

const sendEMail = (mailOptions, callback) => {
  const errorList = []
  if (!mailOptions.to) {
    errorList.push("Receiver's email address can't be empty.")
  }
  if (!mailOptions.subject) {
    errorList.push("Email subject can't be empty")
  }
  if (errorList.length === 0) {
    emailTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        callback(error, 400)
      } else {
        console.log('Email sent: ' + info.response)
        callback(null, 200)
      }
    })
  } else {
    callback(errorList, 400)
  }
}

export {
  emailTransport,
  emailOptions,
  sendEMail
}