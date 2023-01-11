import React from 'react'

import '../styles/Version.css'

class Version extends React.Component {
  static versionStats = [
    {
      icon: 'add',
      name: 'Additions',
      get: (data) => data.changelog.additions.length
    },
    {
      icon: 'remove',
      name: 'Removals',
      get: (data) => data.changelog.removals.length
    },
    {
      icon: 'circle',
      name: 'Changes',
      get: (data) => data.changelog.changes.length
    },
    {
      icon: 'file_copy',
      name: 'Files',
      get: (data) => data.paths.length
    },
    {
      icon: 'event',
      name: 'Uploaded',
      get: (data) => new Date(data.release).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }
  ]

  static fileStats = [
    {
      icon: 'weight',
      name: 'Size',
      get: (data) => this.bytesToString(data.size)
    },
    {
      icon: 'memory',
      name: 'Loader',
      get: (data) => this.loaders[data.loader]
    },
    {
      icon: 'dns',
      name: 'Game Version',
      get: (data) => data.version
    },
    {
      icon: 'cloud_download',
      name: 'Downloads',
      get: (data) => data.downloadCount
    }
  ]

  static byteTypes = ['Bytes', 'KB', 'MB', 'GB']
  static loaders = ['Forge', 'Fabric']

  state = {
    expanded: false
  }

  render () {
    return (
      <div className={'version-card' + (this.state.expanded ? ' expanded' : '')} onClick={this.toggleExpansion.bind(this)}>
        <h4>{this.props.data.name}</h4>

        <div className='stats'>
          {Version.versionStats.map((s) => (
            <div className={'stat ' + s.name.toLowerCase().replace(' ', '')} key={s.name}>
              <span className='material-symbols-outlined icon'>
                {s.icon}
              </span>

              <div className='data'>
                <strong className='name'>{s.name}</strong>

                <span className='value'>{s.get(this.props.data)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className='expansion'>
          <div className='notes'>
            {Object.entries(this.props.data.changelog).map(([note, entries], i) => entries.length
              ? (
                <div className={'note-container ' + note} key={i}>
                  <strong>{note[0].toUpperCase() + note.slice(1)}</strong>

                  <ul>
                    {entries.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
                )
              : null)}
          </div>

          <div className='files'>
            {this.props.data.paths.map((f) => (
              <div className='file' key={f.name} onClick={(e) => e.stopPropagation()}>
                <div className='info'>
                  <h5>{f.name}</h5>

                  <div className='stats'>
                    {Version.fileStats.map((s) => (
                      <div className={'stat ' + s.name.toLowerCase().replace(' ', '')} key={s.name}>
                        <span className='material-symbols-outlined icon'>
                          {s.icon}
                        </span>

                        <div className='data'>
                          <strong className='name'>{s.name}</strong>

                          <span className='value'>{s.get(f)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {f.dependencies.length
                    ? (
                      <div className='dependencies'>
                        <span className='header'>Dependencies</span>

                        <div className='dependency-container'>
                          {f.dependencies.map((d, i) => <a className='dependency' href={d.link} target='_blank' rel='noreferrer' key={i}>{d.name}</a>)}
                        </div>
                      </div>
                      )
                    : null}
                </div>

                <a className='material-symbols-outlined download' href={`../download/${this.props.data.id}/${f.name}`} target='_blank' rel='noreferrer'>
                  download
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  toggleExpansion () {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  static bytesToString (bytes) {
    if (bytes) {
      const index = Math.floor(Math.log(bytes) / Math.log(1024))

      return parseFloat((bytes / Math.pow(1024, index)).toFixed(2)) + ' ' + Version.byteTypes[index]
    } else return 'N/A'
  }
}

export default Version
