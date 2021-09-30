import React from 'react'

import logo from '../../assets/images/logo.png'

import '../styles/RevealOverlay.css'

class RevealOverlay extends React.Component {
  render () {
    return (
      <div className='overlay reveal'>
        <img className='splash' src={logo} alt='logo'/>
      </div>
    )
  }
}

export default RevealOverlay
