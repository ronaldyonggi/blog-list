const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('fetching all blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned and have correct amount', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique identifier property of blog posts is named id', async () => {
    // Fetch blogs
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const fetchedBlogs = response.body
    // Get the first blog
    const firstBlog = fetchedBlogs[0]
    // Check that the blog's id is defined
    expect(firstBlog.id).toBeDefined
  })
})

describe('adding a new blog', () => {
  test('should be successful with valid data', async () => {
    const newBlog = {
      title: 'this is a new blog',
      author: 'Jenkins M',
      url: 'www.heyblog.org',
      likes: 376
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('this is a new blog')
  })

  test('if likes is not provided, blog would be created with default 0 likes', async () => {
    const newBlog = {
      title: 'a blog without likes',
      author: 'Unlikeable',
      url: 'no url'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    // Check blog length at the end is 1 more than initial blogs
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    // Find the blog that was created and check that its likes is equal to 0
    const noLikesBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    expect(noLikesBlog.likes).toBe(0)
  })

  test('if title property is missing from request data, receives 400', async () => {
    const newBlog = {
      author: 'no title',
      url: 'mfiasdmas',
      likes: 34
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    // Check if the number of blogs change
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if url property is missing from request data, receives 400', async () => {
    const newBlog = {
      title: 'Blog with no url',
      author: 'May Heny',
      likes: 999
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    // Check if the number of blogs change
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

})

describe('deleting a blog', () => {
  test('delete successful with status code 204 if id is valid', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogToDelete = initialBlogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    // Check that the number of blogs decreases by 1
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    // Check that none of the blogs contain the deleted blog's title
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('blog can be successfully updated given valid request', async () => {
    const initialBlogs = await helper.blogsInDb()

    const blogToUpdate = initialBlogs[0]
    const updatedBlog = { ...blogToUpdate, likes: 999999 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(blog => blog.likes)
    expect(likes).toContain(updatedBlog.likes)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})