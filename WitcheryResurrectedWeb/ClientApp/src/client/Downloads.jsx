import React from 'react'

import Version from './modules/Version.jsx'
import postFetch from './util/postFetch.js'

import './styles/Downloads.css'

class Downloads extends React.Component {
  static increment = 10

  state = {
    versions: []
  }

  constructor (props) {
    super(props)

    document.title = props.title + ' - Downloads'
  }

  componentDidMount () {
    return this.getVersions()
  }

  render () {
    return (
      <div className='page downloads'>
        <div className='content frosted'>
          <div className='version-container'>
            {this.state.versions.length
              ? this.state.versions.map((v) => <Version data={v} key={v.id}/>)
              : <span className='loading-placeholder'>Loading</span>}
          </div>
        </div>
      </div>
    )
  }

  getVersions (last) {
    return fetch(`https://witchery.msrandom.net/downloads?limit=${Downloads.increment}${last ? '&after=' + last : ''}`, {
      method: 'GET'
    })
      .then(postFetch)
      .then((versions) => versions.json())
      .then((versions) => {
        if (versions.length) {
          this.setState({
            versions: [
              ...this.state.versions,
              ...versions
            ]
          })

          return this.getVersions(versions[versions.length - 1].id)
        }
      })
      .catch(this.props.onError)
  }
}

export default Downloads
