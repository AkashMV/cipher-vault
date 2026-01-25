// Settings.tsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCloud, FiMoon, FiLogOut, FiTrash2, FiUser, FiCheck } from 'react-icons/fi';
import { useTheme } from '@renderer/utils/ThemeContext';
import { AuthContext } from '@renderer/utils/AuthContext';
import ErrorModal from '@renderer/modals/ErrorModal';
import SuccessModal from '@renderer/modals/SuccessModal';

const Settings = (): JSX.Element => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext)
  const [isSyncing, setIsSycning] = useState(false)
  // Defaulting to false if undefined, logic preserved
  const [cloudIntegration, setCloudIntegration] = useState(false);
  // We keep the theme hook, though the UI is now forced dark for consistency, 
  // keeping the toggle functional ensures logic doesn't break.
  const { theme, toggleTheme } = useTheme();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [message, setMessage] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  // Logic preserved exactly as provided
  const handleCloudIntegrationToggle = async (): Promise<void> => {
    if (!user) return;

    const newToggleState = !cloudIntegration;
    setCloudIntegration(newToggleState); // 1. Optimistic UI Update
    setIsSycning(true); // Show syncing text

    try {
      let currentCloudId = user.cloudId;

      // STEP 1: If turning ON and we don't have a Cloud ID yet...
      if (newToggleState && !currentCloudId) {
        console.log("No Cloud ID found. Creating one...");
        
        const createRes = await window.electron.ipcRenderer.invoke("create-cloud-user", {
          userId: user.id,
          userName: user.username
        });

        if (createRes.success) {
          currentCloudId = createRes.cloudId;
          // Update local context immediately
          setUser((prev) => (prev ? { ...prev, cloudId: currentCloudId } : null));
          console.log("Generated new Cloud ID:", currentCloudId);
        } else {
          throw new Error(createRes.message || "Failed to create cloud user");
        }
      }

      // STEP 2: Update the local database to remember "Cloud is ON"
      const updateRes = await window.electron.ipcRenderer.invoke("update-cloud-integration", {
        userId: user.id,
        cloudEnabled: newToggleState 
      });

      if (updateRes.success) {
        // Update local context to reflect the new switch state
        setUser((prev) => (prev ? { ...prev, cloudEnabled: newToggleState } : null));
        setIsSycning(false);
        // Optional: Trigger a sync immediately after enabling
        if(newToggleState) {
           // window.electron.ipcRenderer.invoke('sync-vault', ...)
        }
      } else {
        throw new Error("Failed to save cloud preference");
      }

    } catch (error) {
      console.error("Toggle failed:", error);
      setMessage("Could not enable cloud sync. Check your connection.");
      setShowErrorModal(true);
      
      // REVERT UI on failure
      setCloudIntegration(!newToggleState); 
      setIsSycning(false);
    }
  };

  const handleDarkModeToggle = (): void => {
    toggleTheme();
  };

  const handleLogout = (): void => {
    setUser(null)
    navigate('/');
  };

  const handleDeleteUser = (): void => {
    window.electron.ipcRenderer.invoke("delete-user", { userId: user?.id })
      .then((response) => {
        setMessage(response.message)
        if (response.success) {
          setShowSuccessModal(true)
        } else {
          setShowErrorModal(true)
        }
      })
  };

  const closeSuccessModal = (): void => {
    setUser(null)
    navigate("/")
    setShowSuccessModal(false)
  }

  const closeErrorModal = (): void => {
    setShowErrorModal(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-emerald-500/30">
      
      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Settings
          </h1>
        </div>
      </header>

      <main className="relative container mx-auto px-6 py-8 max-w-3xl">
        
        {/* User Profile Snippet */}
        <div className="flex items-center gap-4 mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-zinc-700">
             <FiUser className="h-8 w-8 text-zinc-400"/>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.username || 'User'}</h2>
            <p className="text-zinc-500 text-sm">Account ID: <span className="font-mono text-zinc-400">{user?.id}</span></p>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* Section: Application */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 pl-2">Application</h3>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden divide-y divide-zinc-800">
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                    <FiMoon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200">Dark Appearance</p>
                    <p className="text-xs text-zinc-500">Adjust the visual theme of the vault</p>
                  </div>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${theme === 'dark' ? 'bg-emerald-600' : 'bg-zinc-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

            </div>
          </section>

          {/* Section: Sync & Cloud */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 pl-2">Sync & Security</h3>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden divide-y divide-zinc-800">
              
              {/* Cloud Integration Toggle */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-900/20 text-blue-500">
                    <FiCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200">Cloud Integration</p>
                    <p className="text-xs text-zinc-500">Sync passwords across devices securely</p>
                  </div>
                </div>
                <button
                  onClick={handleCloudIntegrationToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${cloudIntegration ? 'bg-blue-600' : 'bg-zinc-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${cloudIntegration ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                {isSyncing && <p className='text-white'>Syncing..</p>}
              </div>

            </div>
          </section>

          {/* Section: Session */}
          <section>
             <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
                    <FiLogOut className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-zinc-300 group-hover:text-white">Log Out</span>
                </div>
              </button>
          </section>

          {/* Section: Danger Zone */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-4 pl-2">Danger Zone</h3>
            <div className="rounded-xl border border-rose-900/30 bg-rose-950/10 overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div>
                   <h4 className="font-medium text-rose-200">Delete Account</h4>
                   <p className="text-xs text-rose-400/70 max-w-xs mt-1">Permanently delete your account and all local data. This action cannot be undone.</p>
                </div>
                <button
                  onClick={handleDeleteUser}
                  className="flex items-center gap-2 rounded-lg bg-rose-900/20 border border-rose-900/50 px-4 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeErrorModal} />)}
      {showSuccessModal && (<SuccessModal successMessage={message} onClose={closeSuccessModal} />)}
    </div>
  );
};

export default Settings;