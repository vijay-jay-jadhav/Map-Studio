export interface StateDataRow {
  state: string;
  value: number | string;
  canonical_state?: string;
}

export interface LabelPosition {
  state: string;
  x: number;
  y: number;
}

export type PaletteName =
  | 'Blues'
  | 'Reds'
  | 'Greens'
  | 'Purples'
  | 'OrRd'
  | 'RdBu'
  | 'PiYG'
  | 'magma'
  | 'RdYlBu'
  | 'bwr'
  | 'coolwarm'
  | 'winter'
  | 'Viridis'
  | 'Plasma'
  | 'YlGnBu'
  | 'Spectral';

export interface MapSettings {
  titleText: string;
  sourceText: string;
  creditsText: string;
  annotationText: string;
  palette: PaletteName;
  valuePrefix: string;
  valueSuffix: string;
  titleFontSize?: number;
  fontFamily?: string;
  titleFontFamily?: string;
}
