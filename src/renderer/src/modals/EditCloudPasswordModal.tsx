import React, { useState, useContext } from 'react'
import { FiCloud, FiGlobe, FiUser, FiLock, FiRefreshCw, FiTrash2, FiX } from 'react-icons/fi'
import ErrorModal from './ErrorModal'
import { AuthContext } from '@renderer/utils/AuthContext'

interface Password {
  id: number
  service: string
  user_name: string
  password: string
}

interface PasswordModalProps {
  userPassword: Password
  onClose: () => void
  onUpdateSuccess: () => void
  onDeleteSuccess: () => void
}

const EditCloudPasswordModal = ({ userPassword, onClose, onUpdateSuccess, onDeleteSuccess }: PasswordModalProps): JSX.Element => {
  const [service, setService] = useState(userPassword.service)
  const [username, setUsername] = useState(userPassword.user_name)
  const [password, setPassword] = useState(userPassword.password)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useContext(AuthContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (password.length < 1) {
      setMessage("Password must not be empty")
      setShowErrorModal(true)
      return
    } else if (service.length < 1) {
      setMessage("Service must not be empty")
      setShowErrorModal(true)
      return
    } else if (username.length < 1) {
      setMessage("Username must not be empty")
      setShowErrorModal(true)
      return
    } else {
      const passwordObject = {
        user_id: user?.cloudId,
        id: userPassword.id,
        service: service,
        username: username,
        password: password
      }
      window.electron.ipcRenderer.invoke("update-cloud-password", { passwordObject })
        .then((response) => {
          if (response.success) {
            onUpdateSuccess()
          } else {
            setMessage(response.message)
            setShowErrorModal(true)
          }
        })
    }
  }

  const handleDelete = (): void => {
    window.electron.ipcRenderer.invoke("delete-cloud-password", { passwordId: userPassword.id })
      .then((response) => {
        if (response.success) {
          onDeleteSuccess()
        } else {
          setMessage(response.message)
          setShowErrorModal(true)
        }
      })
  }

  const closeErrorModal = (): void => {
    setShowErrorModal(false)
  }

  const generatePassword = (): void => {
    window.electron.ipcRenderer.invoke('generate-password')
      .then((response) => {
        setPassword(response)
      })
      .catch((err) => {
        console.log("Error", err)
        setMessage("Error Generating Password")
        setShowErrorModal(true)
      })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 text-zinc-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <FiCloud className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Edit Cloud Details</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Service Input */}
          <div className="group">
            <label htmlFor="service" className="block mb-1 text-xs font-semibold uppercase text-zinc-500">
              Service
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <FiGlobe />
              </div>
              <input
                type="text"
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Username Input */}
          <div className="group">
            <label htmlFor="username" className="block mb-1 text-xs font-semibold uppercase text-zinc-500">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <FiUser />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <label htmlFor="password" className="block mb-1 text-xs font-semibold uppercase text-zinc-500">
              Password
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <FiLock />
                </div>
                <input
                  type="text"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                  required
                />
              </div>
              <button
                type="button"
                onClick={generatePassword}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
                title="Generate New Password"
              >
                <FiRefreshCw />
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800 mt-6">
            
            {/* Delete (Left aligned for safety) */}
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 rounded-lg transition-colors"
            >
              <FiTrash2 />
              <span>Delete</span>
            </button>

            {/* Save/Cancel (Right aligned) */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeErrorModal} />)}
    </div>
  )
}

export default EditCloudPasswordModal