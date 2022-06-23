import React from 'react'

import {
  CraftingTable,
  Furnace,
  Kettle
} from './modules/CraftingGrids.jsx'

import postFetch from './util/postFetch.js'

import './styles/Glossary.css'

// TEMP
import attunedIcon from '../assets/TEMP/attuned_stone.png'
import whiffIcon from '../assets/TEMP/magic_whiff.png'
const categories = [
  'items',
  'blocks',
  'mobs',
  'brew effects',
  'rites',
  'spells'
]
// TEMP

// TODO: FETCH ENTRIES FROM CATEGORY ON LOAD. IF CATEGORY DOESN'T EXIST, DEFAULT TO ITEMS

class Glossary extends React.Component {
  static grids = {
    crafting_table: CraftingTable,
    furnace: Furnace,
    kettle: Kettle
  }

  static capitalizationRegex = /(?:^|\s)(.)/g
  static hashRegex = /#(?<category>[^/]+)(?:\/(?<id>.+))?/
  static idRegex = /^(.+):(.+)$/

  state = {
    entries: { // TEMP
      items: new Array(10).fill({
        id: 'witchery:attuned_stone',
        name: 'Attuned Stone',
        iconURL: attunedIcon,
        recipe: {
          type: 'crafting_table',
          shaped: false,
          slots: [
            'witchery:magic_whiff', null, null,
            'minecraft:diamond', null, null,
            'minecraft:lava_bucket', null, null
          ]
        },
        description: 'The Attuned Stone is an item from the Witchery mod. This item is used in the creation of various items and machines, such as the Chalice, Poppet Shelf, Distillery, Kettle, and the Candelabra. Additionally, it can be used as a portable power source for circle magic, when a nearby Altar is not available. They must first be charged with the Rite of Charging.'
      }).concat([
        {
          id: 'witchery:magic_whiff',
          name: 'Whiff of Magic',
          iconURL: whiffIcon
        },
        {
          id: 'witchery:test_food',
          name: 'Test Food',
          iconURL: 'https://minecraftitemids.com/item/32/cooked_porkchop.png',
          recipe: {
            type: 'furnace',
            slots: [
              'minecraft:porkchop'
            ]
          }
        },
        {
          id: 'witchery:test_brew',
          name: 'Test Brew',
          iconURL: 'https://minecraftitemids.com/item/32/438-0.png',
          recipe: {
            type: 'kettle',
            slots: [
              'minecraft:oak_sapling',
              'minecraft:bedrock',
              'minecraft:budding_amethyst',
              'minecraft:deepslate_gold_ore',
              'minecraft:tube_coral_fan',
              'minecraft:iron_pickaxe'
            ]
          }
        }
      ])
    },
    category: categories[0], // NOTE: AUTOMATICALLY SET CATEGORY TO FIRST CATEGORY WHEN FETCHED
    search: '',
    blowup: null,
    itemCache: {}
  }

  componentDidMount () {
    const location = window.location.hash.match(Glossary.hashRegex)

    if (location) this.switchLocation(location.groups.category, location.groups.id)
  }

  render () {
    return (
      <div className='page glossary'>
        <div className='content'>
          <div className='index frosted'>
            <div className='categories'>
              {categories.map((c) =>
                <div className={'category' + (this.state.category === c ? ' selected' : '')} key={c} onClick={() => this.switchLocation(c)}>
                  {c.replace(Glossary.capitalizationRegex, (l) => l.toUpperCase())}
                </div>
              )}
            </div>

            <input
              className='searchbar antifrosted'
              placeholder='Search'
              value={this.state.search}
              onChange={(e) => this.setState({ search: e.target.value })}
            />

            <div className='entries'>
              {this.state.category in this.state.entries
                ? this.state.entries[this.state.category]
                  .filter((e) => e.name.toLowerCase().replace(/\s/g, '').includes(this.state.search.toLowerCase().replace(/\s/g, '')))
                  .map((e) => (
                    <div className='entry' key={e.id} onClick={() => this.switchLocation(this.state.category, e.id)}>
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
                  <div className='printout'>
                    <div className='identity'>
                      <div className='nameplate'>
                        <strong className='name'>{this.state.blowup.name}</strong>
                        <span className='id'>{this.state.blowup.id}</span>
                      </div>

                      <div className='icon slot'>
                        <img
                          alt={this.state.blowup.name}
                          src={this.state.blowup?.iconURL}
                        />
                      </div>
                    </div>

                    <div className='underscore'>
                      <p className='description'>
                        {this.state.blowup?.description}
                      </p>

                      <div className='crafting-grid-container'>
                        {'recipe' in this.state.blowup
                          ? this.getGrid(this.state.blowup)
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

  switchLocation (category, entry) {
    if (!(category in this.state.entries)) return

    window.location.hash = category
    this.setState({
      category
    })

    const data = this.state.entries[category].find((e) => e.id === entry)
    if (!data) return

    window.location += '/' + entry
    this.setState({
      blowup: data
    })

    if (data.recipe) {
      const requests = []

      for (const slot of data.recipe.slots) {
        if (!slot || this.state.itemCache[slot]) continue

        if (slot.match(Glossary.idRegex)[1] === 'minecraft') {
          requests.push(fetch('https://api.minecraftitemids.com/v1/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: slot.match(Glossary.idRegex)[2]
            })
          })
            .then(postFetch)
            .then((entry) => entry.json())
            .then(({ data: [entry] }) => entry))
        }
      }

      return Promise.all(requests)
        .then((entries) => {
          const addition = {}

          for (const entry of entries) {
            addition['minecraft:' + entry.name] = {
              name: entry.displayName,
              iconURL: `https://minecraftitemids.com/item/64/${entry.name}.png`
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
  }

  getGrid (entry) {
    const Grid = Glossary.grids[entry.recipe.type]

    return <Grid entry={entry} switchLocation={this.switchLocation.bind(this)} getItem={this.getItem.bind(this)}/>
  }

  getItem (id) {
    if (this.state.itemCache[id]) {
      return {
        modded: false,
        item: this.state.itemCache[id]
      }
    } else {
      for (const category in this.state.entries) {
        const entry = this.state.entries[category].find((i) => i.id === id)

        if (entry) {
          return {
            modded: true,
            item: entry,
            category
          }
        }
      }
    }

    return {}
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
