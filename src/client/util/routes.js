import Home from '../Home.jsx'
import Downloads from '../Downloads.jsx'

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
    Component: Home
  },
  {
    path: '/downloads',
    name: 'Downloads',
    Component: Downloads
  }
]

export default routes
