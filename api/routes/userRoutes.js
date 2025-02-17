
'use strict'
const { authenticateUser } = require('../middleware/userAuth')
const { User } = require('../models')
const { asyncHandler } = require('../middleware/asyncHandler')
const express = require('express')
const router = express.Router()

// GET /api/users route
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = await req.currentUser
  res.status(200).json({ id: user.id, firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress })
}))

/* CREATE a new user */
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body)
    res.location('/').status(201).end()
  } catch (error) {
    console.log('ERROR: ', error.name)

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message)
      res.status(400).json({ errors })
    } else {
      throw error
    }
  }
}))

module.exports = router;



