import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/confessions" element={<ConfessionsPage />} />
        <Route path="/polls" element={<PollsPage />} />
        <Route path="/flashchat" element={<FlashChatPage />} />
        <Route path="/dms" element={<DMsPage />} />
        <Route path="/verify/start" element={<VerificationStart />} />
        <Route path="/verify/upload" element={<UploadID />} />
        <Route path="/verify/pending" element={<VerificationPending />} />
        <Route path="/admin/verification" element={<AdminVerification />} />
      </Routes>
    </Router>
  )
}

export default App
