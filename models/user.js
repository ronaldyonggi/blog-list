const mongoose = require('mongoose')

// Users have username, password, and name
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})

// Transform the formatting for user schema
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Transfrom _id field to id
    returnedObject.id = returnedObject._id.toString()

    // Remove _id field and __v
    delete returnedObject._id
    delete returnedObject.__v

    // The passwordHash field MUST be removed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User