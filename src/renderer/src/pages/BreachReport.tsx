// BreachReport.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiAlertTriangle, FiShield, FiCheck, FiGlobe, FiCalendar, FiUsers } from 'react-icons/fi';

interface Breach {
  Name: string; // Adjusted to TitleCase based on standard HIBP API response, double check your API return
  Domain: string;
  BreachDate: string;
  PwnCount: number;
  Description?: string;
}

const BreachReport = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  // Note: The HIBP API usually returns keys in PascalCase (Name, Domain), I updated the interface above to match common responses, 
  // but if your specific proxy returns camelCase, revert the Interface keys.
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // To distinguish between "fresh load" and "no results found"
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    setHasSearched(true);
    setBreaches([]);

    try {
      // Logic preserved from your snippet
      // Ideally this hits a backend proxy to avoid CORS or API Key exposure
      // const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`);
      
      // Using your test endpoint for now as per your code:
      const response = await fetch(`https://haveibeenpwned.com/api/v3/breach/facebook`);
      
      if (response.ok) {
        const data = await response.json();
        // If the API returns a single object (like the facebook endpoint might), wrap it in an array
        const normalizedData = Array.isArray(data) ? data : [data];
        setBreaches(normalizedData);
      } else {
        // 404 usually means no breaches found for that account
        setBreaches([]);
      }
    } catch (error) {
        console.log(error)
        setError('Unable to connect to the breach database.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-rose-500/30">
      
      {/* Background Decor: Red/Rose tint for "Security Alert" vibe */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-900/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] pointer-events-none" />

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
             Breach <span className="text-rose-500">Radar</span>
           </h1>
        </div>
      </header>

      <main className="relative container mx-auto px-6 py-12 max-w-4xl">
        
        {/* Search Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Has your account been compromised?</h2>
          <p className="text-zinc-500 mb-8">Enter your email address to search through known data breaches.</p>
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-zinc-500 group-focus-within:text-rose-500 transition-colors" />
            </div>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={handleEmailChange}
              className="w-full pl-12 pr-32 py-4 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder-zinc-600 outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all shadow-xl"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
            >
              {isLoading ? 'Scanning...' : 'Check'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="min-h-[200px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500 animate-pulse">
               <div className="h-12 w-12 rounded-full border-4 border-zinc-800 border-t-rose-500 animate-spin mb-4"></div>
               <p>Scanning dark web databases...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-xl bg-rose-900/10 border border-rose-900/50 p-6 flex items-center gap-4 text-rose-200">
               <FiAlertTriangle className="h-6 w-6 text-rose-500" />
               <p>{error}</p>
            </div>
          )}

          {!isLoading && hasSearched && !error && breaches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                <FiCheck className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Breaches Found</h3>
              <p className="text-zinc-500 max-w-md">
                Good news! We couldn't find this email address in our database of breached sites.
              </p>
            </div>
          )}

          {!isLoading && breaches.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <FiAlertTriangle className="text-rose-500" />
                   Found {breaches.length} Breach{breaches.length > 1 ? 'es' : ''}
                 </h3>
                 <span className="text-xs text-rose-400 bg-rose-900/20 border border-rose-900/50 px-2 py-1 rounded">Action Recommended</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {breaches.map((breach, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-rose-500/30 transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-600 group-hover:bg-rose-500 transition-colors" />
                    
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pl-4">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-rose-400 transition-colors">{breach.Name || "Unknown Breach"}</h4>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-3">
                           <div className="flex items-center gap-1">
                             <FiGlobe className="h-4 w-4" />
                             <span>{breach.Domain || "Unknown Domain"}</span>
                           </div>
                           <div className="flex items-center gap-1">
                             <FiCalendar className="h-4 w-4" />
                             {/* Handle date formatting if needed */}
                             <span>{breach.BreachDate}</span>
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                        <FiUsers className="h-4 w-4 text-zinc-500" />
                        <span className="text-sm font-mono text-zinc-300">
                           {breach.PwnCount ? breach.PwnCount.toLocaleString() : 0}
                        </span>
                        <span className="text-xs text-zinc-600 uppercase">Affected</span>
                      </div>
                    </div>
                    
                    {/* Optional: If description exists, render it (stripped of HTML ideally) */}
                    {breach.Description && (
                        <div className="mt-4 pl-4 text-sm text-zinc-500 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: breach.Description }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default BreachReport;