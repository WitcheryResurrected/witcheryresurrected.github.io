import React from 'react'

class Auth extends React.Component {
  componentDidMount () {
    localStorage.setItem('admin_auth', new URLSearchParams(window.location.search).get('code'))

    window.close()
  }

  render () {
    return (<></>)
  }
}

export default Auth
