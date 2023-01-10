import React from 'react'

class Error extends React.Component {
  state = {
    status: null,
    error: {}
  }

  componentDidMount () {
    this.update()
  }

  componentDidUpdate (prevProps) {
    if (this.props !== prevProps) this.update()
  }

  render () {
    return (
      <div className='alert alert-dismissible alert-danger error'>
        <button type='button' className='close' data-dismiss='alert' onClick={this.props.onClose}>&times;</button>

        <strong className='header'>Something went wrong.</strong>

        <div className='message'>
          <span className='code'>{this.state.status}</span> <strong className='type'>{this.state.error.type}</strong> {this.state.error.message}
        </div>
      </div>
    )
  }

  update () {
    if (this.props.error instanceof TypeError) {
      console.error(this.props.error)

      this.setState({
        error: {
          type: 'network',
          message: 'could not resolve host'
        }
      })
    } else if (this.props.error instanceof Response) {
      this.props.error.json()
        .then(({ error }) => this.setState({ error, status: this.props.error.status }))
    } else this.setState({ error: this.props.error })
  }
}

export default Error
