const User = require('../models/user')
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  // Only executes if request.token exists
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    } else {
      request.user = await User.findById(decodedToken.id)
    }
  }

  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  switch (error.name) {
    case ('CastError'):
      return response.status(400).send({ error: 'malformatted id!' })
    case ('ValidationError'):
      return response.status(400).send({ error: error.message })
    case ('JsonWebTokenError'):
      return response.status(400).send({ error: error.message })
  }

  next(error)
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}