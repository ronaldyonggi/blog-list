const logger = require('./logger')

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
  errorHandler
}