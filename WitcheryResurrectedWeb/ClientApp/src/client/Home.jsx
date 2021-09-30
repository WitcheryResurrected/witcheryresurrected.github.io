import React from 'react'
import {
  Link
} from 'react-router-dom'

import logo from '../assets/images/logo.png'
import backvid from '../assets/videos/background.webm'

import './styles/Home.css'

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      posts: [],
      about: '',
      expanded: false
    }

    document.title = props.title + ' - Home'
  }

  render () {
    return (
      <div className='page home'>
        <div id='backvid'>
          <video autoPlay muted loop>
            <source src={backvid} type='video/webm'/>
          </video>
        </div>

        <div className='content superfrosted'>
          <div className='card frosted info'>
              <div className='welcome'>
                <div className='header'>
                  <img className='logo' src={logo} alt='logo'/>

                  <h2>Welcome to Witchery: Resurrected</h2>
                </div>

                <div className='body'>
                  <p>
                    Witchery: Resurrected aims to faithfully recreate and improve the popular&nbsp;
                    <a target='_blank' rel='noreferrer' href='https://curseforge.com/minecraft/mc-mods/witchery'>Witchery</a>
                    &nbsp;Minecraft mod in modern versions; with a focus on customizability.
                  </p>

                  <p>
                    Witchery: Resurrected is not a port, Emoniph's original resources were not packaged in any way, this is simply a remake that intends to stay as close as possible to the original.
                  </p>
                  <p>
                    Currently, the project is incomplete asset-wise. As such, we require the original mod file to be loaded alongside Witchery: Resurrected.
                    Feature wise, everything is implemented; however, the backend of the mod is being rewritten to increase maintanability, performance and quality.
                    After both asset-creation and rewriting is complete, the mod will be released to sites such as&nbsp;
                    <a target='_blank' rel='noreferrer' href='https://curseforge.com/minecraft/mc-mods'>CurseForge</a>
                    &nbsp;and <a target='_blank' rel='noreferrer' href='https://modrinth.com/mods'>Modrinth</a>
                    &nbsp;You can find functional test downloads in the <Link to='/downloads'>Downloads</Link> page.
                  </p>

                  <p>
                    Trailer:
                  </p>

                  <iframe
                    className='trailer'
                    src='https://www.youtube.com/embed/3K7DRKqWVCQ'
                    title='YouTube Video Player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                </div>
            </div>
          </div>

          <iframe
            className='card widget discord'
            src='https://discord.com/widget?id=663101542685212697&theme=dark'
            sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
            title='Discord'
          />

          <iframe
            className='card widget trello'
            src='https://trello.com/b/uEqGT8F7.html' title='Trello'
          />
        </div>
      </div>
    )
  }
}

export default Home
