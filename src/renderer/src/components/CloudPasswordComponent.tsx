import React, { useState } from 'react';
import { FiEdit, FiEye, FiEyeOff, FiGlobe, FiUser, FiLock } from 'react-icons/fi';
import MasterKeyModal from '@renderer/modals/MasterKeyModal';
import EditCloudPasswordModal from '@renderer/modals/EditCloudPasswordModal'; // Keeping your import, though usually this might be EditPasswordModal for local
import ErrorModal from '@renderer/modals/ErrorModal';
import SuccessModal from '@renderer/modals/SuccessModal';

interface Password {
  id: number
  service: string
  user_name: string
  password: string
}

interface PasswordComponentProps {
  password: Password;
  refreshPasswords: () => void
}

const PasswordComponent = ({ password, refreshPasswords }: PasswordComponentProps): JSX.Element => {
  const [showMasterKeyModal, setShowMasterKeyModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [message, setMessage] = useState("");
  const [viewOrEdit, setViewOrEdit] = useState("view")
  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false)

  const closeSuccessModal = (): void => {
    setShowSuccessModal(false)
  }

  // Edit Password Modal Functions
  const handleUpdateSuccess = (): void => {
    setShowEditPasswordModal(false)
    setMessage("Password Details Updated Successfully")
    setShowSuccessModal(true)
    refreshPasswords()
  }

  const handleDeleteSuccess = (): void => {
    setShowEditPasswordModal(false)
    setMessage("Password Deleted Successfully")
    setShowSuccessModal(true)
    refreshPasswords()
  }

  const closePasswordModal = (): void => {
    setShowEditPasswordModal(false);
  };

  // Master Key Modal Functions
  const handleEditClick = (): void => {
    setViewOrEdit("edit")
    setShowMasterKeyModal(true);
  };

  // Once key is verified, the option to edit the password is displayed
  const onEditVerified = (): void => {
    setShowMasterKeyModal(false);
    setShowEditPasswordModal(true);
    setMessage('');
  };

  // Toggle view
  const handleViewClick = (): void => {
    if (isPasswordDisplayed) {
      setShowDetails(false)
      setIsPasswordDisplayed(false)
    } else {
      setViewOrEdit("view")
      setShowMasterKeyModal(true);
    }
  };

  // Once key is verified, details of the password is displayed
  const onViewVerified = (): void => {
    setShowMasterKeyModal(false);
    setShowDetails(true);
    setIsPasswordDisplayed(true)
    setMessage('');
  };

  // If the master key given is incorrect
  const onDeclined = (): void => {
    setShowMasterKeyModal(false);
    setMessage('Master Key Verification failed');
    setShowErrorModal(true);
  };

  // Close modals
  const closeMasterKeyModal = (): void => {
    setMessage('');
    setShowMasterKeyModal(false);
  };

  const closeErrorModal = (): void => {
    setMessage('');
    setShowErrorModal(false);
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/10 transition-all duration-300">
        
        {/* Glow Effect on Hover */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-[50px] transition-all group-hover:bg-emerald-500/10" />

        {/* Card Header */}
        <div className="relative z-10 mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-emerald-500 shadow-inner">
              <FiGlobe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">{password.service}</h3>
              <p className="text-xs text-zinc-500">Local ID: {password.id}</p>
            </div>
          </div>
        </div>

        {/* Credentials Section */}
        <div className="relative z-10 space-y-3 mb-6">
          
          {/* Username */}
          <div className="flex items-center gap-3 rounded-lg bg-zinc-950/50 p-2 border border-zinc-800/50">
            <FiUser className="text-zinc-500 h-4 w-4 ml-1" />
            <div className="flex-1 overflow-hidden">
               <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Username</p>
               <p className="text-sm text-zinc-300 truncate font-medium">
                 {showDetails ? password.user_name : '••••••••••••'}
               </p>
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 rounded-lg bg-zinc-950/50 p-2 border border-zinc-800/50">
            <FiLock className="text-zinc-500 h-4 w-4 ml-1" />
            <div className="flex-1 overflow-hidden">
               <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Password</p>
               <p className={`text-sm truncate ${showDetails ? 'text-emerald-400 font-mono' : 'text-zinc-300'}`}>
                 {showDetails ? password.password : '••••••••••••'}
               </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="relative z-10 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-4 mt-auto">
          <button
            onClick={handleViewClick}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
              isPasswordDisplayed 
                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {isPasswordDisplayed ? <FiEyeOff /> : <FiEye />}
            <span>{isPasswordDisplayed ? 'Hide' : 'Reveal'}</span>
          </button>
          
          <button
            onClick={handleEditClick}
            className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <FiEdit />
            <span>Edit</span>
          </button>
        </div>

      </div>

      {/* Modals */}
      {showMasterKeyModal && (
        <MasterKeyModal
          onClose={closeMasterKeyModal}
          onDeclined={onDeclined}
          handleView={onViewVerified}
          handleEdit={onEditVerified}
          operation={viewOrEdit}
        />
      )}
      {showEditPasswordModal && (
        <EditCloudPasswordModal
          onClose={closePasswordModal}
          userPassword={password}
          onUpdateSuccess={handleUpdateSuccess}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
      {showErrorModal && (
        <ErrorModal errorMessage={message} onClose={closeErrorModal} />
      )}
      {showSuccessModal && (
        <SuccessModal successMessage={message} onClose={closeSuccessModal} />
      )}
    </>
  );
};

export default PasswordComponent;