import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorModal from '@renderer/modals/ErrorModal'
import { AuthContext } from '@renderer/utils/AuthContext'

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate()
  const [userName, setName] = useState<string>('')
  const [masterKey, setMasterKey] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const { user, setUser } = useContext(AuthContext)

  console.log(user)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    switch (name) {
      case 'username':
        setName(value)
        break
      case 'masterKey':
        setMasterKey(value)
        break
      default:
        break
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    let validationErrors = 0
    if (userName.length < 1) {
      setMessage("Username must not be blank")
      setShowErrorModal(true)
      validationErrors++
    }
    if (masterKey.length < 1) {
      setMessage("Master Key must not be blank")
      setShowErrorModal(true)
      validationErrors++
    }

    if (validationErrors === 0) {
      window.electron.ipcRenderer
        .invoke('verify-user', { userName, masterKey })
        .then((response) => {
          if (response.success) {
            const userData = {
              id: response.user.id,
              username: response.user.username,
              cloudId: response.user.cloudId,
              cloudEnabled: response.user.cloud_enabled
            }
            if (userData.cloudEnabled) {
              window.electron.ipcRenderer.invoke("login-cloud", { cloudId: userData.cloudId })
                .then((res) => {
                  if (res.success) {
                    setUser(userData)
                    navigate("/dashboard")
                  } else {
                    userData.cloudEnabled = false
                    setMessage(res.message)
                    setShowErrorModal(true)
                    window.electron.ipcRenderer.invoke("update-cloud-integration", { userId: userData.id, cloudEnabled: userData.cloudEnabled })
                      .then(() => {
                        setUser(userData)
                        navigate("/dashboard")
                      })
                      .catch((error) => {
                        console.log('Error updating cloud integration', error)
                        setMessage("An error occurred while updating cloud integration")
                        setShowErrorModal(true)
                      })
                  }
                })
                .catch((error) => {
                  console.log('Error logging into cloud', error)
                  setMessage("An error occurred while logging into cloud")
                  setShowErrorModal(true)
                })
            } else {
              setUser(userData)
              navigate("/dashboard")
            }
          } else {
            setMessage(response.message)
            setShowErrorModal(true)
          }
        })
        .catch((error) => {
          console.log('Error sending Login request', error)
          setMessage("An error occurred while logging in")
          setShowErrorModal(true)
        })
    }
  }

  const closeModal = (): void => {
    setShowErrorModal(false)
    setMessage('')
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-zinc-950 overflow-hidden text-zinc-200 font-sans">
      
      {/* Background Decor: Subtle ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-900/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[100px]" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Cipher<span className="text-emerald-500">Vault</span>
          </h1>
          <p className="text-sm text-zinc-500">Securely access your encrypted data</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div className="group">
            <label htmlFor="username" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
              Username
            </label>
            <input
              name="username"
              type="text"
              id="username"
              value={userName}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="Enter your username"
            />
          </div>

          {/* Master Key Input */}
          <div className="group">
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="masterKey" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                Master Key
                </label>
            </div>
            <input
              name="masterKey"
              type="password"
              id="masterKey"
              value={masterKey}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="••••••••••••••"
            />
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40 active:scale-[0.98]"
            >
              Unlock Vault
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-sm text-zinc-500">
              New here?{' '}
              <Link to="/register" className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline underline-offset-4 transition-all">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>

      {showErrorModal && <ErrorModal errorMessage={message} onClose={closeModal} />}
    </div>
  )
}

export default LoginPage