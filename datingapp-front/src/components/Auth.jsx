import { useState, useEffect } from 'react'
import { 
  Card, 
  CardBody, 
  CardHeader,
  Chip,
  Progress
} from '@heroui/react'

const API_BASE_URL = 'https://skrepi-backend-nsvep.amvera.io'

const Auth = ({ onAuthSuccess, onError }) => {
  const [loading, setLoading] = useState(true)
  const [authStep, setAuthStep] = useState('initializing')
  const [telegramData, setTelegramData] = useState(null)

  // Telegram WebApp integration and automatic authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthStep('checking_telegram')
        
        // Check if running in Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
          const tg = window.Telegram.WebApp
          tg.ready()
          
          // Set theme colors
          tg.setHeaderColor('#8B5CF6')
          tg.setBackgroundColor('#F3F4F6')
          
          setAuthStep('getting_user_data')
          
          // Get user data from Telegram
          if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user
            const userData = {
              telegram_id: user.id,
              username: user.username || '',
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              language_code: user.language_code || 'ru',
              is_premium: user.is_premium || false
            }
            
            setTelegramData(userData)
            setAuthStep('authenticating')
            
            // Automatic authentication with extended delay for animation
            setTimeout(async () => {
              await authenticateUser(userData)
            }, 4000) // Extended delay to 4 seconds
          } else {
            // No user data available, use test data for development
            setAuthStep('no_telegram_data')
            const testData = {
              telegram_id: 123456789,
              username: 'testuser',
              first_name: 'Test',
              last_name: 'User',
              language_code: 'ru',
              is_premium: false
            }
            
            setTelegramData(testData)
            
            // Extended delay for animation viewing
            setTimeout(async () => {
              setAuthStep('authenticating')
              await authenticateUser(testData)
            }, 5000) // Extended delay to 5 seconds
          }
        } else {
          // Not in Telegram, use test data
          setAuthStep('not_in_telegram')
          const testData = {
            telegram_id: 123456789,
            username: 'testuser',
            first_name: 'Test',
            last_name: 'User',
            language_code: 'ru',
            is_premium: false
          }
          
          setTelegramData(testData)
          
          // Extended delay for animation viewing
          setTimeout(async () => {
            setAuthStep('authenticating')
            await authenticateUser(testData)
          }, 5000) // Extended delay to 5 seconds
        }
      } catch (error) {
        console.error('Initialization error:', error)
        onError(`Ошибка инициализации: ${error.message}`)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const authenticateUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const authResult = await response.json()
      
      if (authResult.success) {
        setAuthStep('success')
        
        // Small delay to show success state
        setTimeout(() => {
          onAuthSuccess(authResult)
        }, 1000)
      } else {
        throw new Error(authResult.message || 'Authentication failed')
      }
      
    } catch (error) {
      console.error('Auth error:', error)
      setAuthStep('error')
      onError(`Ошибка авторизации: ${error.message}`)
      setLoading(false)
    }
  }

  const getStepMessage = () => {
    switch (authStep) {
      case 'initializing':
        return 'Инициализация приложения...'
      case 'checking_telegram':
        return 'Проверка Telegram WebApp...'
      case 'getting_user_data':
        return 'Получение данных пользователя...'
      case 'no_telegram_data':
        return 'Данные Telegram недоступны, используем тестовые...'
      case 'not_in_telegram':
        return 'Запуск вне Telegram, используем тестовые данные...'
      case 'authenticating':
        return 'Авторизация пользователя...'
      case 'success':
        return 'Авторизация успешна! Добро пожаловать!'
      case 'error':
        return 'Ошибка авторизации'
      default:
        return 'Загрузка...'
    }
  }

  const getProgressValue = () => {
    switch (authStep) {
      case 'initializing':
        return 10
      case 'checking_telegram':
        return 25
      case 'getting_user_data':
        return 50
      case 'no_telegram_data':
      case 'not_in_telegram':
        return 60
      case 'authenticating':
        return 80
      case 'success':
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2 text-center">
          <div className="w-full">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Скрепы
            </h1>
            <p className="text-gray-600 mt-2">Телеграм MiniApp для знакомств</p>
          </div>
        </CardHeader>
        
        <CardBody className="space-y-6">
          {/* Environment Indicator */}
          {window.Telegram?.WebApp ? (
            <Chip color="success" variant="flat" className="w-full justify-center">
              🚀 Запущено в Telegram
            </Chip>
          ) : (
            <Chip color="warning" variant="flat" className="w-full justify-center">
              ⚠️ Тестовый режим (вне Telegram)
            </Chip>
          )}

          {/* Animated Paper Clips Loading Animation */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* First Paper Clip */}
              <div className="absolute animate-bounce" style={{animationDelay: '0ms'}}>
                <svg className="w-12 h-12 text-purple-500" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L8 2C6.34315 2 5 3.34315 5 5V19C5 20.6569 6.34315 22 8 22H16C17.6569 22 19 20.6569 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2V12L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Second Paper Clip */}
              <div className="absolute animate-bounce" style={{animationDelay: '150ms'}}>
                <svg className="w-12 h-12 text-pink-500" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L8 2C6.34315 2 5 3.34315 5 5V19C5 20.6569 6.34315 22 8 22H16C17.6569 22 19 20.6569 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2V12L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Connecting Line Animation */}
              <div className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              
              {/* Rotating Circle */}
              <div className="absolute inset-0 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600">{getStepMessage()}</p>
              <Progress 
                value={getProgressValue()} 
                color="secondary" 
                className="max-w-md mx-auto"
                size="sm"
              />
              <p className="text-xs text-gray-500">{Math.round(getProgressValue())}%</p>
            </div>
          </div>


        </CardBody>
      </Card>
    </div>
  )
}

export default Auth
