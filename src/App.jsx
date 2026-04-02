import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Notifications from './pages/Notifications/Notifications'
import ModeSelection from './pages/ModeSelection/ModeSelection'
import Groups from './pages/Groups/Groups'
import GroupDetail from './pages/GroupDetail/GroupDetail'
import CreateGroup from './pages/CreateGroup/CreateGroup'
import SoloDiscovering from './pages/SoloDiscovering/SoloDiscovering'
import Profile from './pages/Profile/Profile'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/mode" element={<ModeSelection />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/discover" element={<SoloDiscovering />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
