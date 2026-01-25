import React from 'react';
import { FiMinus, FiSquare, FiX } from 'react-icons/fi';

const TitleBar = (): JSX.Element => {
  
  const handleMinimize = (): void => {
    window.electron.ipcRenderer.send('window-minimize');
  };

  const handleMaximize = (): void => {
    window.electron.ipcRenderer.send('window-maximize');
  };

  const handleClose = (): void => {
    window.electron.ipcRenderer.send('window-close');
  };

  return (
    <div className="h-10 bg-zinc-950/80 backdrop-blur-md flex justify-between items-center select-none border-b border-zinc-800 z-50 sticky top-0">
      
      {/* Drag Region */}
      <div className="flex-1 h-full flex items-center px-10" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
          Cipher<span className="text-emerald-500">Vault</span>
        </span>
      </div>

      {/* Window Controls */}
      <div className="flex h-full" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        
        <button onClick={handleMinimize} className="w-12 h-full flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors outline-none focus:bg-zinc-800">
          <FiMinus className="w-4 h-4" />
        </button>
        
        <button onClick={handleMaximize} className="w-12 h-full flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors outline-none focus:bg-zinc-800">
          <FiSquare className="w-3 h-3" />
        </button>
        
        <button onClick={handleClose} className="w-12 h-full flex items-center justify-center text-zinc-400 hover:bg-rose-600 hover:text-white transition-colors outline-none focus:bg-rose-600">
          <FiX className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default TitleBar;