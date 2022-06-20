import React from 'react'

import postFetch from './util/postFetch.js'

import './styles/Glossary.css'

// TEMP
import icon from '../assets/TEMP/attuned_stone.png'
const categories = [
  'Items',
  'Blocks',
  'Mobs',
  'Brew Effects',
  'Rites',
  'Spells'
]
// TEMP

class Glossary extends React.Component {
  state = {
    entries: { // TEMP
      items: new Array(50).fill({
        id: 'witchery:attuned_stone',
        name: 'Attuned Stone',
        icon: icon
      })
    },
    category: 'Items', // NOTE: AUTOMATICALLY SET CATEGORY TO FIRST CATEGORY WHEN FETCHED
    blowup: null
  }

  render () {
    return (
      <div className='page glossary'>
        <div className='content'>
          <div className='index frosted'>
            <div className='categories'>
              {categories.map((c) =>
                <div className={'category' + (this.state.category === c ? ' selected' : '')} key={c} onClick={() => this.switchCategory(c)}>{c}</div>
              )}
            </div>

            <div className='entries'>
              {this.state.category === 'Items' // TODO: REMOVE === 'Items'
                ? this.state.entries[this.state.category.toLowerCase()].map((e) => (
                  <div className='entry' key={e.name} onClick={() => this.switchBlowup(e)}>
                    <img alt={e.name} src={e.icon}/>

                    <span className='caption'>{e.name}</span>
                  </div>
                ))
                : null}
            </div>
          </div>

          <div className='blowup'>
            {this.state.blowup
              ? null
              : null}
          </div>
        </div>
      </div>
    )
  }

  switchCategory (category) {
    this.setState({
      category
    })
  }

  switchBlowup (item) {
    this.setState({
      blowup: item
    })
  }
}

export default Glossary

/*
// TODO: MAKE DYNAMIC VARIABLES
  Category determination
  Items
  Item properties
  Icons
*/
