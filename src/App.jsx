import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VerificationStart from './pages/VerificationStart'
import UploadID from './components/UploadID'
import VerificationPending from './pages/VerificationPending'
import AdminVerification from './pages/AdminVerification'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify/start" element={<VerificationStart />} />
        <Route path="/verify/upload" element={<UploadID />} />
        <Route path="/verify/pending" element={<VerificationPending />} />
        <Route path="/admin/verification" element={<AdminVerification />} />
      </Routes>
    </Router>
  )
}

export default App
