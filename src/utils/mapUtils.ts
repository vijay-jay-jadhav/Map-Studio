import * as d3 from 'd3';
import Papa from 'papaparse';
import { PaletteName, StateDataRow } from '../types';
import { STATE_ALIASES } from '../constants/mapConfig';

export function getCanonicalStateName(state: string): string {
  if (!state) return '';
  const trimmed = state.trim();
  return STATE_ALIASES[trimmed] || trimmed;
}

export function wrapTextByWords(text: string, wordsPerLine = 5): string[] {
  if (!text) return [];
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '));
  }
  return lines;
}

export function getColorInterpolator(palette: PaletteName): (t: number) => string {
  switch (palette) {
    case 'Blues':
      return d3.interpolateBlues;
    case 'Reds':
      return d3.interpolateReds;
    case 'Greens':
      return d3.interpolateGreens;
    case 'Purples':
      return d3.interpolatePurples;
    case 'OrRd':
      return d3.interpolateOrRd;
    case 'RdBu':
      return (t: number) => d3.interpolateRdBu(1 - t);
    case 'PiYG':
      return d3.interpolatePiYG;
    case 'magma':
      return d3.interpolateMagma;
    case 'RdYlBu':
      return (t: number) => d3.interpolateRdYlBu(1 - t);
    case 'bwr':
      return (t: number) => d3.interpolateRgbBasis(['#1a3680', '#ffffff', '#b31529'])(t);
    case 'coolwarm':
      return (t: number) => d3.interpolateRgbBasis(['#3b4cc0', '#8cb2e9', '#dddcdc', '#f49a7b', '#b40426'])(t);
    case 'winter':
      return (t: number) => d3.interpolateRgbBasis(['#0000ff', '#00ff80'])(t);
    case 'Viridis':
      return d3.interpolateViridis;
    case 'Plasma':
      return d3.interpolatePlasma;
    case 'YlGnBu':
      return d3.interpolateYlGnBu;
    case 'Spectral':
      return (t: number) => d3.interpolateSpectral(1 - t);
    default:
      return d3.interpolateBlues;
  }
}

export function getLuminanceTextColor(colorStr: string): 'white' | 'black' {
  const color = d3.color(colorStr);
  if (!color) return 'black';
  const rgb = color.rgb();
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 0.55 ? 'white' : 'black';
}

export function parseCsvOrTextData(rawText: string): StateDataRow[] {
  if (!rawText || !rawText.trim()) return [];

  // Try standard delimiter detection with papaparse
  const result = Papa.parse(rawText.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase().replace(/\u00a0/g, '')
  });

  if (result.data && result.data.length > 0) {
    const rows: StateDataRow[] = [];
    for (const item of result.data as Record<string, string | number>[]) {
      // Find state and value keys
      const stateKey = Object.keys(item).find(
        (k) => k === 'state' || k === 'name' || k.includes('state')
      );
      const valueKey = Object.keys(item).find(
        (k) => k === 'value' || k === 'val' || k.includes('value') || k.includes('val') || k === 'count'
      );

      if (stateKey && item[stateKey] !== undefined) {
        const stateStr = String(item[stateKey]).trim();
        const rawVal = valueKey ? item[valueKey] : undefined;
        let numVal: number | string = 'NA';
        if (rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '' && String(rawVal).trim() !== 'NA') {
          const parsed = Number(String(rawVal).replace(/,/g, '').trim());
          numVal = isNaN(parsed) ? String(rawVal).trim() : parsed;
        }
        rows.push({
          state: stateStr,
          value: numVal,
          canonical_state: getCanonicalStateName(stateStr)
        });
      }
    }
    if (rows.length > 0) return rows;
  }

  // Fallback: Line by line regex parsing (supports tabs, multiple spaces, commas)
  const lines = rawText.trim().split('\n');
  const parsedRows: StateDataRow[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Skip header line if detected
    if (i === 0 && line.toLowerCase().includes('state') && line.toLowerCase().includes('value')) {
      continue;
    }
    // Match split by tab, comma, or double space
    const parts = line.split(/[\t,]|  +/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const state = parts[0];
      const valStr = parts[1];
      const parsedNum = Number(valStr.replace(/,/g, ''));
      parsedRows.push({
        state,
        value: isNaN(parsedNum) ? valStr : parsedNum,
        canonical_state: getCanonicalStateName(state)
      });
    }
  }

  return parsedRows;
}
