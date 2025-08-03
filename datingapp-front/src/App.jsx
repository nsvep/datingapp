import { useState } from 'react'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import Home from './components/Home'
import Profiles from './components/Profiles'
import Profile from './components/Profile'
import { Card, CardBody, Chip } from '@heroui/react'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('home')

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

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError(null) // Clear any errors when navigating
  }

  const renderCurrentPage = () => {
    if (!user) {
      return <Auth onAuthSuccess={handleAuthSuccess} onError={handleError} />
    }

    switch (activeTab) {
      case 'home':
        return <Home />
      case 'profiles':
        return <Profiles />
      case 'profile':
        return <Profile />
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
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
      <div className="pb-16"> {/* Add padding bottom for navbar */}
        {renderCurrentPage()}
      </div>
      
      {/* Navigation Bar - only show when user is logged in */}
      {user && (
        <Navbar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
      )}
    </div>
  )
}

export default App
