import React, { useState } from 'react';
import { MapSettings, PaletteName } from '../types';
import { PALETTES } from '../constants/mapConfig';
import { ChevronDown, ChevronUp, Sliders, Type, Palette, Info, Lock } from 'lucide-react';

interface SidebarProps {
  settings: MapSettings;
  onChangeSettings: (updater: (prev: MapSettings) => MapSettings) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ settings, onChangeSettings }) => {
  const [textOpen, setTextOpen] = useState(true);
  const [styleOpen, setStyleOpen] = useState(true);

  return (
    <aside
      id="map-settings-sidebar"
      className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-4"
    >
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e1da] overflow-hidden">
        {/* Sidebar Header */}
        <div className="px-5 py-3.5 border-b border-[#e5e1da] bg-[#faf9f7] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#c0245d]" />
          <h2 className="text-sm font-bold text-neutral-800 tracking-wide uppercase">
            Map Settings
          </h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Text & Labels Section */}
          <div className="border border-[#e5e1da] rounded-lg overflow-hidden">
            <button
              id="toggle-text-labels-btn"
              type="button"
              onClick={() => setTextOpen(!textOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#f7f5f0] hover:bg-[#eeebe3] text-left text-xs font-bold text-neutral-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-neutral-600" />
                Text & Labels
              </span>
              {textOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </button>

            {textOpen && (
              <div className="p-3.5 space-y-3 bg-white text-xs">
                <div>
                  <label htmlFor="map-title-input" className="block font-medium text-neutral-700 mb-1">
                    Map Title
                  </label>
                  <input
                    id="map-title-input"
                    type="text"
                    value={settings.titleText}
                    onChange={(e) =>
                      onChangeSettings((prev) => ({ ...prev, titleText: e.target.value }))
                    }
                    placeholder="e.g. State-wise Renewable Energy (%)"
                    className="w-full px-3 py-1.5 border border-[#d6d1c7] rounded-md text-xs focus:ring-1 focus:ring-[#c0245d] focus:border-[#c0245d] outline-none transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="title-size-range" className="font-medium text-neutral-700">
                      Title Font Size
                    </label>
                    <span className="text-[11px] font-bold text-[#c0245d]">
                      {settings.titleFontSize || 32}px
                    </span>
                  </div>
                  <input
                    id="title-size-range"
                    type="range"
                    min={22}
                    max={44}
                    step={1}
                    value={settings.titleFontSize || 32}
                    onChange={(e) =>
                      onChangeSettings((prev) => ({
                        ...prev,
                        titleFontSize: Number(e.target.value)
                      }))
                    }
                    className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#c0245d]"
                  />
                </div>

                <div>
                  <label htmlFor="source-input" className="block font-medium text-neutral-700 mb-1">
                    Source
                  </label>
                  <input
                    id="source-input"
                    type="text"
                    value={settings.sourceText}
                    onChange={(e) =>
                      onChangeSettings((prev) => ({ ...prev, sourceText: e.target.value }))
                    }
                    placeholder="e.g. Source: Ministry of Power, 2024"
                    className="w-full px-3 py-1.5 border border-[#d6d1c7] rounded-md text-xs focus:ring-1 focus:ring-[#c0245d] focus:border-[#c0245d] outline-none transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="credits-input" className="block font-medium text-neutral-700">
                      Credits (optional)
                    </label>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                      <Lock className="w-2.5 h-2.5 text-neutral-400" />
                      Locked
                    </span>
                  </div>
                  <input
                    id="credits-input"
                    type="text"
                    disabled
                    value={settings.creditsText || 'DataVizPulse / Vijay'}
                    placeholder="e.g. DataVizPulse / Vijay"
                    className="w-full px-3 py-1.5 border border-[#d6d1c7] rounded-md text-xs bg-neutral-100/80 text-neutral-500 cursor-not-allowed select-none outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="annotation-input" className="block font-medium text-neutral-700 mb-1">
                    Annotation
                  </label>
                  <textarea
                    id="annotation-input"
                    rows={3}
                    value={settings.annotationText}
                    onChange={(e) =>
                      onChangeSettings((prev) => ({ ...prev, annotationText: e.target.value }))
                    }
                    placeholder="Optional editorial notes here…"
                    className="w-full px-3 py-1.5 border border-[#d6d1c7] rounded-md text-xs focus:ring-1 focus:ring-[#c0245d] focus:border-[#c0245d] outline-none transition resize-y"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Styling Section */}
          <div className="border border-[#e5e1da] rounded-lg overflow-hidden">
            <button
              id="toggle-styling-btn"
              type="button"
              onClick={() => setStyleOpen(!styleOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#f7f5f0] hover:bg-[#eeebe3] text-left text-xs font-bold text-neutral-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-neutral-600" />
                Styling
              </span>
              {styleOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </button>

            {styleOpen && (
              <div className="p-3.5 space-y-3 bg-white text-xs">
                <div>
                  <label htmlFor="palette-select" className="block font-medium text-neutral-700 mb-1">
                    Color Palette
                  </label>
                  <select
                    id="palette-select"
                    value={settings.palette}
                    onChange={(e) =>
                      onChangeSettings((prev) => ({
                        ...prev,
                        palette: e.target.value as PaletteName
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-[#d6d1c7] rounded-md text-xs bg-white focus:ring-1 focus:ring-[#c0245d] focus:border-[#c0245d] outline-none transition"
                  >
                    {PALETTES.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="font-family-select" className="block font-medium text-neutral-700 mb-1">
                    Typography / Font Family
                  </label>
                  <select
                    id="font-family-select"
                    value={settings.fontFamily || 'Plus Jakarta Sans'}
                    onChange={(e) =>
                      onChangeSettings((prev) => ({
                        ...prev,
                        fontFamily: e.target.value
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-[#d6d1c7] rounded-md text-xs bg-white focus:ring-1 focus:ring-[#c0245d] focus:border-[#c0245d] outline-none transition"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Editorial — Recommended)</option>
                    <option value="Public Sans">Public Sans (Journalistic & Tabular)</option>
                    <option value="DM Sans">DM Sans (Geometric Modern)</option>
                    <option value="IBM Plex Sans">IBM Plex Sans (Technical & Authoritative)</option>
                    <option value="Lora">Lora (Classic Editorial Serif / The Economist)</option>
                    <option value="Playfair Display">Playfair Display (Luxury High-Contrast Serif)</option>
                    <option value="Roboto">Roboto (Universal Standard Sans)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="prefix-input" className="block font-medium text-neutral-700 mb-1">
                      Prefix
                    </label>
                    <input
                      id="prefix-input"
                      type="text"
                      value={settings.valuePrefix}
                      onChange={(e) =>
                        onChangeSettings((prev) => ({ ...prev, valuePrefix: e.target.value }))
                      }
                      placeholder="e.g. ₹, $"
                      className="w-full px-2.5 py-1.5 border border-[#d6d1c7] rounded-md text-xs focus:ring-1 focus:ring-[#c0245d] focus:border-[#c0245d] outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="suffix-input" className="block font-medium text-neutral-700 mb-1">
                      Suffix
                    </label>
                    <input
                      id="suffix-input"
                      type="text"
                      value={settings.valueSuffix}
                      onChange={(e) =>
                        onChangeSettings((prev) => ({ ...prev, valueSuffix: e.target.value }))
                      }
                      placeholder="e.g. %, cr"
                      className="w-full px-2.5 py-1.5 border border-[#d6d1c7] rounded-md text-xs focus:ring-1 focus:ring-[#c0245d] focus:border-[#c0245d] outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tip Box */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg flex items-start gap-2 text-amber-900 text-xs leading-relaxed">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
            <span>
              <strong>Pro Tip:</strong> Copy cells directly from Excel or Google Sheets and paste them in the data editor.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
