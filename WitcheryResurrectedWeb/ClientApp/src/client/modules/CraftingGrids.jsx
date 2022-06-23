import React from 'react'

import smelingFlames from '../../assets/images/crafting_guis/smelting_flames.png'
import progressArrow from '../../assets/images/crafting_guis/progress_arrow.png'

import '../styles/CraftingGrids.css'

class CraftingTable extends React.Component {
  static shuffleInterval = 1000

  grid = React.createRef()

  constructor (props) {
    super(props)

    if (!props.entry.recipe.shaped) this.interval = setInterval(this.shuffle.bind(this), CraftingTable.shuffleInterval)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    return (
      <div className='crafting-grid crafting-table'>
        <div className='recipe' ref={this.grid}>
          {this.props.entry.recipe.slots.map((s, i) => {
            const {
              modded,
              item,
              category
            } = this.props.getItem(s)

            return (
              <div className={`slot${modded ? ' clickable' : ''}`} key={i} onClick={modded ? () => this.props.switchLocation(category, item.id) : null}>
                {item
                  ? <img alt={s} src={item?.iconURL}/>
                  : null}

                {item
                  ? <span className='tooltip'>{item.name}</span>
                  : null}
              </div>
            )
          })}
        </div>

        <div className='product'>
          <div className='slot'>
            <img alt={this.props.entry.name} src={this.props.entry.iconURL}/>

            <span className='tooltip'>{this.props.entry.name}</span>
          </div>
        </div>
      </div>
    )
  }

  shuffle () {
    for (let s = this.grid.current.children.length; s >= 0; s--) this.grid.current.appendChild(this.grid.current.children[Math.floor(Math.random() * s)])
  }
}

class Furnace extends React.Component {
  render () {
    return (
      <div className='crafting-grid furnace'>
        <div className='recipe'>
          {this.props.entry.recipe.slots.map((s, i) => {
            const {
              modded,
              item,
              category
            } = this.props.getItem(s)

            return (
              <div className={`slot${modded ? ' clickable' : ''}`} key={i} onClick={modded ? () => this.props.switchLocation(category, item.id) : null}>
                {item
                  ? <img alt={s} src={item?.iconURL}/>
                  : null}

                {item
                  ? <span className='tooltip'>{item.name}</span>
                  : null}
              </div>
            )
          })}
        </div>

        <div className='product'>
          <div className='slot'>
            <img alt={this.props.entry.name} src={this.props.entry.iconURL}/>

            <span className='tooltip'>{this.props.entry.name}</span>
          </div>
        </div>

        <div className='decorations'>
          <img className='smelting-flames' alt='flames' src={smelingFlames}/>

          <img className='progress-arrow' alt='progress' src={progressArrow}/>
        </div>
      </div>
    )
  }
}

export {
  CraftingTable,
  Furnace
}
