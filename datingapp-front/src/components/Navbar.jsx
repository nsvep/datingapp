import { useState, useEffect } from 'react'
import { Button } from '@heroui/react'

const Navbar = ({ activeTab = 'home', onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab)
  const [isPressed, setIsPressed] = useState(null)

  // Simulate haptic feedback for mobile
  const simulateHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10) // Light haptic feedback
    }
  }

  const handleTabClick = (tab) => {
    simulateHaptic()
    setIsPressed(tab)
    setCurrentTab(tab)
    
    // Reset pressed state after animation
    setTimeout(() => setIsPressed(null), 150)
    
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  // Update currentTab when activeTab prop changes
  useEffect(() => {
    setCurrentTab(activeTab)
  }, [activeTab])

  const tabs = [
    {
      id: 'home',
      label: 'Главная',
      icon: '🏠',
      activeIcon: '🏡'
    },
    {
      id: 'profiles',
      label: 'Анкеты',
      icon: '💕',
      activeIcon: '💖'
    },
    {
      id: 'profile',
      label: 'Профиль',
      icon: '👤',
      activeIcon: '👥'
    }
  ]

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl w-full">
        {/* iOS-style indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-300 rounded-full -mt-2"></div>
        
        <div className="flex w-full py-3 px-0 relative">
          {tabs.map((tab, index) => {
            const isActive = currentTab === tab.id
            const isPressedState = isPressed === tab.id
            
            return (
              <div key={tab.id} className="relative flex-1 flex justify-center">
                {/* Active tab background indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl transform scale-110 transition-all duration-300 ease-out opacity-80"></div>
                )}
                
                <Button
                  variant="light"
                  className={`relative flex flex-col items-center justify-center w-full py-3 px-2 rounded-2xl transition-all duration-300 ease-out transform ${
                    isActive
                      ? 'text-primary-600 scale-105'
                      : 'text-gray-400 hover:text-gray-600 hover:scale-102'
                  } ${
                    isPressedState ? 'scale-95' : ''
                  }`}
                  onPress={() => handleTabClick(tab.id)}
                  style={{
                    background: 'transparent',
                    minWidth: 'auto'
                  }}
                >
                  {/* Icon with bounce animation */}
                  <div className={`text-2xl mb-1 transition-all duration-300 ${
                    isActive ? 'animate-bounce' : ''
                  }`}>
                    {isActive ? tab.activeIcon : tab.icon}
                  </div>
                  
                  {/* Label with fade animation */}
                  <span className={`text-xs font-semibold transition-all duration-300 ${
                    isActive ? 'opacity-100 font-bold' : 'opacity-70'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-primary-500 rounded-full animate-pulse"></div>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
        
        {/* Safe area for iPhone home indicator */}
        <div className="h-safe-area-inset-bottom pb-2"></div>
      </div>
    </>
  )
}

export default Navbar
