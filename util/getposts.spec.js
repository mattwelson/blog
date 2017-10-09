import getposts from './getposts'
import React from 'react'
import { render } from 'react-dom'

describe('getposts', () => {
  it('test', async () => {
    const posts = await getposts()
    posts.map(p => console.log(p))
  })

  it('can mount', async () => {
    const div = document.createElement('div')
    const posts = await getposts()
    const wrapper = render(<div>{posts.content}</div>, div)
  })
})
