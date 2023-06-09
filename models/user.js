const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Users have username, password, and name
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: [3, 'username must be at least 3 characters long!'],
    unique: true
  },
  name: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(uniqueValidator)

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