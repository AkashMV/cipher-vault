import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiCloud } from 'react-icons/fi';
import CloudPassowrdComponent from "@renderer/components/CloudPasswordComponent"
import { AuthContext } from '@renderer/utils/AuthContext';
import ErrorModal from '@renderer/modals/ErrorModal';
import AddCloudPasswordModal from '@renderer/modals/AddCloudPasswordModal';

interface Password {
  id: number;
  service: string;
  user_name: string;
  password: string;
}

const CloudStorage = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?.cloudId;
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [message, setMessage] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAddPasswordModal, setShowAddPasswwordModal] = useState(false);

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = (): void => {
    window.electron.ipcRenderer.invoke('fetch-cloud-passwords', { userId })
      .then((response) => {
        if (response.success) {
          console.log(response.passwords)
          setPasswords(response.passwords);
        } else {
          setMessage(response.message);
          setShowErrorModal(true);
          navigate("/dashboard");
        }
      });
  };

  const closeErrorModal = (): void => {
    setShowErrorModal(false);
  };

  const openShowPasswordModal = (): void => {
    setShowAddPasswwordModal(true);
  };

  const closeAddPasswordModal = (): void => {
    setShowAddPasswwordModal(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30">
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
                <FiCloud className="text-blue-500"/>
                <h1 className="text-xl font-bold tracking-tight text-white">
                Cloud <span className="text-blue-500">Vault</span>
                </h1>
            </div>
          </div>
          <button
             onClick={openShowPasswordModal}
             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Add New Button Card */}
          <div
            onClick={openShowPasswordModal}
            className="group flex flex-col items-center justify-center min-h-[180px] rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 hover:border-blue-500/50 cursor-pointer transition-all"
          >
            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-colors mb-3">
              <FiPlus className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300">Add Password</span>
          </div>

          {/* Password List */}
          {passwords.map((password) => (
            <CloudPassowrdComponent
              key={password.id}
              password={password}
              refreshPasswords={fetchPasswords}
            />
          ))}

        </div>
      </main>

      {showAddPasswordModal && (<AddCloudPasswordModal onClose={closeAddPasswordModal} refreshPasswords={fetchPasswords} />)}
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeErrorModal} />)}
    </div>
  );
};

export default CloudStorage;