const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const { default: mongoose } = require('mongoose')

beforeEach(async () => {
  // Clear up all users in test DB
  await User.deleteMany({})

  // Create a root user in DB
  const passwordHash = await bcrypt.hash('password', 10)
  const rootUser = new User({ username: 'root', passwordHash })

  await rootUser.save()
})

describe('creating a user', () => {

  test('successful with username that has not been taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'heyathere',
      name: 'Hein Maydale',
      password: 'bluemne'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })
  test('failed if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'newuser',
      password: 'abc123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('failed if username is less than 3 characters length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ss',
      name: 'Shorty',
      password: 'hashiaw'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('failed if password is less than 3 characters length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'tooShortPass',
      name: 'Jen Newton',
      password: 'aa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long!')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})