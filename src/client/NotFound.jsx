import React from 'react'
import {
  Link
} from 'react-router-dom'

import './styles/NotFound.css'

import BrokenPotion from '../assets/images/404.png'

class NotFound extends React.Component {
  render () {
    return (
      <div className='page notfound semifrosted'>
        <Link id='return' to='/'>&#8617;&#xfe0e;</Link>

        <div className='backdrop-container'>
          <img className='backdrop' src={BrokenPotion} alt='broken potion'/>
        </div>

        <div className='header'>That page does not exist</div>
      </div>
    )
  }
}

export default NotFound
