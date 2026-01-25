import React from 'react'

interface ErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, onClose }) => {
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Error</h2>
        </div>
        
        <p className="mb-6 text-zinc-400 text-sm leading-relaxed">
          {errorMessage}
        </p>
        
        <div className="flex justify-end">
          <button
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 active:bg-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal