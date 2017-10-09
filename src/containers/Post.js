import React from 'react'
import { getRouteProps, Link } from 'react-static'
//

export default getRouteProps(({ post }) => (
  <div>
    <Link to="/blog">{'<'} Back</Link>
    <br />
    <div dangerouslySetInnerHTML={{ __html: post.contents }} />
  </div>
))
