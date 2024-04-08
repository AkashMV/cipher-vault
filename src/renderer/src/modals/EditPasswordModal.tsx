import React, { useState } from 'react'

interface Password {
  id: number
  service: string
  username: string
  password: string
}

interface PasswordModalProps {
  userPassword: Password
  onClose: () => void
}

const EditPasswordModal = ({ userPassword, onClose }: PasswordModalProps): JSX.Element => {
  const [service, setService] = useState(userPassword.service)
  const [username, setUsername] = useState(userPassword.username)
  const [password, setPassword] = useState(userPassword.password)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>):void => {
    e.preventDefault()
  }

  const generatePassword = ():void => {
    // Generate a random password
    const generatedPassword = Math.random().toString(36).slice(-8)
    setPassword(generatedPassword)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-zinc-800 rounded-lg p-6 z-10 text-white">
        <h2 className="text-xl font-bold mb-4">View/Edit Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="service" className="block mb-2">
              Service:
            </label>
            <input
              type="text"
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3 py-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded  text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password:
            </label>
            <div className="flex">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded  text-black"
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Generate
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-lime-300 hover:bg-lime-500 text-black rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPasswordModal