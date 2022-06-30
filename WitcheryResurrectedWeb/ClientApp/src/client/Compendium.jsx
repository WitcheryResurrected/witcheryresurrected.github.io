import React from 'react'
import {
  Link
} from 'react-router-dom'

import backArrow from '../assets/images/book_back_arrow.png'

import './styles/Compendium.css'

// TEMP
const categories = [
  'infusions',
  'afflictions'
]
// TEMP

class Compendium extends React.Component {
  static capitalizationRegex = /(?:^|\s)(.)/g
  static hashRegex = /#(?<category>[^/]+)(?:\/(?<id>.+))?/

  state = {
    categories, // TEMP
    sections: {
      infusions: [
        {
          id: 'light',
          name: 'Light',
          icon: null,
          description: 'THIS IS THE LIGHT INFUSION'
        }
      ],
      afflictions: [
        {
          id: 'vampirism',
          name: 'Vampirism',
          icon: null,
          description: 'THIS IS VAMPIRISIM',
          forms: [
            {
              id: 'bat',
              name: 'Bat',
              stats: {
                health: '5'
              },
              description: 'THIS IS THE BAT TRANSFORMATION'
            }
          ]
        }
      ]
    } // TEMP
  }

  constructor (props) {
    super(props)

    this.title = props.title + ' - Compendium'
    document.title = this.title
  }

  componentDidMount () { // TODO: GET SECTIONS
    const location = window.location.hash.match(Compendium.hashRegex)

    if (location) this.switchLocation(location.groups.category, location.groups.id)
  }

  render () {
    return (
      <div className='page compendium'>
        <div className='content'>
          <div className='side index'>
            <ul className='categories'>
              {this.state.categories.map((c, i) =>
                <li className={`minecraft category${c === this.state.category ? ' selected' : ''}`} key={i} onClick={this.switchLocation.bind(this, c)}>
                  {c.replace(Compendium.capitalizationRegex, (l) => l.toUpperCase())}
                </li>)}
            </ul>

            <Link to='/glossary'><img className='back-arrow' alt='back' src={backArrow}/></Link>
          </div>

          <div className='side blowup'>
            BRUH MOMENT
          </div>
        </div>
      </div>
    )
  }

  switchLocation (category, section) {
    if (!(category in this.state.sections)) return

    window.location.hash = category
    this.setState({
      category
    })

    const data = this.state.sections[category].find((s) => s.id === section)
    if (!data) return

    window.location += '/' + section
    document.title = this.title + ` [${data.name}]`
    this.setState({
      section
    })
  }
}

export default Compendium
