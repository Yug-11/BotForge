import { Navigate, Route, Routes } from 'react-router-dom'
import Chat from '../pages/Chat.jsx'
import CreatePDFBot from '../pages/CreatePDFBot.jsx'
import CreateTopicBot from '../pages/CreateTopicBot.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import MyBots from '../pages/MyBots.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create-topic-bot" element={<CreateTopicBot />} />
      <Route path="/create-pdf-bot" element={<CreatePDFBot />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/my-bots" element={<MyBots />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
