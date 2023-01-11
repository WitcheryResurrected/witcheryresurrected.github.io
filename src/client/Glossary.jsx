import React from 'react'
import {
  Link
} from 'react-router-dom'

import {
  CraftingTable,
  Furnace,
  Kettle,
  WitchesOven,
  Distillery,
  SpinningWheel
} from './modules/CraftingGrids.jsx'

import postFetch from './util/postFetch.js'

import './styles/Glossary.css'

// TEMP
import attunedIcon from '../assets/TEMP/attuned_stone.png'
import whiffIcon from '../assets/TEMP/magic_whiff.png'
import foulFumeIcon from '../assets/TEMP/foul_fume.png'
import jarIcon from '../assets/TEMP/clay_jar.png'
import goddessTearIcon from '../assets/TEMP/goddess_tear.png'
import goddessBreathIcon from '../assets/TEMP/goddess_breath.png'

const categories = [
  'items',
  'blocks',
  'mobs',
  'brew effects',
  'rites',
  'spells'
]

const entries = { // TEMP
  items: [
    {
      id: 'witchery:attuned_stone',
      name: 'Attuned Stone',
      iconURL: attunedIcon,
      description: 'The Attuned Stone is an item from the Witchery mod. This item is used in the creation of various items and machines, such as the Chalice, Poppet Shelf, Distillery, Kettle, and the Candelabra. Additionally, it can be used as a portable power source for circle magic, when a nearby Altar is not available. They must first be charged with the Rite of Charging.'
    },
    {
      id: 'witchery:magic_whiff',
      name: 'Whiff of Magic',
      iconURL: whiffIcon
    },
    {
      id: 'witchery:test_food',
      name: 'Test Food',
      iconURL: 'https://minecraftitemids.com/item/32/cooked_porkchop.png',
      description: 'Wow, this item has multiple recipes. Let\'s see how it looks with a super long description. I wonder how it will turn out. It might turn out great since I am so good at CSS and edge cases. Who knows? Maybe it will look wonderful, in fact. Perhaps, and I say this tentatively, it will look superb. I guess we will just have to see after I save this file whence I am done typing.\nSo, it turns out, after saving this file, I actually did not type enough. I underestimated the amount of space I would have for so many descriptive characters of this item on its blowup page. It truly is a shame that my spatial estimative skills are lacking. Oh well, I guess I will have to continue honing this skill in the near future when I am in college and need to meet and fulfill various quotas in my assignments. Maybe I\'ll write a dissertation one day. Who knows?'
    },
    {
      id: 'witchery:test_brew',
      name: 'Test Brew',
      iconURL: 'https://minecraftitemids.com/item/32/438-0.png'
    },
    {
      id: 'witchery:gold_thread',
      name: 'Gold Thread',
      iconURL: 'https://minecraftitemids.com/item/32/string.png'
    },
    {
      id: 'witchery:foul_fume',
      name: 'Foul Fume',
      iconURL: foulFumeIcon
    },
    {
      id: 'witchery:clay_jar',
      name: 'Clay Jar',
      iconURL: jarIcon
    },
    {
      id: 'witchery:goddess_tear',
      name: 'Tear of the Goddess',
      iconURL: goddessTearIcon
    },
    {
      id: 'witchery:goddess_breath',
      name: 'Breath of the Goddess',
      iconURL: goddessBreathIcon
    }
  ]/* .concat(new Array(30).fill({
    id: 'witchery:attuned_stone',
    name: 'Attuned Stone',
    iconURL: attunedIcon,
    description: 'The Attuned Stone is an item from the Witchery mod. This item is used in the creation of various items and machines, such as the Chalice, Poppet Shelf, Distillery, Kettle, and the Candelabra. Additionally, it can be used as a portable power source for circle magic, when a nearby Altar is not available. They must first be charged with the Rite of Charging.'
  })) */
}

const recipes = [
  {
    type: 'crafting_table',
    shaped: true,
    products: [
      {
        id: 'witchery:attuned_stone',
        count: 1
      }
    ],
    ingredients: [
      {
        id: 'witchery:magic_whiff',
        count: 1
      }, null, null,
      {
        id: 'minecraft:diamond',
        count: 1
      }, null, null,
      {
        id: 'minecraft:lava_bucket',
        count: 1
      }, null, null
    ]
  },
  {
    type: 'furnace',
    products: [
      {
        id: 'witchery:test_food',
        count: 1
      }
    ],
    ingredients: [
      {
        id: 'minecraft:porkchop',
        count: 1
      }
    ]
  },
  {
    type: 'crafting_table',
    shaped: true,
    products: [
      {
        id: 'witchery:test_food',
        count: 1
      }
    ],
    ingredients: [
      {
        id: 'minecraft:porkchop',
        count: 4
      }
    ]
  },
  {
    type: 'kettle',
    products: [
      {
        id: 'witchery:test_brew',
        count: 1
      }
    ],
    ingredients: [
      {
        id: 'minecraft:oak_sapling',
        count: 1
      },
      {
        id: 'minecraft:bedrock',
        count: 1
      },
      {
        id: 'minecraft:budding_amethyst',
        count: 1
      },
      {
        id: 'minecraft:deepslate_gold_ore',
        count: 1
      },
      {
        id: 'minecraft:tube_coral_fan',
        count: 1
      },
      {
        id: 'minecraft:iron_pickaxe',
        count: 1
      }
    ]
  },
  {
    type: 'spinning_wheel',
    products: [
      {
        id: 'witchery:gold_thread',
        count: 3
      }
    ],
    ingredients: [
      {
        id: 'minecraft:hay_bale',
        count: 1
      },
      {
        id: 'witchery:magic_whiff',
        count: 2
      },
      {
        id: 'invalid',
        count: 1
      }
    ]
  },
  {
    type: 'witches_oven',
    products: [
      {
        id: 'minecraft:coal',
        count: 1
      },
      {
        id: 'witchery:foul_fume',
        uncertain: true
      }
    ],
    ingredients: [
      {
        id: 'minecraft:oak_wood'
      },
      {
        id: 'witchery:clay_jar',
        count: 1
      }
    ]
  },
  {
    type: 'distillery',
    products: [
      {
        id: 'witchery:goddess_tear'
      },
      {
        id: 'witchery:goddess_breath'
      },
      {
        id: 'minecraft:slimeball'
      },
      {
        id: 'witchery:foul_fume'
      }
    ],
    ingredients: [
      {
        id: 'witchery:goddess_breath'
      },
      {
        id: 'minecraft:lapis_lazuli'
      },
      {
        id: 'witchery:clay_jar',
        count: 3
      }
    ]
  }
]
// TEMP

// TODO: FETCH ENTRIES FROM CATEGORY ON LOAD. IF CATEGORY DOESN'T EXIST, DEFAULT TO ITEMS

class Glossary extends React.Component {
  static grids = {
    crafting_table: CraftingTable,
    furnace: Furnace,
    kettle: Kettle,
    witches_oven: WitchesOven,
    distillery: Distillery,
    spinning_wheel: SpinningWheel
  }

  static capitalizationRegex = /(?:^|\s)(.)/g
  static hashRegex = /#(?<category>[^/]+)(?:\/(?<id>.+))?/
  static idRegex = /^(.+):(.+)$/

  state = {
    entries, // TEMP,
    recipes, // TEMP
    category: categories[0], // NOTE: AUTOMATICALLY SET CATEGORY TO FIRST CATEGORY WHEN FETCHED
    search: '',
    blowup: null,
    itemCache: {}
  }

  constructor (props) {
    super(props)

    this.title = props.title + ' - Glossary'
    document.title = this.title
  }

  componentDidMount () { // TODO: GET ENTRIES
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

            <Link to='/compendium' className='compendium-button'>Compendium</Link> {/* Onomasticon */}
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
                      <div className='description'>
                        {this.state.blowup?.description?.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                      </div>

                      {this.state.blowup.recipes?.length
                        ? (
                          <div className='recipe-container'>
                            {this.state.blowup.recipes.map((r, i) => this.getGrid(r, this.state.blowup.id, i))}
                          </div>
                          )
                        : null}
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
    document.title = this.title + ` [${data.name}]`
    this.setState({
      blowup: data
    })

    // TODO: GET RECIPES
    const recipes = this.state.recipes.filter((r) => r.products.find((p) => p.id === entry))

    if (recipes.length) {
      this.setState({
        blowup: {
          ...data,
          recipes
        }
      })

      const requests = []

      for (const recipe of recipes) {
        for (const slot of recipe.ingredients.concat(recipe.products)) {
          if (!slot || this.state.itemCache[slot.id]) continue

          if (slot.id.match(Glossary.idRegex)?.[1] === 'minecraft') {
            requests.push(fetch('https://api.minecraftitemids.com/v1/search', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: slot.id.match(Glossary.idRegex)[2]
              })
            })
              .then(postFetch)
              .then((entry) => entry.json())
              .then(({ data: [entry] }) => [slot.id, entry]))
          }
        }
      }

      return Promise.all(requests)
        .then((entries) => {
          const addition = {}

          for (const [id, entry] of entries) {
            if (entry) {
              addition[id] = {
                name: entry.displayName,
                iconURL: `https://minecraftitemids.com/item/64/${entry.name}.png`
              }
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

  getGrid (recipe, viewing, key) {
    const Grid = Glossary.grids[recipe.type]

    return Grid
      ? <Grid recipe={recipe} viewing={viewing} key={key} switchLocation={this.switchLocation.bind(this)} getItem={this.getItem.bind(this)}/>
      : <strong className='missing-error'>&#x3C;Crafting method missing from glossary&#x3E;</strong>
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
