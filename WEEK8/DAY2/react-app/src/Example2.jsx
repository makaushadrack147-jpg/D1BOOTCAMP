import { Component } from 'react'
import data from './data.json'
class Example2 extends Component {
  render() {
    return (
      <section className="lab-section" aria-labelledby="skills-heading">
        <div className="section-heading"><p className="section-kicker">04 / ARRAY OF OBJECTS</p><h2 id="skills-heading">Skills</h2></div>
        <div className="skill-groups">
          {data.Skills.map((group) => (
            <div className="skill-group" key={group.Area}>
              <h3>{group.Area}</h3>
              <ul>
                {group.SkillSet.map((skill) => (
                  <li key={skill.Name}><span>{skill.Name}</span>{skill.Hot && <span className="skill-mark" aria-label="Featured skill">HOT</span>}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )
  }
}
export default Example2