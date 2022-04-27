import React from 'react'
import {
  Link
} from 'react-router-dom'

import postFetch from './util/postFetch.js'
import logo from '../assets/images/logo.png'
import backvid from '../assets/videos/background.webm'

import ritualExample from '../assets/videos/examples/rituals.webm'
import infusionExample from '../assets/videos/examples/infusions.webm'
import symbolExample from '../assets/videos/examples/symbology.webm'
import brewingExample from '../assets/videos/examples/brewing.webm'
import transformExample from '../assets/videos/examples/transformations.webm'

import batBauble from '../assets/images/bat_bauble.png'
import potionBauble from '../assets/images/potion_bauble.png'
import candleBauble from '../assets/images/candle_bauble.png'
import skullBauble from '../assets/images/skull_bauble.png'

import './styles/Home.css'

class Home extends React.Component {
  static baubleShiftRate = 2

  constructor (props) {
    super(props)

    document.title = props.title + ' - Home'

    if (!('ontouchstart' in window)) window.addEventListener('mousemove', this.shiftBaubles)
  }

  componentDidMount () {
    return fetch(backvid)
      .then(postFetch)
      .then((vid) => vid.blob())
      .then((blob) => {
        const element = document.getElementById('backvid').children[0]

        element.src = window.URL.createObjectURL(blob)
      })
      .catch(this.props.onError)
  }

  componentWillUnmount () {
    window.removeEventListener('mousemove', this.shiftBaubles)
  }

  render () {
    return (
      <div className='page home'>
        <div id='backvid'>
          <video autoPlay muted loop/>
        </div>

        <div className='content superfrosted'>
          <div className='card frosted info'>
            <div id='bauble-container'>
              <img className='bauble' src={batBauble} alt='bauble'/>
              <img className='bauble' src={potionBauble} alt='bauble'/>
              <img className='bauble' src={candleBauble} alt='bauble'/>
              <img className='bauble' src={skullBauble} alt='bauble'/>
            </div>

            <div className='welcome'>
              <div className='header'>
                <img className='logo' src={logo} alt='logo'/>

                <h2>Welcome to<span className='name'> Witchery: Resurrected</span></h2>
              </div>

              <div className='body'>
                <p>
                  Witchery: Resurrected aims to faithfully recreate and improve the popular&nbsp;
                  <a target='_blank' rel='noreferrer' href='https://curseforge.com/minecraft/mc-mods/witchery'>Witchery</a>
                  &nbsp;Minecraft mod in modern versions; with a focus on customizability.
                </p>

                <p>
                  Witchery: Resurrected is not a port, Emoniph's original resources were not packaged in any way,
                  this is simply a remake that intends to stay as close as possible to the original.
                </p>

                <p>
                  Currently, the project is incomplete asset-wise. As such, we require the original mod file to be loaded alongside Witchery: Resurrected.
                  Feature wise, everything is implemented;
                  &nbsp;however, the backend of the mod is being rewritten to increase maintanability, performance and quality.
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
                  loading='lazy'
                />
              </div>
            </div>

            <div className='description'>
              <div className='header'>
                <h2 className='question'>What can Witchery do for me?</h2>
              </div>

              <ul className='body'>
                <li>
                  Augment your combat experience by enhancing your abilities or diminishing your opponents' by use of
                  spells, rituals, potions, and transformations.
                </li>

                <li>
                  Add a spice of magic to your world and transform the tame mundane wilderness into a fierce magical battle consisting of
                  numerous sides including various new species of metahuman and enemy witches.
                </li>

                <li>
                  Defend your home via usage of magical wards, curse your foes, make groundbreaking discoveries in the fields of magic,
                  bend demons to your will, engage in the forbidden arts, and much more in this brand new realm.
                </li>
              </ul>
            </div>

            <div className='blurbs'>
              <div className='blurb rituals'>
                <div className='header'>
                  <h2 className='question'>Rituals</h2>
                </div>

                <div className='body'>
                  <p>
                    By sacrificing resources and living beings, cast rituals to perform miraculous events or curse your foes.
                  </p>

                  <video autoPlay muted loop lazy='true'>
                    <source src={ritualExample} type='video/webm'/>
                  </video>
                </div>
              </div>

              <div className='blurb infusions'>
                <div className='header'>
                  <h2 className='question'>Infusions</h2>
                </div>

                <div className='body'>
                  <p>
                    Infuse elemental affinities into your body to access various powers as well as unlock new spells to cast.
                  </p>

                  <video autoPlay muted loop lazy='true'>
                    <source src={infusionExample} type='video/webm'/>
                  </video>
                </div>
              </div>

              <div className='blurb symbology'>
                <div className='header'>
                  <h2 className='question'>Symbology</h2>
                </div>

                <div className='body'>
                  <p>
                    Call upon the ancient symbols to perform incredible feats during combat or for common use.
                  </p>

                  <video autoPlay muted loop lazy='true'>
                    <source src={symbolExample} type='video/webm'/>
                  </video>
                </div>
              </div>

              <div className='blurb brewing'>
                <div className='header'>
                  <h2 className='question'>Brewing</h2>
                </div>

                <div className='body'>
                  <p>
                    Combine different organic materials into brew to achieve their diverse range of unqiue reactions and dispersion methods.
                  </p>

                  <video autoPlay muted loop lazy='true'>
                    <source src={brewingExample} type='video/webm'/>
                  </video>
                </div>
              </div>

              <div className='blurb transformations'>
                <div className='header'>
                  <h2 className='question'>Transformations</h2>
                </div>

                <div className='body'>
                  <p>
                    Transform your body into a war machine of destruction to overpower your foes and wreak carnage.
                  </p>

                  <video autoPlay muted loop lazy='true'>
                    <source src={transformExample} type='video/webm'/>
                  </video>
                </div>
              </div>
            </div>

            <div className='about'>
              <p>
                Witchery: Resurrected was started in early 2020 by <a href='https://github.com/MsRandom' target='_blank' rel='noreferrer'>Ashley Wright</a>
                , who is the owner and maintainer of the project. This mod is written in the&nbsp;
                <a href='https://kotlinlang.org' target='_blank' rel='noreferrer'>Kotlin</a>
                &nbsp;programming language and is designed to be as data-driven and customizable as possible,
                allowing for freedom over features for server admins and users.
              </p>

              <p>
                This website was designed by <a href='https://github.com/abused' target='_blank' rel='noreferrer'>abused_master</a>
                &nbsp;and <a href='https://github.com/exoRift' target='_blank' rel='noreferrer'>exoRift</a>
                &nbsp;and its artwork was drawn by&nbsp;
                <a href='https://www.deviantart.com/fungalzombiex' target='_blank' rel='noreferrer'>FungalDragon</a>
                . The backend server was written by Ashley.
              </p>
            </div>
          </div>

          <iframe
            className='card widget discord'
            src='https://discord.com/widget?id=663101542685212697&theme=dark'
            sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
            title='Discord'
            loading='lazy'
          />

          <iframe
            className='card widget trello'
            src='https://trello.com/b/uEqGT8F7.html'
            title='Trello'
            loading='lazy'
          />
        </div>
      </div>
    )
  }

  shiftBaubles = (event) => {
    const container = document.getElementById('bauble-container')

    const xOffset = (event.clientX - (window.innerWidth / 2)) / window.innerWidth
    const yOffset = (event.clientY - (window.innerHeight / 2)) / window.innerHeight

    container.style.transform = `translate(calc(-50% + ${xOffset * Home.baubleShiftRate}px), calc(-50% + ${yOffset * Home.baubleShiftRate}px))`
  }
}

export default Home
