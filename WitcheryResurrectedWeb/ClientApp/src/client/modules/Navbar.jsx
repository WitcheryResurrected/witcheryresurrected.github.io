import React from 'react'
import {
  Link
} from 'react-router-dom'

import logo from '../../assets/images/logo.png'

import '../styles/Navbar.css'

class Navbar extends React.Component {
  componentDidMount () {
    if (!this.observer) {
      const navbar = document.getElementById('navbar')

      const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('stuck', e.intersectionRatio < 1),
        { threshold: [1] }
      )

      observer.observe(navbar)

      this.observer = observer
    }
  }

  render () {
    return (
      <div id='navbar'>
        <img className='logo' src={logo} alt='logo'/>

        <div className='links'>
          {this.props.routes.map((r, i) => r.hidden
            ? null
            : (
              <Link to={r.path} className='nav-link internal' key={i}>{r.name}</Link>
              ))}

          {this.props.links.map((r, i) => (
            <a href={r.link} target='_blank' rel='noreferrer' className='nav-link external' key={i}>{r.name}</a>
          ))}
        </div>
      </div>
    )
  }
}

export default Navbar
