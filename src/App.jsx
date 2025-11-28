import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Home from './pages/Home'

import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'

import FlashChatPage from './pages/FlashChatPage'
import DMsPage from './pages/DMsPage'
import DMRoom from './pages/DMRoom'
import StorePage from './pages/StorePage'
import CustomizeProfile from './pages/CustomizeProfile'
import EditProfile from './pages/EditProfile'
import CategoriesList from './modules/youth-connect/CategoriesList'
import CategoryRoom from './modules/youth-connect/CategoryRoom'
import CategoryInfo from './modules/youth-connect/CategoryInfo'
import OpportunitiesFeed from './modules/opportunities/OpportunitiesFeed'
import JobDetails from './modules/opportunities/JobDetails'
import ApplyRedirect from './modules/opportunities/ApplyRedirect'
import LoginScreen from './pages/auth/LoginScreen'
import SignupScreen from './pages/auth/SignupScreen'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Logout from './pages/auth/Logout'
import RequireAuth from './components/auth/RequireAuth'
import Layout from './components/Layout'

import PublicOnlyRoute from './components/auth/PublicOnlyRoute'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<PublicOnlyRoute><LoginScreen /></PublicOnlyRoute>} />
          <Route path="/auth/signup" element={<PublicOnlyRoute><SignupScreen /></PublicOnlyRoute>} />
          <Route path="/auth/forgot" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
          <Route path="/auth/reset" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected Routes */}
          {/* Protected Routes */}
          <Route path="/" element={<RequireAuth><Layout><Home /></Layout></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Layout><Profile /></Layout></RequireAuth>} />
          <Route path="/profile/:userId" element={<RequireAuth><Layout><PublicProfile /></Layout></RequireAuth>} />
          <Route path="/profile/edit" element={<RequireAuth><Layout><EditProfile /></Layout></RequireAuth>} />
          <Route path="/profile/customize" element={<RequireAuth><Layout><CustomizeProfile /></Layout></RequireAuth>} />
          <Route path="/store" element={<RequireAuth><Layout><StorePage /></Layout></RequireAuth>} />

          {/* Youth Connect */}
          <Route path="/youth-connect" element={<RequireAuth><Layout><CategoriesList /></Layout></RequireAuth>} />
          <Route path="/youth-connect/room/:categoryId" element={<RequireAuth><CategoryRoom /></RequireAuth>} />
          <Route path="/youth-connect/info/:categoryId" element={<RequireAuth><Layout><CategoryInfo /></Layout></RequireAuth>} />

          {/* Opportunities */}
          <Route path="/opportunities" element={<RequireAuth><Layout><OpportunitiesFeed /></Layout></RequireAuth>} />
          <Route path="/opportunities/:jobId" element={<RequireAuth><Layout><JobDetails /></Layout></RequireAuth>} />
          <Route path="/opportunities/apply/:jobId" element={<RequireAuth><Layout><ApplyRedirect /></Layout></RequireAuth>} />
          <Route path="/dms" element={<RequireAuth><Layout><DMsPage /></Layout></RequireAuth>} />
          <Route path="/dms/:userId" element={<RequireAuth><DMRoom /></RequireAuth>} />


        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
