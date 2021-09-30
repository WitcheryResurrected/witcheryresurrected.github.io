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
// import NotFound from './NotFound.jsx'

class Routes extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null
    }

    this.onError = this.onError.bind(this)
    this.closeError = this.closeError.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.errorTimeout)
  }

  render () {
    return (
      <Router>
        <RevealOverlay/>

        <Navbar routes={routes}/>

        <div id='app'>
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.Component onError={this.onError} title={document.title} {...props}/>}
              />
            ))}

            {/* <Route component={NotFound}/> */}
          </Switch>
        </div>

        {this.state.error
          ? <Error error={this.state.error} onClose={this.closeError}/>
          : null}
      </Router>
    )
  }

  onError (error) {
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
}

export default Routes
