import fs from 'fs-extra'
import path from 'path'
import slugify from 'slugify'

import remark from 'remark'
import guide from 'remark-preset-lint-markdown-style-guide'
import html from 'remark-html'
import report from 'vfile-reporter'

import matter from 'gray-matter'

export const ROOT = path.resolve(process.cwd())

const resolvePath = relativePath => path.resolve(path.join(ROOT, relativePath))

const readdir = (folderPath, options) =>
  fs
    .readdir(folderPath, options)
    .then(paths => paths.map(filePath => path.join(folderPath, filePath)))

const readfile = (filePath, options) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, options, (err, file) => (err ? reject(err) : resolve({ file, filePath })))
  })

const getSlug = title => slugify(title, { lower: true })

const processMarkdownAll = async posts => {
  const processor = remark()
    .use(guide)
    .use(html)
  return await Promise.all(
    posts.map(p => {
      const { data, content } = matter(p.file)
      const filePath = p.filePath.replace(ROOT, '')
      return processor
        .process(content)
        .then(result => ({
          result,
          contents: result.contents,
          data,
          filePath,
          slug: getSlug(data.title),
        }))
        .catch(e => console.error(report(e)))
    }),
  )
}

const getposts = async (settings = {}) => {
  const { folder = 'posts' } = settings

  const folderPath = resolvePath(folder)

  const files = await readdir(folderPath)
  const fileContents = await Promise.all(files.map(filename => readfile(filename, 'utf8')))
  const markdownResults = await processMarkdownAll(fileContents)

  console.log(report(markdownResults.map(r => r.result)))
  return markdownResults
}

export default getposts
