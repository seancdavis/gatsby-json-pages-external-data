const fs = require("fs")
const path = require("path")

exports.onPostBuild = async ({ graphql }) => {
  await graphql(`
    {
      posts: allSanityPost {
        edges {
          node {
            title
            date
            slug {
              current
            }
            body
          }
        }
      }
    }
  `).then(result => {
    const postsPath = "./public/posts"
    const posts = result.data.posts.edges.map(({ node }) => node)

    if (!fs.existsSync(postsPath)) fs.mkdirSync(postsPath)

    posts.map(post => {
      const data = {
        ...post,
        slug: post.slug.current,
      }
      fs.writeFileSync(`${postsPath}/${data.slug}.json`, JSON.stringify(data))
    })
  })
}
