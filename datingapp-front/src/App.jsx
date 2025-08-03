import { useState } from 'react'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import MainPage from './components/MainPage'
import { Card, CardBody, Chip } from '@heroui/react'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setError(null)
    
    // Hide Telegram main button after successful auth
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.hide()
    }
  }

  const handleLogout = () => {
    setUser(null)
    setError(null)
    
    // Show Telegram main button again
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.show()
    }
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navigation Bar */}
      {user && <Navbar user={user} onLogout={handleLogout} />}
      
      {/* Error Display */}
      {error && (
        <div className="fixed top-20 right-4 z-50 max-w-md">
          <Card className="border-danger-200 bg-danger-50 shadow-lg">
            <CardBody>
              <div className="flex items-start gap-3">
                <Chip color="danger" variant="flat" size="sm">
                  Ошибка
                </Chip>
                <p className="text-danger-700 text-sm flex-1">{error}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
      
      {/* Main Content */}
      {user ? (
        <MainPage user={user} onError={handleError} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} onError={handleError} />
      )}
    </div>
  )
}

export default App
