import { Card, CardBody } from '@heroui/react'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardBody className="text-center p-8">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Главная</h1>
          <p className="text-gray-600">
            Добро пожаловать в DatingApp! Здесь будет главная страница с рекомендациями и активностью.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

export default Home
