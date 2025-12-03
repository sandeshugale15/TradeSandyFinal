import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              GeminiMarket
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col text-right">
                      <span className="text-xs font-medium text-slate-200">{user.name}</span>
                      <span className="text-[10px] text-slate-400">{user.email}</span>
                    </div>
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-slate-700" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {user.name?.charAt(0)}
                      </div>
                    )}
                    <button
                      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => loginWithRedirect()}
                    className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Log In
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} GeminiMarket. Market data provided via Gemini Search Grounding.</p>
          <p className="mt-1 text-xs">Not financial advice. Data may be delayed.</p>
        </div>
      </footer>
    </div>
  );
};