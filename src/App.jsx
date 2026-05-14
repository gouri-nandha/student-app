import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import StudentList from './components/StudentList'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import CreateStudentPage from './components/CreateStudentPage'
import EditStudentPage from './components/EditStudentPage'
import AiChatPage from './components/AiChatPage'
import ChatPage from './components/ChatPage'
import StreamChatPage from './components/StreamChatPage'

export default function App() {
  return (
    <div className="sma-app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
      
        <Route path="/login" element={
          <div className="sma-auth-layout"><LoginForm /></div>
        } />
        <Route path="/register" element={
          <div className="sma-auth-layout"><RegisterForm /></div>
        } />

        <Route path="/students" element={
          <ProtectedRoute>
            <>
              <Header />
              <main className="sma-main">
                <StudentList />
              </main>
            </>
          </ProtectedRoute>
        } />

        <Route path="/students/new" element={
          <ProtectedRoute><CreateStudentPage /></ProtectedRoute>
        } />

        <Route path="/students/:id/edit" element={
          <ProtectedRoute><EditStudentPage /></ProtectedRoute>
        } />

        <Route path="/ai" element={<ProtectedRoute><AiChatPage /></ProtectedRoute>
        }
        />
        <Route path="/ai/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/ai/stream" element={<ProtectedRoute><StreamChatPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
