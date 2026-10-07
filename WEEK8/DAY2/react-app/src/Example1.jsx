import { Component } from 'react'
import data from './data.json'
class Example1 extends Component {
  render() {
    return (
      <section className="lab-section" aria-labelledby="social-heading">
        <div className="section-heading"><p className="section-kicker">03 / NESTED JSON</p><h2 id="social-heading">Social medias</h2></div>
        <ul className="social-list">
          {data.SocialMedias.map((url) => (
            <li key={url}><a href={url} target="_blank" rel="noreferrer">{new URL(url).hostname.replace('www.', '')}</a></li>
          ))}
        </ul>
      </section>
    )
  }
}
export default Example1