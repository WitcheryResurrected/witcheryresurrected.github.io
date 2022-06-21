import React from 'react'

import {
  CraftingTable
} from './modules/CraftingGrids.jsx'

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
  static grids = {
    crafting_table: CraftingTable
  }

  state = {
    entries: { // TEMP
      items: new Array(50).fill({
        id: 'witchery:attuned_stone',
        name: 'Attuned Stone',
        icon: icon,
        recipe: {
          type: 'crafting_table',
          slots: [
            'witchery:magic_whiff', null, null,
            'minecraft:diamond', null, null,
            'minecraft:lava_bucket', null, null
          ]
        }
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
                    <div className='icon'>
                      <img alt={e.name} src={e.icon}/>
                    </div>

                    <span className='caption'>{e.name}</span>
                  </div>
                ))
                : null}
            </div>
          </div>

          <div className='blowup-area'>
            {this.state.blowup
              ? (
                <div className='blowup antifrosted'>
                  <div className='identity'>
                    <div className='icon'>
                      <img alt={this.state.blowup.name} src={this.state.blowup.icon}/>
                    </div>

                    <div className='underscore'>
                      <div className='nameplate'>
                        <strong className='name'>{this.state.blowup.name}</strong>
                        <span className='id'>{this.state.blowup.id}</span>
                      </div>

                      <div className='crafting-grid-container'>
                        {this.state.blowup.recipe
                          ? this.getGrid(this.state.blowup.recipe)
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
                )
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

  getGrid (recipe) {
    const Grid = Glossary.grids[recipe.type]

    return <Grid data={recipe.slots}/>
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
