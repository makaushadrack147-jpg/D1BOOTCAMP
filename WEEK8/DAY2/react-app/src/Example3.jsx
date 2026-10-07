import { Component } from 'react'
import data from './data.json'
class Example3 extends Component {
  render() {
    return (
      <section className="lab-section" aria-labelledby="experience-heading">
        <div className="section-heading"><p className="section-kicker">05 / DEEPER ARRAYS</p><h2 id="experience-heading">Experience</h2></div>
        <div className="experience-list">
          {data.Experiences.map((experience) => (
            <div className="experience-entry" key={experience.companyName}>
              <div className="experience-company">
                <img src={experience.logo} alt="" />
                <a href={experience.url} target="_blank" rel="noreferrer">{experience.companyName}</a>
              </div>
              {experience.roles.map((role) => (
                <div className="experience-role" key={`${experience.companyName}-${role.title}`}>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                  <p className="role-meta">{role.startDate} — {role.endDate} <span>{role.location}</span></p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    )
  }
}
export default Example3