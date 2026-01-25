import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorModal from '@renderer/modals/ErrorModal'
import SuccessModal from '@renderer/modals/SuccessModal'
import validator from 'validator'

const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate()
  
  // State for form fields
  const [userName, setUserName] = useState('')
  const [masterKey, setMasterKey] = useState('')
  const [message, setMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    switch (name) {
      case 'userName':
        setUserName(value)
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
    e.preventDefault() // Prevent default form submission
    
    let validationErrors = 3

    if (userName.length < 4 || !userName) {
      setMessage("The Username must be at least 4 characters long")
      setShowErrorModal(true)
      return
    } else {
      validationErrors--
    }
    
    if (masterKey.length < 8) {
      setMessage("The master key must be at least 8 characters long")
      setShowErrorModal(true)
      return
    } else {
      validationErrors--
    }
    
    if (!validator.isAlphanumeric(userName)) {
      setMessage("Username must not contain special characters")
      setShowErrorModal(true)
      return
    } else {
      validationErrors--
    }

    if (validationErrors === 0) {
      window.electron.ipcRenderer
        .invoke('register-account', { userName, masterKey })
        .then((response) => {
          if (response.success) {
            setMessage('User registration success')
            setShowSuccessModal(true)
          } else {
            setMessage(response.message)
            setShowErrorModal(true)
          }
        })
        .catch((error) => {
          console.log('Error sending registration request', error)
          setMessage("Error while registering the account")
          setShowErrorModal(true)
        })
    }
  }

  const generateMasterKey = (): void => {
    window.electron.ipcRenderer.invoke('generate-password')
      .then((response) => {
        setMasterKey(response)
      })
      .catch((err) => {
        console.log("Error", err)
      })
  }

  const closeModal = (): void => {
    setShowErrorModal(false)
    setMessage('')
  }

  const closeSuccessModal = (): void => {
    setShowSuccessModal(false)
    setMessage('')
    navigate("/")
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-zinc-950 overflow-hidden text-zinc-200 font-sans">
      
      {/* Background Decor: Consistent ambient glow */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-900/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[100px]" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Cipher<span className="text-emerald-500">Vault</span>
          </h1>
          <p className="text-sm text-zinc-500">Create your secure identity</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div className="group">
            <label htmlFor="userName" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
              Username
            </label>
            <input
              name="userName"
              type="text"
              id="userName"
              value={userName}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="Choose a username"
            />
          </div>

          {/* Master Key Input Group */}
          <div className="group">
            <label htmlFor="masterKey" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
              Master Key
            </label>
            <div className="flex gap-2">
              <input
                name="masterKey"
                type="text"
                id="masterKey"
                value={masterKey}
                onChange={handleInputChange}
                className="flex-1 rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Create or generate key"
              />
              <button
                type="button"
                onClick={generateMasterKey}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
              >
                Generate
              </button>
            </div>
            <p className="mt-2 text-[10px] text-zinc-600">
              We recommend using the generator for maximum entropy.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40 active:scale-[0.98]"
            >
              Create Account
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <Link to="/" className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline underline-offset-4 transition-all">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modals */}
      {showErrorModal && <ErrorModal errorMessage={message} onClose={closeModal} />}
      {showSuccessModal && <SuccessModal successMessage={message} onClose={closeSuccessModal} />}
    </div>
  )
}

export default RegisterPage