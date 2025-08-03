import { Card, CardBody } from '@heroui/react'

const Profiles = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardBody className="text-center p-8">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Анкеты</h1>
          <p className="text-gray-600">
            Здесь будут отображаться анкеты других пользователей для знакомства и выбора.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

export default Profiles
