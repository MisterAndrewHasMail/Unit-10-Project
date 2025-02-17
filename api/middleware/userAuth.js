'use strict'

const auth = require('basic-auth')
const bycrpt = require('bcryptjs')
const { User } = require('../models')


exports.authenticateUser = async (req, res, next) => {
  let message

  const credientials = auth(req)

  if (credientials) {
    const user = await User.findOne({ where: { emailAddress: credientials.name } })
    if (user) {
      let authenticated = bycrpt.compareSync(credientials.pass, user.password)
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`)

        // Store the user on the Request object.
        req.currentUser = user
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`
      }
    } else {
      message = `No user found with email address: ${credientials.name}`
    }
  } else {
    message = 'Auth header not found'
  }
  if (message) {
    console.warn(message)
    res.status(401).json({ message: 'Access Denied' })
  } else {
    next()
  }
}