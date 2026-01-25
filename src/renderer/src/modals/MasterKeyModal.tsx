import React, { useContext, useState } from 'react'
import { FiKey, FiLock, FiUnlock, FiX } from 'react-icons/fi'
import { AuthContext } from '@renderer/utils/AuthContext'

interface MasterKeyModalProps {
  onClose: () => void
  onDeclined: () => void
  handleView: () => void
  handleEdit: () => void
  operation: string // 'view' or 'edit' based on previous logic
}

const MasterKeyModal = ({ onClose, onDeclined, handleView, handleEdit, operation }: MasterKeyModalProps): JSX.Element => {
  const [masterKey, setMasterKey] = useState('')
  const { user } = useContext(AuthContext)
  const userName = user?.username

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    window.electron.ipcRenderer
      .invoke('verify-user', { userName, masterKey })
      .then((response) => {
        if (response.success) {
          if (operation === "view") {
            handleView()
          } else {
            handleEdit()
          }
        } else {
          onDeclined()
        }
      })
      .catch((err) => {
        console.log(err)
        onDeclined()
      })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-sm scale-100 transform rounded-xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
          <FiKey className="h-6 w-6 text-emerald-500" />
        </div>

        {/* Text Content */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-white">Security Verification</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Please enter your master key to <span className="text-emerald-400 font-medium">{operation === 'view' ? 'reveal' : 'edit'}</span> these credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
              <FiLock />
            </div>
            <input
              type="password"
              id="masterKey"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono tracking-widest"
              placeholder="••••••••"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all text-sm font-medium shadow-lg shadow-emerald-900/20"
            >
              <FiUnlock className="h-4 w-4" />
              <span>Verify</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MasterKeyModal