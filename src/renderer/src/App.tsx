import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Make sure the path is correct
import DashBoard from './pages/DashBoard';
import LocalStorage from './pages/localPasswords';
import CloudStorage from './pages/cloudPasswords';
import {AuthProvider} from "./utils/AuthContext"
import { ThemeProvider } from './utils/ThemeContext';
import BreachReport from './pages/BreachReport';
import Settings from './pages/Settings';
import TitleBar from './components/TitleBar';
function App(): JSX.Element {
  return (
    <ThemeProvider>
    <AuthProvider>
      <div className="flex flex-col h-screen bg-transparent rounded-xl overflow-hidden border border-zinc-800/50 shadow-2xl">
      {/* The Title Bar stays fixed at the top */}
      <TitleBar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/local-passwords" element={<LocalStorage />} />
              <Route path="/cloud-passwords" element={<CloudStorage />} />
              <Route path="/breach-report" element={<BreachReport />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
          
      </div>
              </AuthProvider>
      </ThemeProvider>
  )
}

export default App;
