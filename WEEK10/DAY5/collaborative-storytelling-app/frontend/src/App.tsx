import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Feather,
  Heart,
  LogOut,
  MessageCircle,
  Moon,
  Plus,
  Search,
  Send,
  Sun,
  Users,
  X,
} from "lucide-react"
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom"
import type { Story, User } from "../../types/src/index"
import { apiRequest, ApiError } from "./api"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import {
  clearAuthError,
  restoreSession,
  signIn,
  signOut,
  signUp,
} from "./features/auth/authSlice"
import {
  addComment,
  createStory,
  fetchComments,
  fetchStories,
  fetchStory,
  removeStory,
  saveStory,
} from "./features/stories/storiesSlice"

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")
}

function friendlyDate(date: string) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(date))
}

function todayLabel() {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date()).toUpperCase()
}

function App() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.auth.status)
  const [dark, setDark] = useState(() => localStorage.getItem("gathered-theme") === "dark")

  useEffect(() => {
    void dispatch(restoreSession())
  }, [dispatch])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light"
    localStorage.setItem("gathered-theme", dark ? "dark" : "light")
  }, [dark])

  if (status === "loading") {
    return <div className="loading-screen"><span className="loader" />Gathering your stories…</div>
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={status === "authenticated" ? <Navigate to="/" replace /> : <AuthPage mode="login" />} />
        <Route path="/signup" element={status === "authenticated" ? <Navigate to="/" replace /> : <AuthPage mode="signup" />} />
        <Route path="/stories/:id" element={status === "anonymous" ? <Navigate to="/login" replace /> : <StoryPage />} />
        <Route path="*" element={status === "anonymous" ? <Navigate to="/login" replace /> : <Workspace dark={dark} onToggleTheme={() => setDark((value) => !value)} />} />
      </Routes>
    </div>
  )
}

function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.auth.error)
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const isSignup = mode === "signup"

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch, mode])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    try {
      const action = isSignup
        ? await dispatch(signUp({ username, email, password }))
        : await dispatch(signIn({ email, password }))
      if (signIn.fulfilled.match(action) || signUp.fulfilled.match(action)) navigate("/")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-art">
        <Link className="brand brand-light" to="/login"><span className="brand-mark"><Feather size={18} /></span> gathered<span className="brand-period">.</span></Link>
        <div className="art-copy">
          <span className="eyebrow">A LITTLE MORE MAGIC, TOGETHER</span>
          <h1>Every good story<br />has more than<br /><em>one voice.</em></h1>
          <p>A quiet corner of the internet to dream up, write, and share stories with your favorite people.</p>
          <div className="art-avatars"><span>J</span><span>M</span><span>A</span><span>+</span><small>stories are better shared</small></div>
        </div>
        <div className="art-note"><span>✦</span> A space for your next chapter</div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-kicker">{isSignup ? "YOUR STORY STARTS HERE" : "WELCOME BACK"}</div>
          <h2>{isSignup ? "Make room for wonder." : "Pick up where you left off."}</h2>
          <p className="auth-intro">{isSignup ? "Create your account and invite someone into your next story." : "Your stories and co-authors are right where you left them."}</p>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={submit}>
            {isSignup && (
              <label className="field">
                <span>Your name</span>
                <input autoComplete="name" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="What should we call you?" minLength={2} maxLength={50} required />
              </label>
            )}
            <label className="field">
              <span>Email address</span>
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </label>
            <label className="field">
              <span>Password</span>
              <input type="password" autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? "At least 8 characters" : "Enter your password"} minLength={isSignup ? 8 : undefined} maxLength={72} required />
            </label>
            <button className="button button-primary auth-submit" disabled={busy}>
              {busy ? "One moment…" : isSignup ? "Create your account" : "Sign in"}
              {!busy && <ArrowRight size={17} />}
            </button>
          </form>
          <p className="auth-switch">
            {isSignup ? "Already have an account?" : "New around here?"}{" "}
            <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link>
          </p>
          <div className="auth-footnote"><Heart size={14} /> Your words are yours. Always.</div>
        </div>
      </section>
    </main>
  )
}

function Workspace({ dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [ownOnly, setOwnOnly] = useState(false)
  const [search, setSearch] = useState("")
  const [composerOpen, setComposerOpen] = useState(false)
  const [logoutBusy, setLogoutBusy] = useState(false)

  useEffect(() => {
    void dispatch(fetchStories(ownOnly))
  }, [dispatch, ownOnly])

  async function logout() {
    setLogoutBusy(true)
    try {
      await dispatch(signOut()).unwrap()
    } catch {
      // The session is cleared even if the network is unavailable.
    } finally {
      setLogoutBusy(false)
      navigate("/login")
    }
  }

  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand"><span className="brand-mark"><Feather size={17} /></span> gathered<span className="brand-period">.</span></Link>
        <nav className="top-nav"><Link className="active" to="/">Library</Link><a href="#about">Our little corner</a></nav>
        <div className="top-actions">
          <button className="icon-button theme-button" aria-label={`Switch to ${dark ? "light" : "dark"} theme`} onClick={onToggleTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="profile-chip" title={user?.email ?? ""}><span className="avatar avatar-small">{initials(user?.username ?? "You")}</span><span className="profile-name">{user?.username}</span><ChevronDown size={14} /></button>
          <button className="icon-button logout-button" aria-label="Sign out" onClick={() => void logout()} disabled={logoutBusy}><LogOut size={17} /></button>
        </div>
      </header>
      <main className="main-content">
        <section className="welcome-row">
          <div>
            <div className="eyebrow">{todayLabel()}</div>
            <h1>A story is waiting <span className="welcome-sparkle">✳</span></h1>
            <p className="welcome-subtitle">Good to see you, {user?.username?.split(" ")[0]}. What shall we make today?</p>
          </div>
          <button className="button button-primary create-button" onClick={() => setComposerOpen(true)}><Plus size={18} /> Start a story</button>
        </section>
        <section className="featured-banner">
          <div className="featured-illustration" aria-hidden="true"><div className="sun-disc" /><div className="book-shape"><span /><span /><span /></div><div className="leaf leaf-one" /><div className="leaf leaf-two" /></div>
          <div className="featured-copy"><span className="featured-label"><span /> YOUR SHARED STUDIO</span><h2>Big ideas begin<br />with a first line.</h2><p>Start with a spark. Invite a friend. See where the story takes you.</p><button className="button button-cream" onClick={() => setComposerOpen(true)}>Write your first line <ArrowRight size={16} /></button></div>
          <div className="banner-stamp">MADE<br />TOGETHER<br /><span>✳</span></div>
        </section>
        <section className="library-section">
          <div className="library-heading">
            <div><div className="eyebrow">THE COLLECTION</div><h2>Your library <span className="story-count">{useAppSelector((state) => state.stories.items.length)}</span></h2></div>
            <div className="library-controls">
              <label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a story…" aria-label="Find a story" /></label>
              <button className={`filter-button ${ownOnly ? "filter-active" : ""}`} onClick={() => setOwnOnly((value) => !value)}><BookOpen size={16} /> {ownOnly ? "Mine & shared" : "All stories"}<ChevronDown size={14} /></button>
            </div>
          </div>
          <StoryLibrary search={search} onCreate={() => setComposerOpen(true)} />
        </section>
        <footer className="site-footer" id="about"><span>gathered<span className="brand-period">.</span></span><span>Good stories bring us closer.</span><span>Made with care, and a little bit of ✳</span></footer>
      </main>
      {composerOpen && <StoryComposer onClose={() => setComposerOpen(false)} />}
    </>
  )
}

function StoryLibrary({ search, onCreate }: { search: string; onCreate: () => void }) {
  const stories = useAppSelector((state) => state.stories.items)
  const loading = useAppSelector((state) => state.stories.loading)
  const error = useAppSelector((state) => state.stories.error)
  const filtered = useMemo(() => stories.filter((story) =>
    `${story.title} ${story.content} ${story.authorName}`.toLowerCase().includes(search.toLowerCase()),
  ), [stories, search])

  if (loading && stories.length === 0) return <div className="library-state"><span className="loader" />Loading the library…</div>
  if (error && stories.length === 0) return <div className="alert alert-error library-error">{error}</div>
  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><Feather size={25} /></div>
        <h3>{search ? "No stories found just yet." : "This page is still a blank canvas."}</h3>
        <p>{search ? "Try another title or author." : "Every favorite story starts somewhere. Yours can start here."}</p>
        {!search && <button className="button button-outline" onClick={onCreate}><Plus size={16} /> Write the first line</button>}
      </div>
    )
  }
  return <div className="story-grid">{filtered.map((story, index) => <StoryCard key={story.id} story={story} index={index} />)}</div>
}

function StoryCard({ story, index }: { story: Story; index: number }) {
  const palette = ["cover-peach", "cover-sage", "cover-lilac", "cover-blue", "cover-yellow"][index % 5]
  const excerpt = story.content.replace(/\s+/g, " ").slice(0, 128)
  return (
    <Link to={`/stories/${story.id}`} className="story-card">
      <div className={`story-cover ${palette}`}>
        <span className="cover-kicker">A GATHERED STORY</span>
        <span className="cover-decoration">{["✳", "❋", "✦", "☼", "❊"][index % 5]}</span>
        <span className="cover-title">{story.title}</span>
        <span className="cover-rule" />
        <span className="cover-byline">by {story.authorName}</span>
      </div>
      <div className="story-card-body">
        <div className="story-card-meta"><span>{story.contributors.length ? <><Users size={13} /> {story.contributors.length + 1} writers</> : <><BookOpen size={13} /> A solo story</>}</span><span>{friendlyDate(story.updatedAt)}</span></div>
        <h3>{story.title}</h3>
        <p>{excerpt}{story.content.length > 128 ? "…" : ""}</p>
        <div className="card-bottom"><div className="avatar-stack"><span className="avatar">{initials(story.authorName)}</span>{story.contributors.slice(0, 2).map((person) => <span className="avatar avatar-extra" key={person.id}>{initials(person.username)}</span>)}</div><span className="read-link">Open story <ArrowRight size={15} /></span></div>
      </div>
    </Link>
  )
}

function StoryComposer({ onClose, story }: { onClose: () => void; story?: Story }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState(story?.title ?? "")
  const [content, setContent] = useState(story?.content ?? "")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const editing = Boolean(story)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setBusy(true)
    try {
      const result = editing
        ? await dispatch(saveStory({ id: story!.id, title, content })).unwrap()
        : await dispatch(createStory({ title, content })).unwrap()
      onClose()
      if (!editing) navigate(`/stories/${result.id}`)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Your story could not be saved.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="composer-modal" role="dialog" aria-modal="true" aria-labelledby="composer-title">
        <div className="modal-topline"><span className="eyebrow">{editing ? "BACK TO THE PAGE" : "A NEW BEGINNING"}</span><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div>
        <h2 id="composer-title">{editing ? "Keep the story going." : "Every story starts somewhere."}</h2>
        <p className="composer-hint">No perfect words required. Just the ones that feel like yours.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit} className="composer-form">
          <label className="field"><span>Give it a name</span><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The day the stars came down…" maxLength={160} required /></label>
          <label className="field"><span>Put down your first words</span><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="It started on an ordinary Tuesday…" rows={9} maxLength={50000} required /></label>
          <div className="composer-actions"><span>✳ Your draft saves when you publish</span><button className="button button-primary" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Publish story"} {!busy && <ArrowRight size={16} />}</button></div>
        </form>
      </section>
    </div>
  )
}

function StoryPage() {
  const { id } = useParams()
  const storyId = Number(id)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const story = useAppSelector((state) =>
    state.stories.items.find((item) => item.id === storyId)
    ?? (state.stories.active?.id === storyId ? state.stories.active : null))
  const user = useAppSelector((state) => state.auth.user)
  const comments = useAppSelector((state) => state.stories.comments)
  const [editorOpen, setEditorOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [commentError, setCommentError] = useState("")
  const [busy, setBusy] = useState(false)
  const [pageError, setPageError] = useState("")
  const [storyLoading, setStoryLoading] = useState(true)
  const isAuthor = Boolean(story && user?.id === story.authorId)
  const canEdit = Boolean(isAuthor || story?.contributors.some((person) => person.id === user?.id))

  useEffect(() => {
    let current = true
    if (Number.isSafeInteger(storyId) && storyId > 0) {
      setStoryLoading(true)
      setPageError("")
      void dispatch(fetchStory(storyId)).unwrap()
        .catch((failure: unknown) => {
          if (current) setPageError(failure instanceof Error ? failure.message : "This story could not be opened.")
        })
        .finally(() => {
          if (current) setStoryLoading(false)
        })
      void dispatch(fetchComments(storyId))
    }
    return () => {
      current = false
    }
  }, [dispatch, storyId])

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCommentError("")
    try {
      await dispatch(addComment({ id: storyId, content: commentText })).unwrap()
      setCommentText("")
    } catch (failure) {
      setCommentError(failure instanceof Error ? failure.message : "Your comment could not be posted.")
    }
  }

  async function deleteStory() {
    if (!story || !window.confirm("Delete this story for everyone? This cannot be undone.")) return
    setBusy(true)
    try {
      await dispatch(removeStory(story.id)).unwrap()
      navigate("/")
    } catch (failure) {
      setPageError(failure instanceof Error ? failure.message : "The story could not be deleted.")
    } finally {
      setBusy(false)
    }
  }

  async function deleteContributor(contributorId: number) {
    setPageError("")
    setBusy(true)
    try {
      await apiRequest<void>(`/contributors/${contributorId}`, { method: "DELETE" })
      await dispatch(fetchStory(storyId)).unwrap()
    } catch (failure) {
      setPageError(failure instanceof Error ? failure.message : "The collaborator could not be removed.")
    } finally {
      setBusy(false)
    }
  }

  if (!Number.isSafeInteger(storyId) || storyId < 1) return <Navigate to="/" replace />
  if (storyLoading && !story) return <div className="loading-screen"><span className="loader" />Opening your story…</div>
  if (!story) return <main className="story-page not-found"><div className="empty-icon"><BookOpen size={24} /></div><h1>We couldn't find that story.</h1><p>{pageError || "It may have been moved or removed."}</p><Link to="/" className="button button-outline"><ArrowLeft size={16} /> Back to your library</Link></main>

  return (
    <main className="story-page">
      <header className="story-page-nav"><Link to="/" className="back-link"><ArrowLeft size={17} /> Back to your library</Link><Link to="/" className="brand"><span className="brand-mark"><Feather size={17} /></span> gathered<span className="brand-period">.</span></Link><div className="story-actions">{canEdit && <button className="button button-outline button-small" onClick={() => setEditorOpen(true)}>Edit story</button>}{isAuthor && <button className="text-button" onClick={() => void deleteStory()} disabled={busy}>Delete</button>}</div></header>
      {pageError && <div className="alert alert-error page-alert">{pageError}</div>}
      <article className="story-article">
        <div className="article-heading"><span className="eyebrow">A STORY BY {story.authorName.toUpperCase()}</span><h1>{story.title}</h1><div className="article-byline"><span className="avatar">{initials(story.authorName)}</span><span>Started by <strong>{story.authorName}</strong><br /><small>Updated {friendlyDate(story.updatedAt)}</small></span></div></div>
        <div className="article-content">{story.content.split("\n").map((paragraph, index) => paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />)}</div>
        <div className="article-endmark">✳</div>
      </article>
      <section className="collaboration-panel">
        <div className="collaboration-heading"><div className="collab-icon"><Users size={19} /></div><div><h2>Made together</h2><p>{story.contributors.length ? `${story.contributors.length + 1} voices in this story` : "Stories are even better when shared."}</p></div></div>
        <div className="contributor-list"><span className="contributor-person"><span className="avatar">{initials(story.authorName)}</span><span><strong>{story.authorName}</strong><small>Author</small></span></span>{story.contributors.map((person) => <div className="contributor-entry" key={person.contributorId}><span className="contributor-person"><span className="avatar avatar-sage">{initials(person.username)}</span><span><strong>{person.username}</strong><small>Collaborator</small></span></span>{isAuthor && <button className="remove-contributor" onClick={() => void deleteContributor(person.contributorId)} disabled={busy} aria-label={`Remove ${person.username} as a collaborator`} title={`Remove ${person.username}`}><X size={14} /></button>}</div>)}</div>
        {isAuthor && <InviteCollaborator story={story} onInvited={() => void dispatch(fetchStory(story.id))} />}
      </section>
      <section className="comments-section">
        <div className="comments-title"><MessageCircle size={18} /><h2>Little notes</h2><span>{comments.length}</span></div>
        <div className="comment-list">{comments.length ? comments.map((comment) => <article className="comment" key={comment.id}><span className="avatar avatar-small">{initials(comment.username)}</span><div><div className="comment-byline"><strong>{comment.username}</strong><small>{friendlyDate(comment.createdAt)}</small></div><p>{comment.content}</p></div></article>) : <p className="no-comments">Leave the first kind word on this page.</p>}</div>
        {commentError && <div className="alert alert-error">{commentError}</div>}
        <form className="comment-form" onSubmit={submitComment}><span className="avatar avatar-small">{initials(user?.username ?? "You")}</span><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Leave a thoughtful note…" maxLength={2000} required /><button className="button button-primary button-small" aria-label="Post note"><Send size={15} /> Post</button></form>
      </section>
      {editorOpen && <StoryComposer story={story} onClose={() => setEditorOpen(false)} />}
    </main>
  )
}

function InviteCollaborator({ story, onInvited }: { story: Story; onInvited: () => void }) {
  const [query, setQuery] = useState("")
  const [matches, setMatches] = useState<User[]>([])
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setMatches([])
      return
    }
    const timer = window.setTimeout(() => {
      void apiRequest<User[]>(`/users?q=${encodeURIComponent(query.trim())}`)
        .then(setMatches)
        .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "People could not be found."))
    }, 250)
    return () => window.clearTimeout(timer)
  }, [query])

  async function invite(person: User) {
    setBusy(true)
    setMessage("")
    try {
      await apiRequest("/contributors", {
        method: "POST",
        body: JSON.stringify({ story_id: story.id, user_id: person.id }),
      })
      setQuery("")
      setMatches([])
      setMessage(`${person.username} is now a collaborator.`)
      onInvited()
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "The invitation could not be sent.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="invite-wrap">
      <label className="invite-input"><Search size={15} /><input value={query} onChange={(event) => { setQuery(event.target.value); setMessage("") }} placeholder="Invite by name or email…" /></label>
      {matches.length > 0 && <div className="invite-results">{matches.map((person) => <button key={person.id} onClick={() => void invite(person)} disabled={busy}><span className="avatar avatar-small">{initials(person.username)}</span><span><strong>{person.username}</strong><small>{person.email}</small></span><Plus size={15} /></button>)}</div>}
      {message && <p className="invite-message" role="status">{message}</p>}
    </div>
  )
}

export default App
