import React from 'react'

interface ErrorModalProps {
  successMessage: string;
}

const DeleteSuccessModal: React.FC<ErrorModalProps> = ({ successMessage }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-emerald-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Account Deleted</h2>
        <p className="text-zinc-400 leading-relaxed mb-6">
          {successMessage}
        </p>

        {/* Since this modal usually redirects immediately, we keep it simple, 
            but adding a small spinner suggests something is happening (redirection) */}
        <div className="flex justify-center">
             <div className="h-5 w-5 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  )
}

export default DeleteSuccessModal