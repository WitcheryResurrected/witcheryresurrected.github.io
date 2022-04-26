import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import AdminPanel from './AdminPanel.jsx'
import NotFound from './NotFound.jsx'

import Navbar from './modules/Navbar.jsx'
import RevealOverlay from './modules/RevealOverlay.jsx'
import Error from './modules/Error.jsx'

import routes from './util/routes.js'
import links from './util/links.json'

class Router extends React.Component {
  static title = document.title
  static code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]

  codeProgress = 0

  state = {
    error: null,
    admin: false
  }

  constructor (props) {
    super(props)

    if (!('ontouchstart' in window)) window.addEventListener('keydown', this.advanceCode)
  }

  componentWillUnmount () {
    clearTimeout(this.errorTimeout)

    window.removeEventListener('keydown', this.advanceCode)
  }

  render () {
    return (
      <BrowserRouter>
        <RevealOverlay/>

        <Navbar routes={routes} links={links}/>

        <div id='app'>
          <Routes>
            {this.state.admin
              ? <Route path='*' element={<AdminPanel onError={this.onError} title={Router.title}/>}/>
              : routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  element={<route.Component onError={this.onError} title={Router.title}/>}
                />
              ))}

            <Route path='*' element={<NotFound onError={this.onError} title={Router.title}/>}/>
          </Routes>
        </div>

        {this.state.error
          ? <Error error={this.state.error} onClose={this.closeError}/>
          : null}
      </BrowserRouter>
    )
  }

  onError = (error) => {
    console.error(error)

    this.setState({
      error
    })

    clearTimeout(this.errorTimeout)
    this.errorTimeout = setTimeout(() => this.setState({ error: null }), 300000 /* 5 minutes */)
  }

  closeError = () => {
    clearTimeout(this.errorTimeout)

    this.setState({
      error: null
    })
  }

  advanceCode = (event) => {
    if (Router.code[this.codeProgress] === event.keyCode) {
      this.codeProgress++

      if (this.codeProgress >= Router.code.length) this.setState({ admin: true })
    } else this.codeProgress = 0
  }
}

export default Router
