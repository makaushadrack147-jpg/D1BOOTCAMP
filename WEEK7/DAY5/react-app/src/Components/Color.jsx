import { useEffect, useState } from 'react'

function Color() {
  const [favoriteColor, setFavoriteColor] = useState('red')

  useEffect(() => {
    window.alert('useEffect reached')
  }, [])

  const changeColor = () => setFavoriteColor('blue')

  return (
    <div className="demo-content">
      <h3>My favorite color is {favoriteColor}</h3>
      <button type="button" onClick={changeColor}>Change color</button>
    </div>
  )
}

export default Color