import posts from './posts.json'
function PostList() {
  return (
    <section className="lab-section" aria-labelledby="posts-heading">
      <div className="section-heading">
        <p className="section-kicker">02 / JSON IMPORT</p>
        <h2 id="posts-heading">Post list</h2>
      </div>
      <div className="post-list">
        {posts.map((post) => (
          <article className="post-row" key={post.id}>
            <div className="post-meta"><span>#{String(post.id).padStart(2, '0')}</span><time>{post.date}</time></div>
            <div><h3>{post.title}</h3><p>{post.content}</p></div>
          </article>
        ))}
      </div>
    </section>
  )
}
export default PostList