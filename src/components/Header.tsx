import React from 'react';
import { Map, LogOut, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentUser?: string | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onSignOut }) => {
  return (
    <header id="main-header" className="bg-white border-b border-[#e5e1da]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#c0245d] text-white flex items-center justify-center shadow-xs">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Map Studio <span className="text-sm font-normal text-neutral-500">by Vijay Jadhav</span>
            </h1>
            <p className="text-xs text-neutral-600 font-medium">
              Generate high-quality, publication-ready maps from your data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f2efeb] text-neutral-800 border border-[#dedad3]">
            India Choropleth 4:5
          </span>

          {currentUser && onSignOut && (
            <div className="flex items-center gap-2 pl-2 border-l border-[#e5e1da]">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-[11px] font-semibold text-neutral-700 border border-neutral-200">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser}</span>
              </div>
              <button
                id="sign-out-btn"
                onClick={onSignOut}
                title="Lock studio and sign out"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-rose-700 bg-white hover:bg-rose-50 border border-[#d6d1c7] hover:border-rose-300 rounded-md transition shadow-2xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Studio</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

