const totalLikes = require('../utils/list_helper').totalLikes

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  const list3Blogs = [
    {
      title: 'title 1',
      author: 'Jenkins Mayd',
      url: 'no url',
      likes: 3
    },
    {
      title: 'The one without money',
      author: 'Jay Windzkit',
      url: 'no url',
      likes: 7
    },
    {
      title: 'Is this true',
      author: 'Minda',
      url: 'no url',
      likes: 10
    },
  ]

  test('when the list has multiple blogs, correctly calculate the total likes', () => {
    const result = totalLikes(list3Blogs)
    expect(result).toBe(20)
  })
})