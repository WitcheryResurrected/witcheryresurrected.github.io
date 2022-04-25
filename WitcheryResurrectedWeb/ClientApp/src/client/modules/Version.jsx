import React from 'react'

import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import {
  Backup,
  BarChart,
  GetApp,
  Keyboard,
  PhotoSizeSelectSmall,
  Today
} from '@material-ui/icons'

import '../styles/Version.css'

class Version extends React.Component {
  static versionStats = [
    {
      Icon: AddIcon,
      name: 'Additions',
      get: (data) => data.changelog.additions.length
    },
    {
      Icon: RemoveIcon,
      name: 'Removals',
      get: (data) => data.changelog.removals.length
    },
    {
      Icon: FiberManualRecordIcon,
      name: 'Changes',
      get: (data) => data.changelog.changes.length
    },
    {
      Icon: Backup,
      name: 'Files',
      get: (data) => data.paths.length
    },
    {
      Icon: Today,
      name: 'Uploaded',
      get: (data) => new Date(data.release).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }
  ]

  static fileStats = [
    {
      Icon: PhotoSizeSelectSmall,
      name: 'Size',
      get: (data) => this.bytesToString(data.size)
    },
    {
      Icon: Keyboard,
      name: 'Loader',
      get: (data) => this.loaders[data.loader]
    },
    {
      Icon: BarChart,
      name: 'Game Version',
      get: (data) => data.version
    },
    {
      Icon: GetApp,
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
              <s.Icon className='icon'/>

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
                        <s.Icon className='icon'/>

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

                <a className='download' href={`../download/${this.props.data.id}/${f.name}`} target='_blank' rel='noreferrer'>
                  <GetApp className='icon'/>
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
