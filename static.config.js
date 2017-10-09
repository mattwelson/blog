/* eslint-disable react/no-danger */
import axios from 'axios'
import React, { Component } from 'react'
import { renderStatic } from 'glamor/server'
import getposts from './util/getposts'

export default {
  getRoutes: async () => {
    const posts = await getposts()
    return [
      {
        path: '/',
      },
      {
        path: '/about',
      },
      {
        path: '/blog',
        getProps: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.slug}`,
          getProps: () => ({
            post,
          }),
        })),
      },
    ]
  },
  postRenderMeta: async html => ({
    glamorousData: renderStatic(() => html),
  }),
  Html: class CustomHtml extends Component {
    render () {
      const {
        Html,
        Head,
        Body,
        children,
        staticMeta: { glamorousData: { css } = {} } = {},
      } = this.props

      return (
        <Html>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style dangerouslySetInnerHTML={{ __html: css }} />
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
