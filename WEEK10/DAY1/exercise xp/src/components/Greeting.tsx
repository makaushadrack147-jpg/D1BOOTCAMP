export interface GreetingProps {
  name: string
  messageCount: number
}

export default function Greeting({ name, messageCount }: GreetingProps) {
  return (
    <section className="demo-card greeting-card" aria-labelledby="greeting-heading">
      <div className="card-topline">
        <span className="exercise-number">02</span>
        <span className="type-chip">TYPED PROPS</span>
      </div>
      <p className="section-label">A COMPONENT WITH AN INTERFACE</p>
      <h2 id="greeting-heading">Hello, {name}<span className="accent-dot">.</span></h2>
      <p className="muted-copy">
        You have <strong>{messageCount}</strong> new {messageCount === 1 ? 'message' : 'messages'} waiting.
      </p>
      <div className="code-hint">
        <span className="code-key">GreetingProps</span>
        <span>name: string · messageCount: number</span>
      </div>
    </section>
  )
}
