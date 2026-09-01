import React from 'react';
import { Map } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header id="main-header" className="bg-white border-b border-[#e5e1da]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f2efeb] text-neutral-800 border border-[#dedad3]">
            India Choropleth 4:5
          </span>
        </div>
      </div>
    </header>
  );
};
