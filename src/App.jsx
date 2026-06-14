import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#071126] text-white">
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />
            <main className="flex-1 p-6">
              <AppRoutes />
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}
