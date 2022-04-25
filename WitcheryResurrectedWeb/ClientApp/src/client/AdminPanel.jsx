import React from 'react'

import './styles/AdminPanel.css'

class Dependency extends React.Component {
  id = `${this.props.fileID}.dependencies[${this.props.index}]`

  render () {
    return (
      <div className='dependency'>
        <input id={`${this.id}.name`} name={`${this.id}.name`} placeholder='Name'/>
        <input id={`${this.id}.link`} name={`${this.id}.link`} placeholder='Link'/>

        {this.props.children}
      </div>
    )
  }
}

class File extends React.Component {
  id = `files[${this.props.index}]`

  state = {
    dependencies: []
  }

  render () {
    return (
      <div className='file'>
        {this.props.children}

        <select id={`${this.id}.loader`} className='form-select' name={`${this.id}.loader`} defaultValue={-1} required>
          <option value={-1} disabled hidden>Mod Loader</option>
          <option value={0}>Forge</option>
          <option value={1}>Fabric</option>
        </select>

        <input id={`${this.id}.version`} name={`${this.id}.version`} placeholder='Game Version'/>

        <input id={this.id + '.file'} name={this.id + '.file'} type='file' onChange={this.setFile}/>

        <div className='dependencies'>
          <div className='dependency-container'>
            {this.state.dependencies}
          </div>

          <button className='file-button dep-button add' onClick={this.addDep.bind(this)}>+</button>
        </div>
      </div>
    )
  }

  addDep (e) {
    if (e) e.preventDefault()

    const key = parseInt(this.state.dependencies[this.state.dependencies.length - 1]?.key || -1) + 1

    this.setState({
      dependencies: [
        ...this.state.dependencies,
        <Dependency key={key} index={key} fileID={this.id}>
          <button className='file-button dep-button remove' onClick={this.removeDep.bind(this, key)}>&#739;</button>
        </Dependency>
      ]
    })
  }

  removeDep (id, e) {
    if (e) e.preventDefault()

    const index = this.state.dependencies.findIndex((f) => parseInt(f.key) === id)

    this.setState({
      dependencies: [
        ...this.state.dependencies.slice(0, index),
        ...this.state.dependencies.slice(index + 1)
      ]
    })
  }
}

class AdminPanel extends React.Component {
  state = {
    files: []
  }

  componentDidMount () {
    return this.addFile()
  }

  render () {
    return (
      <div className='page admin-panel'>
        <div className='content'>
          <form method='post' encType='multipart/form-data' action='upload'>
            <input id='name' name='name' placeholder='Name' required/>
            <textarea id='changelog' name='changelog' placeholder='Changes'/>

            <div className='files'>
              <div className='file-container'>
                {this.state.files}
              </div>

              <button className='file-button add' onClick={this.addFile.bind(this)}>+</button>
            </div>

            <div className='buttons'>
              <button className='btn btn-success' type='submit'>Upload</button>
              <button className='btn btn-danger cancel' onClick={this.cancel}>Cancel</button>

              <input id='pass' type='password' name='pass' placeholder='Secret' required/>
            </div>
          </form>
        </div>
      </div>
    )
  }

  addFile (e) {
    if (e) e.preventDefault()

    const key = parseInt(this.state.files[this.state.files.length - 1]?.key || -1) + 1

    this.setState({
      files: [
        ...this.state.files,
        <File key={key} index={key}>
          <button className='file-button remove' onClick={this.removeFile.bind(this, key)}>&#739;</button>
        </File>
      ]
    })
  }

  removeFile (id, e) {
    if (e) e.preventDefault()

    const index = this.state.files.findIndex((f) => parseInt(f.key) === id)

    this.setState({
      files: [
        ...this.state.files.slice(0, index),
        ...this.state.files.slice(index + 1)
      ]
    })
  }

  cancel (e) {
    if (e) e.preventDefault()

    window.location.reload()
  }
}

export default AdminPanel
