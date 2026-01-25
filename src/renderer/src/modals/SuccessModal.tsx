import React from 'react'

interface ErrorModalProps {
  successMessage: string;
  onClose: () => void;
}

const SuccessModal: React.FC<ErrorModalProps> = ({ successMessage, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-sm scale-100 transform rounded-xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl transition-all">
        <div className="flex items-center gap-4 mb-4">
          {/* Icon Container */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Success</h2>
        </div>
        
        <p className="mb-6 text-zinc-400 text-sm leading-relaxed">
          {successMessage}
        </p>
        
        <div className="flex justify-end">
          <button
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 active:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            onClick={onClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal