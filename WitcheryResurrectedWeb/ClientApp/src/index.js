import React from 'react'
import ReactDOM from 'react-dom/client'

import './client/styles/bootstrap.min.css'
import './client/styles/index.css'

import Router from './client/Router.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<Router/>)
