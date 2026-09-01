import React, { useState } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

const VALID_USERNAME = 'mapstudio';
const VALID_PASSWORD = 'mapstudio1212';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      if (trimmedUser === VALID_USERNAME && trimmedPass === VALID_PASSWORD) {
        if (rememberMe) {
          localStorage.setItem('mapstudio_auth', JSON.stringify({ user: trimmedUser, timestamp: Date.now() }));
        } else {
          sessionStorage.setItem('mapstudio_auth', JSON.stringify({ user: trimmedUser, timestamp: Date.now() }));
        }
        setIsLoading(false);
        onLoginSuccess(trimmedUser);
      } else {
        setIsLoading(false);
        setError('Invalid username or passkey. Please check your credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-white border border-[#dedad3] rounded-2xl shadow-xl shadow-neutral-900/5 p-6 sm:p-8">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#fdf2f5] border border-[#f5cfdc] flex items-center justify-center text-[#c0245d]">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Studio Access Required</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Enter your editorial credentials to access the India Choropleth Studio.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-username" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter studio username"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50/50 border border-[#d6d1c7] rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-[#c0245d]/20 focus:border-[#c0245d] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter access passkey"
                  className="w-full pl-9 pr-10 py-2.5 bg-neutral-50/50 border border-[#d6d1c7] rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-[#c0245d]/20 focus:border-[#c0245d] outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#c0245d] rounded border-neutral-300 focus:ring-[#c0245d]"
                />
                <span className="text-xs text-neutral-600 font-medium">Keep me signed in</span>
              </label>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-[#c0245d] hover:bg-[#a61c4e] active:scale-[0.99] text-white text-sm font-semibold rounded-lg shadow-md shadow-[#c0245d]/15 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Enter Map Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md pb-6 text-center text-xs text-neutral-500">
        Vijay Jadhav · Data Journalist
      </div>
    </div>
  );
};
