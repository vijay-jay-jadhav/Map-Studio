import React, { useState } from 'react';
import { StateDataRow, MapSettings } from './types';
import { FULL_INDIA_DATA } from './constants/mapConfig';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { DataInput } from './components/DataInput';
import { MapRenderer } from './components/MapRenderer';

export const App: React.FC = () => {
  const [data, setData] = useState<StateDataRow[]>(FULL_INDIA_DATA);
  const [settings, setSettings] = useState<MapSettings>({
    titleText: 'State-wise Data Distribution',
    sourceText: 'Source: Official Estimates / Census',
    creditsText: 'DataVizPulse / Vijay',
    annotationText: 'Higher density in northern and western corridors.',
    palette: 'Blues',
    valuePrefix: '',
    valueSuffix: '%',
    fontFamily: 'Plus Jakarta Sans'
  });

  // State for rendering triggers & progress
  const [activeData, setActiveData] = useState<StateDataRow[]>(FULL_INDIA_DATA);
  const [activeSettings, setActiveSettings] = useState<MapSettings>({
    titleText: 'State-wise Data Distribution',
    sourceText: 'Source: Official Estimates / Census',
    creditsText: 'DataVizPulse / Vijay',
    annotationText: 'Higher density in northern and western corridors.',
    palette: 'Blues',
    valuePrefix: '',
    valueSuffix: '%',
    fontFamily: 'Plus Jakarta Sans'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setActiveData([...data]);
      setActiveSettings({ ...settings });
      setIsGenerating(false);
      setToastMessage('Map generated successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f3]">
      <Header />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg border border-neutral-700 flex items-center gap-2 animate-bounce">
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Sidebar: Controls & Settings */}
          <Sidebar settings={settings} onChangeSettings={setSettings} />

          {/* Main 2-Column Split: Data Input (Left) & Preview (Right) */}
          <div className="flex-1 w-full grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-5 flex flex-col gap-6">
              <DataInput
                data={data}
                onChangeData={(newData) => {
                  setData(newData);
                  setActiveData(newData);
                }}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            <div className="xl:col-span-7 flex flex-col gap-6">
              <MapRenderer
                data={activeData}
                settings={activeSettings}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
