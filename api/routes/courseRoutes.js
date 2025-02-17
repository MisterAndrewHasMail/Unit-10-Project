'use strict'

const express = require('express')
const router = express.Router()
const { User, Course } = require('../models')
const { authenticateUser } = require('../middleware/userAuth')
const { asyncHandler } = require('../middleware/asyncHandler')

// POST /api/courses (Create a new course)
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    let course = await Course.create(req.body)
    res.status(201).location(`courses/${course.id}`).end()
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

// GET /api/courses route
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [{
      model: User,
      as: 'owner',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  })
  res.status(200).json(courses)
}))

// GET /api/courses/:id route
router.get('/courses/:id', asyncHandler(async (req, res) => {
  let courseId = req.params.id
  const course = await Course.findByPk(courseId, {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [{
      model: User,
      as: 'owner'
    }]
  })
  res.status(200).json(course)
}))


// PUT /api/courses/:id (Update an existing course)
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    let courseId = req.params.id
    const user = req.currentUser
    const course = await Course.findByPk(courseId)

    if (course.userId === user.id) {
      await course.update(req.body)
      res.status(204).end()
    } else {
      res.status(403).end()
    }
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


// DELETE /api/courses/:id route
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  let courseId = req.params.id
  const user = req.currentUser
  const course = await Course.findByPk(courseId)

  if (course.userId === user.id) {
    await course.destroy()
    res.status(204).end()
  } else {
    res.status(403).end()
  }
}))

module.exports = router
