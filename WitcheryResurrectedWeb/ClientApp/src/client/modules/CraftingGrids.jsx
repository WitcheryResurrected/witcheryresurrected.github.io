import React from 'react'
import {
  Link
} from 'react-router-dom'

import smelingFlames from '../../assets/images/crafting_guis/smelting_flames.png'
import progressArrow from '../../assets/images/crafting_guis/progress_arrow.png'

import '../styles/CraftingGrids.css'

class CraftingTable extends React.Component {
  render () {
    return (
      <div className='crafting-grid crafting-table'>
        <div className='recipe'>
          {this.props.recipe.map((s, i) => {
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
            <img alt={this.props.product.name} src={this.props.product.iconURL}/>

            <span className='tooltip'>{this.props.product.name}</span>
          </div>
        </div>
      </div>
    )
  }
}

class Furnace extends React.Component {
  render () {
    return (
      <div className='crafting-grid furnace'>
        <div className='recipe'>
          {this.props.recipe.map((s, i) => {
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
            <img alt={this.props.product.name} src={this.props.product.iconURL}/>

            <span className='tooltip'>{this.props.product.name}</span>
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
