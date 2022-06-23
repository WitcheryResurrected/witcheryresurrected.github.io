import React from 'react'

import smelingFlames from '../../assets/images/crafting_guis/smelting_flames.png'
import progressArrow from '../../assets/images/crafting_guis/progress_arrow.png'
import progressBubbles from '../../assets/images/crafting_guis/progress_bubbles.png'

import '../styles/CraftingGrids.css'

class CraftingTable extends React.Component {
  static shuffleInterval = 1000

  grid = React.createRef()

  state = {
    paused: false
  }

  constructor (props) {
    super(props)

    if (!props.recipe.shaped) this.setPause(false)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    return (
      <div className='crafting-grid crafting-table'>
        {this.props.recipe.shaped
          ? null
          : <button className='pause material-symbols-outlined' onClick={() => this.setPause(!this.state.paused)}>
              {this.state.paused ? 'play_arrow' : 'pause'}
            </button>}

        <h2 className='minecraft title'>Crafting Table</h2>

        <div className='recipe' ref={this.grid}>
          {this.props.recipe.slots.map((s, i) => {
            const {
              modded,
              item,
              category
            } = this.props.getItem(s?.id)

            return (
              <div className={`slot${modded ? ' clickable' : ''}`} key={i} onClick={modded ? () => this.props.switchLocation(category, item.id) : null}>
                {item
                  ? (
                    <>
                      <img alt={s?.id} src={item?.iconURL}/>

                      {s.count && s.count !== 1
                        ? <span className='minecraft count'>{s.count}</span>
                        : null}

                      <span className='minecraft tooltip'>{item.name}</span>
                    </>
                    )
                  : null}
              </div>
            )
          })}
        </div>

        <div className='product'>
          <div className='slot'>
            <img alt={this.props.entry.name} src={this.props.entry.iconURL}/>

            <span className='minecraft tooltip'>{this.props.entry.name}</span>
          </div>
        </div>
      </div>
    )
  }

  shuffle () {
    for (let s = this.grid.current.children.length; s >= 0; s--) this.grid.current.appendChild(this.grid.current.children[Math.floor(Math.random() * s)])
  }

  setPause (paused) {
    if (paused) clearInterval(this.interval)
    else this.interval = setInterval(this.shuffle.bind(this), CraftingTable.shuffleInterval)

    this.setState({
      paused
    })
  }
}

class Furnace extends React.Component {
  render () {
    return (
      <div className='crafting-grid furnace'>
        <h2 className='minecraft title'>Furnace</h2>

        <div className='recipe'>
          {this.props.recipe.slots.map((s, i) => {
            const {
              modded,
              item,
              category
            } = this.props.getItem(s?.id)

            return (
              <div className={`slot${modded ? ' clickable' : ''}`} key={i} onClick={modded ? () => this.props.switchLocation(category, item.id) : null}>
                {item
                  ? (
                    <>
                      <img alt={s?.id} src={item?.iconURL}/>

                      <span className='minecraft tooltip'>{item.name}</span>
                    </>
                    )
                  : null}
              </div>
            )
          })}
        </div>

        <div className='product'>
          <div className='slot'>
            <img alt={this.props.entry.name} src={this.props.entry.iconURL}/>

            <span className='minecraft tooltip'>{this.props.entry.name}</span>
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

class Kettle extends React.Component {
  static shuffleInterval = 1000

  grid = React.createRef()

  state = {
    paused: false
  }

  constructor (props) {
    super(props)

    if (!props.recipe.shaped) this.setPause(false)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    return (
      <div className='crafting-grid kettle'>
        {this.props.recipe.shaped
          ? null
          : <button className='pause material-symbols-outlined' onClick={() => this.setPause(!this.state.paused)}>
            {this.state.paused ? 'play_arrow' : 'pause'}
          </button>}

        <h2 className='minecraft title'>Kettle</h2>

        <div className='product'>
          <div className='slot'>
            <img alt={this.props.entry.name} src={this.props.entry.iconURL}/>

            <span className='minecraft tooltip'>{this.props.entry.name}</span>
          </div>
        </div>

        <div className='recipe' ref={this.grid}>
          {this.props.recipe.slots.map((s, i) => {
            const {
              modded,
              item,
              category
            } = this.props.getItem(s?.id)

            return (
              <div className={`slot${modded ? ' clickable' : ''}`} key={i} onClick={modded ? () => this.props.switchLocation(category, item.id) : null}>
                {item
                  ? (
                    <>
                      <img alt={s?.id} src={item?.iconURL}/>

                      <span className='minecraft tooltip'>{item.name}</span>
                    </>
                    )
                  : null}
              </div>
            )
          })}
        </div>

        <div className='decorations'>
          <img className='progress-bubbles' alt='progress' src={progressBubbles}/>
        </div>
      </div>
    )
  }

  shuffle () {
    for (let s = this.grid.current.children.length; s >= 0; s--) this.grid.current.appendChild(this.grid.current.children[Math.floor(Math.random() * s)])
  }

  setPause (paused) {
    if (paused) clearInterval(this.interval)
    else this.interval = setInterval(this.shuffle.bind(this), CraftingTable.shuffleInterval)

    this.setState({
      paused
    })
  }
}

export {
  CraftingTable,
  Furnace,
  Kettle
}
