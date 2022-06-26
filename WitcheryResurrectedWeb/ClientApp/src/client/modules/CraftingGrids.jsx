import React from 'react'

import smelingFlames from '../../assets/images/crafting_guis/smelting_flames.png'
import progressArrow from '../../assets/images/crafting_guis/progress_arrow.png'
import progressBubbles from '../../assets/images/crafting_guis/progress_bubbles.png'
import progressSpinningArrow from '../../assets/images/crafting_guis/progress_spinning_arrow.png'

import '../styles/CraftingGrids.css'

class Slot extends React.Component {
  render () {
    const {
      modded,
      item,
      category
    } = this.props.getItem(this.props.data?.id)

    if (item) {
      return (
        <div
          className={`slot${modded && !this.props.preventClick ? ' clickable' : ''}`}
          onClick={modded && !this.props.preventClick ? () => this.props.switchLocation(category, item.id) : null}>
            <img alt={this.props.data?.id} src={item?.iconURL}/>

            {this.props.data?.count && this.props.data.count !== 1
              ? <span className='minecraft count'>{this.props.data.count}</span>
              : null}

            <span className='minecraft tooltip'>{item.name}</span>
        </div>
      )
    } else if (this.props.data) {
      return (
        <div className='slot unknown'>
          <span className='minecraft'>?</span>

          <span className='minecraft tooltip unknown'>UNKNOWN ITEM</span>
        </div>
      )
    } else return <div className='slot'/>
  }
}

class CraftingTable extends React.Component {
  static shuffleInterval = 1000

  grid = React.createRef()

  state = {
    paused: false
  }

  constructor (props) {
    super(props)

    if (!props.recipe.shaped) this.interval = setInterval(this.shuffle.bind(this), CraftingTable.shuffleInterval)
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
          {this.props.recipe.ingredients.map((s, i) => <Slot data={s} key={i} getItem={this.props.getItem} switchLocation={this.props.switchLocation}/>)}
        </div>

        <div className='products'>
          {this.props.recipe.products.map((p, i) => <Slot data={p} preventClick={true} key={i} getItem={this.props.getItem} switchLocation={this.props.switchLocation}/>)}
        </div>
      </div>
    )
  }

  shuffle () {
    if (!this.state.paused) {
      for (let s = this.grid.current.children.length; s >= 0; s--) this.grid.current.appendChild(this.grid.current.children[Math.floor(Math.random() * s)])
    }
  }
}

class Furnace extends React.Component {
  render () {
    return (
      <div className='crafting-grid furnace'>
        <h2 className='minecraft title'>Furnace</h2>

        <div className='recipe' ref={this.grid}>
          {this.props.recipe.ingredients.map((s, i) => <Slot data={s} key={i} getItem={this.props.getItem} switchLocation={this.props.switchLocation}/>)}
        </div>

        <div className='products'>
          {this.props.recipe.products.map((p, i) => <Slot data={p} preventClick={true} key={i} getItem={this.props.getItem} switchLocation={this.props.switchLocation}/>)}
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

    if (!props.recipe.shaped) this.interval = setInterval(this.shuffle.bind(this), CraftingTable.shuffleInterval)
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

        <div className='products'>
          {this.props.recipe.products.map((p, i) => <Slot data={p} preventClick={true} key={i} getItem={this.props.getItem} switchLocation={this.props.switchLocation}/>)}
        </div>

        <div className='recipe' ref={this.grid}>
          {this.props.recipe.ingredients.map((s, i) => <Slot data={s} key={i} getItem={this.props.getItem} switchLocation={this.props.switchLocation}/>)}
        </div>

        <div className='decorations'>
          <img className='progress-bubbles' alt='progress' src={progressBubbles}/>
        </div>
      </div>
    )
  }

  shuffle () {
    if (!this.state.paused) {
      for (let s = this.grid.current.children.length; s >= 0; s--) this.grid.current.appendChild(this.grid.current.children[Math.floor(Math.random() * s)])
    }
  }
}


  setPause (paused) {
    if (paused) clearInterval(this.interval)
    else this.interval = setInterval(this.shuffle.bind(this), CraftingTable.shuffleInterval)

    this.setState({
      paused
    })
  }
}

class SpinningWheel extends React.Component {
  static shuffleInterval = 1000

  grid = React.createRef()

  state = {
    paused: false
  }

  constructor (props) {
    super(props)

    if (!props.recipe.shaped) this.interval = setInterval(this.shuffle.bind(this), CraftingTable.shuffleInterval)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    return (
      <div className='crafting-grid spinning-wheel'>
        {this.props.recipe.shaped
          ? null
          : <button className='pause material-symbols-outlined' onClick={() => this.setPause(!this.state.paused)}>
            {this.state.paused ? 'play_arrow' : 'pause'}
          </button>}

        <h2 className='minecraft title'>Spinning Wheel</h2>

        <div className='recipe' ref={this.grid}>
          {this.props.recipe.ingredients.map((s, i) => <Slot data={s} key={i} getItem={this.props.getItem} switchLocation={this.props.switchLocation}/>)}
        </div>

        <div className='products'>
          {this.props.recipe.products.map((p, i) => <Slot data={p} preventClick={true} key={i} getItem={this.props.getItem} switchLocation={this.props.switchLocation}/>)}
        </div>

        <div className='decorations'>
          <img className='progress-arrow' alt='progress' src={progressSpinningArrow}/>
        </div>
      </div>
    )
  }

  shuffle () {
    if (!this.state.paused) {
      for (let s = this.grid.current.children.length; s >= 0; s--) this.grid.current.appendChild(this.grid.current.children[Math.floor(Math.random() * s)])
    }
  }
}

export {
  CraftingTable,
  Furnace,
  Kettle,
  SpinningWheel
}
