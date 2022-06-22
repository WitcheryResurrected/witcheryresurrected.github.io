import React from 'react'

import {
  CraftingTable
} from './modules/CraftingGrids.jsx'

import postFetch from './util/postFetch.js'

import './styles/Glossary.css'

// TEMP
import attunedIcon from '../assets/TEMP/attuned_stone.png'
import whiffIcon from '../assets/TEMP/magic_whiff.png'
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

  static idRegex = /.*:(.+)/

  static vanillaRegex = /minecraft(?=:.+)/

  state = {
    entries: { // TEMP
      items: new Array(50).fill({
        id: 'witchery:attuned_stone',
        name: 'Attuned Stone',
        iconURL: attunedIcon,
        recipe: {
          type: 'crafting_table',
          slots: [
            'witchery:magic_whiff', null, null,
            'minecraft:diamond', null, null,
            'minecraft:lava_bucket', null, null
          ]
        }
      }).concat({
        id: 'witchery:magic_whiff',
        name: 'Whiff of Magic',
        iconURL: whiffIcon
      })
    },
    category: 'Items', // NOTE: AUTOMATICALLY SET CATEGORY TO FIRST CATEGORY WHEN FETCHED
    blowup: null,
    itemCache: {}
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
                      <img alt={e.name} src={e.iconURL}/>
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
                    <div className='icon slot'>
                      <img alt={this.state.blowup.name} src={this.state.blowup.iconURL}/>
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

    const requests = []

    for (const slot of item.recipe.slots) {
      if (!slot || this.state.itemCache[slot]) continue

      if (slot.match(Glossary.vanillaRegex)) {
        requests.push(fetch('https://api.minecraftitemids.com/v1/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: slot.match(Glossary.idRegex)[1]
          })
        })
          .then(postFetch)
          .then((item) => item.json())
          .then(({ data: [item] }) => item))
      }
    }

    return Promise.all(requests)
      .then((items) => {
        const addition = {}

        for (const item of items) {
          addition['minecraft:' + item.name] = {
            name: item.displayName,
            iconURL: `https://minecraftitemids.com/item/64/${item.name}.png`
          }
        }

        this.setState({
          itemCache: {
            ...this.state.itemCache,
            ...addition
          }
        })
      })
      .catch(this.props.onError)
  }

  getGrid (recipe) {
    const Grid = Glossary.grids[recipe.type]

    return <Grid recipe={recipe.slots} product={this.state.blowup} vanillaItems={this.state.itemCache} moddedItems={this.state.entries.items}/>
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
