import { useState } from 'react'

function Phone() {
  const [brand] = useState('Samsung')
  const [model] = useState('Galaxy S20')
  const [color, setColor] = useState('black')
  const [year] = useState(2020)

  const changeColor = () => setColor('blue')

  return (
    <div className="demo-content">
      <p>My {brand} {model} is {color} and was released in {year}.</p>
      <button type="button" onClick={changeColor}>Change color</button>
    </div>
  )
}

export default Phone