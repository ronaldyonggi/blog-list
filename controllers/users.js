const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Fetch all users in DB
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

// Create a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validate password is at least 3 chars long
  if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long!' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await newUser.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter