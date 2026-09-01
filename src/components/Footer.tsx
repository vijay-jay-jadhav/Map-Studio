import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="mt-auto py-6 border-t border-[#e5e1da] bg-white text-center text-xs text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          Built by{' '}
          <a
            href="https://www.linkedin.com/in/vijay-jay-jadhav/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#c0245d] hover:underline inline-flex items-center gap-1"
          >
            Vijay Jadhav
            <ExternalLink className="w-3 h-3" />
          </a>{' '}
          · Data Journalist & Data Visualization Specialist
        </p>
        <p className="text-neutral-400">
          Editorial Map Studio · D3.js · React · GeoJSON
        </p>
      </div>
    </footer>
  );
};
