import Home from '../Home.jsx'
import Downloads from '../Downloads.jsx'
import Glossary from '../Glossary.jsx'
import Compendium from '../Compendium.jsx'

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
  },
  {
    path: '/glossary',
    name: 'Glossary',
    Component: Glossary
  },
  {
    path: '/compendium',
    name: 'Compendium',
    Component: Compendium,
    hidden: true
  }
]

export default routes
