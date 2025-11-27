import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Home from './pages/Home'
import VerificationStart from './pages/VerificationStart'
import UploadID from './components/UploadID'
import VerificationPending from './pages/VerificationPending'
import AdminVerification from './pages/AdminVerification'
import Profile from './pages/Profile'
import ConfessionsPage from './pages/ConfessionsPage'
import PollsPage from './pages/PollsPage'
import FlashChatPage from './pages/FlashChatPage'
import DMsPage from './pages/DMsPage'
import StorePage from './pages/StorePage'
import CustomizeProfile from './pages/CustomizeProfile'
import EditProfile from './pages/EditProfile'
import LoginScreen from './pages/auth/LoginScreen'
import SignupScreen from './pages/auth/SignupScreen'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Logout from './pages/auth/Logout'
import RequireAuth from './components/auth/RequireAuth'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginScreen />} />
          <Route path="/auth/signup" element={<SignupScreen />} />
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected Routes */}
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
          <Route path="/profile/customize" element={<RequireAuth><CustomizeProfile /></RequireAuth>} />
          <Route path="/store" element={<RequireAuth><StorePage /></RequireAuth>} />
          <Route path="/confessions" element={<RequireAuth><ConfessionsPage /></RequireAuth>} />
          <Route path="/polls" element={<RequireAuth><PollsPage /></RequireAuth>} />
          <Route path="/flashchat" element={<RequireAuth><FlashChatPage /></RequireAuth>} />
          <Route path="/dms" element={<RequireAuth><DMsPage /></RequireAuth>} />

          {/* Verification Flow (Protected) */}
          <Route path="/verify/start" element={<RequireAuth><VerificationStart /></RequireAuth>} />
          <Route path="/verify/upload" element={<RequireAuth><UploadID /></RequireAuth>} />
          <Route path="/verify/pending" element={<RequireAuth><VerificationPending /></RequireAuth>} />

          {/* Admin (Protected) */}
          <Route path="/admin/verification" element={<RequireAuth><AdminVerification /></RequireAuth>} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
