import React, { useState, useRef } from 'react';
import { StateDataRow } from '../types';
import { SAMPLE_SIMPLE_DATA, FULL_INDIA_DATA } from '../constants/mapConfig';
import { parseCsvOrTextData, getCanonicalStateName } from '../utils/mapUtils';
import {
  UploadCloud,
  FileSpreadsheet,
  Layers,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DataInputProps {
  data: StateDataRow[];
  onChangeData: (data: StateDataRow[]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

type InputMethod = 'upload' | 'paste' | 'sample';

export const DataInput: React.FC<DataInputProps> = ({
  data,
  onChangeData,
  onGenerate,
  isGenerating
}) => {
  const [inputMethod, setInputMethod] = useState<InputMethod>('sample');
  const [pasteText, setPasteText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle CSV upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const parsed = parseCsvOrTextData(text);
        if (parsed.length > 0) {
          onChangeData(parsed);
        }
      }
    };
    reader.readAsText(file);
  };

  // Handle paste data apply
  const handleApplyPaste = () => {
    if (!pasteText.trim()) return;
    const parsed = parseCsvOrTextData(pasteText);
    if (parsed.length > 0) {
      onChangeData(parsed);
    }
  };

  // Handle Table Row Edit
  const handleCellChange = (index: number, field: 'state' | 'value', val: string) => {
    const updated = [...data];
    if (field === 'state') {
      updated[index] = {
        ...updated[index],
        state: val,
        canonical_state: getCanonicalStateName(val)
      };
    } else {
      const num = Number(val);
      updated[index] = {
        ...updated[index],
        value: val === '' || val === 'NA' || isNaN(num) ? val : num
      };
    }
    onChangeData(updated);
  };

  // Add Row
  const handleAddRow = () => {
    onChangeData([
      ...data,
      { state: 'New State', value: 10, canonical_state: 'New State' }
    ]);
  };

  // Delete Row
  const handleDeleteRow = (index: number) => {
    const updated = data.filter((_, idx) => idx !== index);
    onChangeData(updated);
  };

  // Data validity check
  const isValidData = data.length > 0 && data.some((r) => r.state && r.value !== undefined);

  return (
    <div id="data-input-panel" className="bg-white rounded-xl shadow-sm border border-[#e5e1da] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#e5e1da] pb-3">
        <h2 className="text-base font-bold text-neutral-900">1. Data Input</h2>
        <span className="text-xs text-neutral-500 font-medium">{data.length} records</span>
      </div>

      {/* Input Method Selector */}
      <div className="flex items-center gap-2 bg-[#f4f2ed] p-1 rounded-lg border border-[#e5e1da] text-xs font-semibold">
        <button
          id="tab-sample"
          type="button"
          onClick={() => setInputMethod('sample')}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            inputMethod === 'sample'
              ? 'bg-white text-[#c0245d] shadow-2xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Use Sample</span>
        </button>

        <button
          id="tab-paste"
          type="button"
          onClick={() => setInputMethod('paste')}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            inputMethod === 'paste'
              ? 'bg-white text-[#c0245d] shadow-2xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Paste CSV / Excel</span>
        </button>

        <button
          id="tab-upload"
          type="button"
          onClick={() => setInputMethod('upload')}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            inputMethod === 'upload'
              ? 'bg-white text-[#c0245d] shadow-2xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload CSV</span>
        </button>
      </div>

      {/* Method 1: Upload CSV */}
      {inputMethod === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-[#c0245d] bg-pink-50/50'
              : 'border-[#d6d1c7] hover:border-neutral-500 bg-[#faf9f7]'
          }`}
        >
          <input
            id="csv-file-input"
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-[#c0245d] mb-2" />
          <p className="text-xs font-semibold text-neutral-800">
            Click to upload CSV or drag and drop
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Columns: <code className="bg-[#eeebe4] px-1 py-0.5 rounded text-neutral-700">state</code>,{' '}
            <code className="bg-[#eeebe4] px-1 py-0.5 rounded text-neutral-700">value</code>
          </p>
        </div>
      )}

      {/* Method 2: Paste CSV / Excel */}
      {inputMethod === 'paste' && (
        <div className="flex flex-col gap-2">
          <textarea
            id="paste-data-textarea"
            rows={5}
            value={pasteText}
            onChange={(e) => {
              setPasteText(e.target.value);
            }}
            placeholder={`state\tvalue\nJammu & Kashmir\t91.8\nHimachal Pradesh\t63.7\nMaharashtra\t45.2`}
            className="w-full p-2.5 border border-[#d6d1c7] rounded-md font-mono text-xs focus:ring-1 focus:ring-[#c0245d] focus:border-[#c0245d] outline-none"
          />
          <div className="flex justify-end">
            <button
              id="apply-paste-btn"
              type="button"
              onClick={handleApplyPaste}
              disabled={!pasteText.trim()}
              className="px-4 py-1.5 bg-[#c0245d] hover:bg-[#a61c4e] text-white text-xs font-semibold rounded-md shadow-2xs transition disabled:opacity-50"
            >
              Parse & Update Table
            </button>
          </div>
        </div>
      )}

      {/* Method 3: Use Sample */}
      {inputMethod === 'sample' && (
        <div className="flex flex-wrap gap-2.5 p-3 bg-[#faf9f7] rounded-lg border border-[#e5e1da]">
          <button
            id="load-all-states-sample-btn"
            type="button"
            onClick={() => onChangeData(FULL_INDIA_DATA)}
            className="w-full px-4 py-2.5 bg-white hover:bg-neutral-50 border border-[#d6d1c7] rounded-md text-xs font-semibold text-neutral-800 flex items-center justify-center gap-2 shadow-2xs transition"
          >
            <Sparkles className="w-4 h-4 text-[#c0245d]" />
            <span>Load All 36 States Sample</span>
          </button>
        </div>
      )}

      {/* Interactive Data Editor Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
            👇 Edit data directly below:
          </span>
          <div className="flex items-center gap-2">
            <button
              id="add-row-btn"
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[#f4f2ed] hover:bg-[#eae6de] text-neutral-800 rounded border border-[#d6d1c7] transition"
            >
              <Plus className="w-3.5 h-3.5 text-[#c0245d]" />
              <span>Add Row</span>
            </button>
            <button
              id="clear-data-btn"
              type="button"
              onClick={() => onChangeData([])}
              className="px-2 py-1 text-xs text-neutral-500 hover:text-red-600 transition"
              title="Clear all rows"
            >
              Clear
            </button>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="p-8 border border-[#e5e1da] rounded-lg text-center text-xs text-neutral-500 bg-[#faf9f7]">
            No data loaded. Select a sample above or paste data to get started.
          </div>
        ) : (
          <div className="border border-[#e5e1da] rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f2efeb] text-neutral-700 font-bold sticky top-0 border-b border-[#dedad3]">
                <tr>
                  <th className="px-3 py-2 w-12 text-center">#</th>
                  <th className="px-3 py-2">State / UT</th>
                  <th className="px-3 py-2 w-28">Value</th>
                  <th className="px-2 py-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeebe3]">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="px-3 py-1.5 text-center text-neutral-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        type="text"
                        value={row.state}
                        onChange={(e) => handleCellChange(idx, 'state', e.target.value)}
                        className="w-full px-2 py-1 border border-transparent hover:border-[#d6d1c7] focus:border-[#c0245d] rounded outline-none font-medium bg-transparent focus:bg-white text-xs"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => handleCellChange(idx, 'value', e.target.value)}
                        className="w-full px-2 py-1 border border-transparent hover:border-[#d6d1c7] focus:border-[#c0245d] rounded outline-none font-semibold text-neutral-900 bg-transparent focus:bg-white text-xs text-right"
                      />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        className="text-neutral-300 hover:text-red-600 transition p-1"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Validation Status */}
      {isValidData ? (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ready to render map</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Data must contain at least one state and value</span>
        </div>
      )}

      {/* Generate Map Button */}
      <button
        id="generate-map-btn"
        type="button"
        disabled={!isValidData || isGenerating}
        onClick={onGenerate}
        className="w-full py-3 bg-[#c0245d] hover:bg-[#a61c4e] text-white font-bold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Rendering Map…</span>
          </>
        ) : (
          <span>🚀 Generate Map</span>
        )}
      </button>
    </div>
  );
};
