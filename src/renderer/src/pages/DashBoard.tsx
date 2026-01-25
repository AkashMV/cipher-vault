import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Importing icons for a visual dashboard
import { FiLogOut, FiHardDrive, FiCloud, FiShield, FiSettings, FiArrowRight } from 'react-icons/fi'
import { AuthContext } from '@renderer/utils/AuthContext'
import { useTheme } from '@renderer/utils/ThemeContext'

const DashBoard = (): JSX.Element => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)
  // We keep the theme hook to avoid breaking logic, but styling is now forced Dark/Sleek as requested
  const { theme } = useTheme() 
  const [isCloudEnabled, setIsCloudEnabled] = useState(false)

  useEffect(() => {
    setIsCloudEnabled(user?.cloudEnabled || false)
  }, [user?.cloudEnabled])

  const handleLogout = (): void => {
    setUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-emerald-500/30">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-96 bg-emerald-900/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-black font-bold text-lg">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Cipher<span className="text-emerald-500">Vault</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500 hidden sm:block">
              Signed in as <span className="text-zinc-300 font-semibold">{user?.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-12">
        
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-zinc-500">Manage your vault, check security, and configure settings.</p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Local Passwords Card */}
          <Link to="/local-passwords" className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:bg-zinc-900 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-900/10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-zinc-800 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                <FiHardDrive className="h-6 w-6" />
              </div>
              <FiArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Local Vault</h3>
            <p className="text-sm text-zinc-400">
              Access passwords stored encrypted on this device.
            </p>
          </Link>

          {/* Cloud Passwords Card (Conditional) */}
          {isCloudEnabled && user?.cloudId && (
            <Link to="/cloud-passwords" className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:bg-zinc-900 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-zinc-800 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                  <FiCloud className="h-6 w-6" />
                </div>
                <FiArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cloud Vault</h3>
              <p className="text-sm text-zinc-400">
                Sync and manage passwords across your devices.
              </p>
            </Link>
          )}

          {/* Breach Report Card */}
          <Link to="/breach-report" className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:bg-zinc-900 transition-all hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-900/10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-zinc-800 group-hover:bg-rose-500/10 group-hover:text-rose-500 transition-colors">
                <FiShield className="h-6 w-6" />
              </div>
              <FiArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-rose-500 transition-colors transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Breach Report</h3>
            <p className="text-sm text-zinc-400">
              Check if your emails have been compromised in data leaks.
            </p>
          </Link>

          {/* Settings Card */}
          <Link to="/settings" className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:bg-zinc-900 transition-all hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-900/10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-zinc-800 group-hover:bg-purple-500/10 group-hover:text-purple-500 transition-colors">
                <FiSettings className="h-6 w-6" />
              </div>
              <FiArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-purple-500 transition-colors transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
            <p className="text-sm text-zinc-400">
              Configure master key, theme, and application preferences.
            </p>
          </Link>

        </div>
      </main>
    </div>
  )
}

export default DashBoard