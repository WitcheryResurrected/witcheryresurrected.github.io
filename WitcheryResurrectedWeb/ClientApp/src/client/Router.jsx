import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Navbar from './modules/Navbar.jsx'
import RevealOverlay from './modules/RevealOverlay.jsx'
import Error from './modules/Error.jsx'

import routes from './util/routes.js'
import links from './util/links.json'
import AdminPanel from './AdminPanel.jsx'
import NotFound from './NotFound.jsx'

class Routes extends React.Component {
  static title = document.title

  static code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]

  constructor (props) {
    super(props)

    this.state = {
      error: null,
      admin: false
    }

    this.codeProgress = 0

    this.onError = this.onError.bind(this)
    this.closeError = this.closeError.bind(this)

    this.advanceCode = this.advanceCode.bind(this)
    if (!('ontouchstart' in window)) document.addEventListener('keydown', this.advanceCode)
  }

  componentWillUnmount () {
    clearTimeout(this.errorTimeout)

    window.removeEventListener('keydown', this.advanceCode)
  }

  render () {
    return (
      <Router>
        <RevealOverlay/>

        <Navbar routes={routes} links={links}/>

        <div id='app'>
          <Switch>
            {this.state.admin
              ? <Route component={AdminPanel}/>
              : null}

            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.Component onError={this.onError} title={Routes.title} {...props}/>}
              />
            ))}

            <Route component={NotFound}/>
          </Switch>
        </div>

        {this.state.error
          ? <Error error={this.state.error} onClose={this.closeError}/>
          : null}
      </Router>
    )
  }

  onError (error) {
    console.error(error)

    this.setState({
      error
    })

    clearTimeout(this.errorTimeout)
    this.errorTimeout = setTimeout(() => this.setState({ error: null }), 300000 /* 5 minutes */)
  }

  closeError () {
    clearTimeout(this.errorTimeout)

    this.setState({
      error: null
    })
  }

  advanceCode (event) {
    if (Routes.code[this.codeProgress] === event.keyCode) {
      this.codeProgress++

      if (this.codeProgress >= Routes.code.length) this.setState({ admin: true })
    } else this.codeProgress = 0
  }
}

export default Routes
