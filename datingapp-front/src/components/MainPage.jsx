import { useState } from 'react'
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Chip,
  Avatar,
  Progress,
  Divider
} from '@heroui/react'

const API_BASE_URL = 'https://skrepi-backend-nsvep.amvera.io'

const MainPage = ({ user, onError }) => {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  const handleGetUserInfo = async () => {
    if (!user?.telegram_id) {
      onError('Нет данных пользователя')
      return
    }

    setLoading(true)
    onError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me?telegram_id=${user.telegram_id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const userData = await response.json()
      setUserInfo(userData)
    } catch (error) {
      console.error('Get user error:', error)
      onError(`Ошибка получения данных: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!user?.telegram_id) {
      onError('Нет данных пользователя')
      return
    }

    if (!confirm('Вы уверены, что хотите удалить аккаунт?')) {
      return
    }

    setLoading(true)
    onError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me?telegram_id=${user.telegram_id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      // Redirect to auth after successful deletion
      window.location.reload()
    } catch (error) {
      console.error('Delete user error:', error)
      onError(`Ошибка удаления аккаунта: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardBody className="text-center py-8">
            <h1 className="text-3xl font-bold mb-2">
              Добро пожаловать, {user?.first_name || 'Пользователь'}! 👋
            </h1>
            <p className="text-purple-100">
              {user?.is_new_user ? 'Добро пожаловать в наше приложение!' : 'Рады видеть вас снова!'}
            </p>
          </CardBody>
        </Card>

        {/* Profile Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar
                name={user?.first_name || 'User'}
                size="lg"
                color="secondary"
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-gray-600">@{user?.username || 'username'}</p>
                {user?.is_premium && (
                  <Chip color="warning" variant="flat" size="sm" className="mt-1">
                    ⭐ Premium
                  </Chip>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Заполненность профиля</span>
                  <span>30%</span>
                </div>
                <Progress 
                  value={30} 
                  color="secondary" 
                  className="max-w-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Заполните профиль для лучших результатов
                </p>
              </div>
              
              <Divider />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Лайков</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-600">0</p>
                  <p className="text-sm text-gray-600">Совпадений</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600">Сообщений</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600">Просмотров</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardBody className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">Поиск людей</h3>
              <p className="text-gray-600 text-sm">
                Найдите интересных людей рядом с вами
              </p>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardBody className="text-center py-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Сообщения</h3>
              <p className="text-gray-600 text-sm">
                Общайтесь с вашими совпадениями
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Debug/Admin Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Действия разработчика</h3>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={handleGetUserInfo}
                isDisabled={loading}
                color="primary"
                variant="bordered"
                isLoading={loading}
              >
                Получить данные пользователя
              </Button>
              
              <Button
                onClick={handleDeleteUser}
                isDisabled={loading}
                color="danger"
                variant="bordered"
              >
                Удалить аккаунт
              </Button>
            </div>

            {/* User Info Display */}
            {userInfo && (
              <Card className="mt-4 bg-gray-50">
                <CardBody>
                  <h4 className="font-semibold mb-2">Данные пользователя:</h4>
                  <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(userInfo, null, 2)}
                  </pre>
                </CardBody>
              </Card>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default MainPage
