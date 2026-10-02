import { useState } from 'react'
import Garage from './Garage.jsx'

function Car({ carinfo }) {
  const [color] = useState('red')

  return (
    <div className="demo-content">
      <h3>This car is {color} {carinfo.model}.</h3>
      <Garage size="small" />
    </div>
  )
}

export default Car