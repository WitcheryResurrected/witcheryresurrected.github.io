import React from 'react'

import '../styles/CraftingGrids.css'

class CraftingTable extends React.Component {
  render () {
    return (
      <div className='crafting-grid crafting-table'>
        <div className='recipe'>
          {this.props.recipe.map((s, i) => {
            const item = this.props.vanillaItems[s] || this.props.moddedItems.find((i) => i.id === s)

            return (
            <div className='slot' key={i}>
              {item ? <img alt={s} src={item.iconURL}/> : null}

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

export {
  CraftingTable
}
