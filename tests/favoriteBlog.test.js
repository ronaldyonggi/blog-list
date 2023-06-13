const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favorite blog', () => {

  test('when list has only one blog, equals that blog', () => {
    const listWithOneBlog = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      }
    ]

    const expected = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }

    const result = favoriteBlog(listWithOneBlog)
    expect(result).toEqual(expected)
  })

  test('when list has multiple blogs with different likes, return blog with most likes', () => {
    const listWithMultipleBlogs = [
      {
        title: 'What is this',
        author: 'Guille',
        likes: 6
      },
      {
        title: 'The one',
        author: 'Mindo Ski',
        likes: 592
      },
      {

        title: 'aaaaaa',
        author: 'none',
        likes: 23
      }
    ]

    const expected = {
      title: 'The one',
      author: 'Mindo Ski',
      likes: 592
    }

    const result = favoriteBlog(listWithMultipleBlogs)
    expect(result).toEqual(expected)

  })

})