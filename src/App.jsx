import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import PublicNavbar from './components/PublicNavbar/PublicNavbar'
import Footer from './components/Footer/Footer'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Notifications from './pages/Notifications/Notifications'
import ModeSelection from './pages/ModeSelection/ModeSelection'
import Groups from './pages/Groups/Groups'
import GroupDetail from './pages/GroupDetail/GroupDetail'
import CreateGroup from './pages/CreateGroup/CreateGroup'
import CreateEvent from './pages/CreateEvent/CreateEvent'
import Onboarding from './pages/Onboarding/Onboarding'
import About from './pages/About/About'
import SoloDiscovering from './pages/SoloDiscovering/SoloDiscovering'
import Profile from './pages/Profile/Profile'
import { useApp } from './context/AppContext'
import './App.css'
import Privacy from './pages/Privacy/Privacy'
import Help from './pages/Help/Help'

const PUBLIC_ROUTES = ['/', '/login', '/register', '/onboarding', '/about']

function App() {
  const location = useLocation()


  const { isLoggedIn } = useApp()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      {isLoggedIn ? <Navbar /> : <PublicNavbar />}
      <main className="app__content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/mode" element={<ModeSelection />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/discover" element={<SoloDiscovering />} />
          <Route path="/discover/create" element={<CreateEvent />} />
          <Route path="/discover/edit/:id" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App