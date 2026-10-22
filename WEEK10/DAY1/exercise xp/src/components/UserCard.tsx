export interface UserCardProps {
  name?: string
  age?: number
  role?: string
}

export default function UserCard({
  name = 'Alex Morgan',
  age = 28,
  role = 'Curious learner',
}: UserCardProps) {
  return (
    <article className="user-card">
      <div className="user-avatar" aria-hidden="true">{name.trim().charAt(0).toUpperCase() || 'A'}</div>
      <div className="user-info">
        <span className="type-chip">OPTIONAL PROPS</span>
        <h3>{name}</h3>
        <p>{role} <span className="user-divider">·</span> {age} years old</p>
      </div>
      <span className="user-card-spark" aria-hidden="true">✳</span>
    </article>
  )
}
