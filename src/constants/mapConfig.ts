import { LabelPosition, PaletteName, StateDataRow } from '../types';

export const STATE_ALIASES: Record<string, string> = {
  'J&K': 'Jammu and Kashmir',
  'Jammu & Kashmir': 'Jammu and Kashmir',
  'Himachal': 'Himachal Pradesh',
  'HR': 'Haryana',
  'WB': 'West Bengal',
  'CG': 'Chhattisgarh',
  'Andhra': 'Andhra Pradesh',
  'Arunachal': 'Arunachal Pradesh',
  'A&N Islands': 'Andaman and Nicobar',
  'Andaman & Nicobar Islands': 'Andaman and Nicobar',
  'Andaman and Nicobar Islands': 'Andaman and Nicobar',
  'DNHDD': 'DNH and DD',
  'Dadra & Nagar Haveli and Daman & Diu': 'DNH and DD',
  'Dadra and Nagar Haveli and Daman and Diu': 'DNH and DD',
  'Daman and Diu': 'DNH and DD',
  'Dadra and Nagar Haveli': 'DNH and DD',
  'Delhi': 'NCT of Delhi',
  'NCT of Delhi': 'NCT of Delhi',
  'Orissa': 'Odisha',
  'Pondicherry': 'Puducherry',
  'Uttaranchal': 'Uttarakhand'
};

export const LABEL_POSITIONS: LabelPosition[] = [
  { state: 'J&K', x: 74.8, y: 33.6 },
  { state: 'Ladakh', x: 77.8, y: 34.4 },
  { state: 'Himachal', x: 77.2, y: 32.0 },
  { state: 'Punjab', x: 75.5, y: 30.8 },
  { state: 'HR', x: 76.2, y: 29.1 },
  { state: 'Delhi', x: 78.2, y: 28.5 },
  { state: 'Uttarakhand', x: 79.4, y: 30.0 },
  { state: 'Rajasthan', x: 73.8, y: 26.5 },
  { state: 'Uttar Pradesh', x: 80.5, y: 27.0 },
  { state: 'Bihar', x: 85.6, y: 25.6 },
  { state: 'Jharkhand', x: 85.1, y: 23.6 },
  { state: 'WB', x: 87.7, y: 23.2 },
  { state: 'Sikkim', x: 88.5, y: 28.8 },
  { state: 'Assam', x: 92.4, y: 26.4 },
  { state: 'Arunachal', x: 92.2, y: 29.0 },
  { state: 'Nagaland', x: 96.3, y: 26.1 },
  { state: 'Manipur', x: 96.0, y: 24.4 },
  { state: 'Mizoram', x: 94.5, y: 23.0 },
  { state: 'Tripura', x: 91.5, y: 22.2 },
  { state: 'Meghalaya', x: 91.2, y: 25.2 },
  { state: 'Odisha', x: 84.8, y: 20.5 },
  { state: 'CG', x: 82.0, y: 21.7 },
  { state: 'Madhya Pradesh', x: 78.0, y: 23.0 },
  { state: 'Gujarat', x: 71.8, y: 23.2 },
  { state: 'Maharashtra', x: 75.5, y: 19.5 },
  { state: 'Telangana', x: 79.2, y: 17.8 },
  { state: 'Andhra', x: 79.0, y: 14.9 },
  { state: 'Karnataka', x: 75.5, y: 15.0 },
  { state: 'Tamil Nadu', x: 78.4, y: 10.7 },
  { state: 'Kerala', x: 74.9, y: 9.4 },
  { state: 'Goa', x: 72.9, y: 15.2 },
  { state: 'Puducherry', x: 81.8, y: 12.0 },
  { state: 'A&N Islands', x: 91.0, y: 10.0 },
  { state: 'Lakshadweep', x: 70.5, y: 10.5 },
  { state: 'DNHDD', x: 71.6, y: 19.8 },
  { state: 'Chandigarh', x: 81.0, y: 31.5 }
];

export const SMALL_LABEL_STATES = new Set([
  'Delhi', 'Punjab', 'HR', 'Uttarakhand',
  'Himachal', 'Assam', 'Meghalaya', 'Jharkhand'
]);

export const KERALA_LIKE_BLACK_STATES = new Set([
  'Kerala',
  'Sikkim',
  'Arunachal',
  'Mizoram',
  'Tripura',
  'Andaman & Nicobar Islands',
  'A&N Islands',
  'Dadra & Nagar Haveli and Daman & Diu',
  'DNHDD',
  'Goa',
  'Manipur',
  'Nagaland',
  'Lakshadweep',
  'Puducherry',
  'Chandigarh'
]);

export const VALUE_BOLD_STATES = new Set([
  'Maharashtra',
  'Rajasthan',
  'Gujarat',
  'Uttar Pradesh',
  'Karnataka',
  'Andhra Pradesh',
  'Andhra',
  'Tamil Nadu',
  'Madhya Pradesh',
  'Ladakh'
]);

export const PALETTES: { name: PaletteName; label: string; type: 'sequential' | 'diverging' }[] = [
  { name: 'Blues', label: 'Blues (Sequential)', type: 'sequential' },
  { name: 'Reds', label: 'Reds (Sequential)', type: 'sequential' },
  { name: 'Greens', label: 'Greens (Sequential)', type: 'sequential' },
  { name: 'Purples', label: 'Purples (Sequential)', type: 'sequential' },
  { name: 'OrRd', label: 'Orange-Red (Sequential)', type: 'sequential' },
  { name: 'RdBu', label: 'Red-Blue (Diverging)', type: 'diverging' },
  { name: 'PiYG', label: 'Pink-YellowGreen (Diverging)', type: 'diverging' },
  { name: 'magma', label: 'Magma (Sequential)', type: 'sequential' },
  { name: 'RdYlBu', label: 'Red-Yellow-Blue (Diverging)', type: 'diverging' },
  { name: 'bwr', label: 'Blue-White-Red (Diverging)', type: 'diverging' },
  { name: 'coolwarm', label: 'Coolwarm (Diverging)', type: 'diverging' },
  { name: 'winter', label: 'Winter (Sequential)', type: 'sequential' },
  { name: 'Viridis', label: 'Viridis (Sequential)', type: 'sequential' },
  { name: 'Plasma', label: 'Plasma (Sequential)', type: 'sequential' },
  { name: 'YlGnBu', label: 'Yellow-Green-Blue (Sequential)', type: 'sequential' },
  { name: 'Spectral', label: 'Spectral (Diverging)', type: 'diverging' }
];

export const SAMPLE_SIMPLE_DATA: StateDataRow[] = [
  { state: 'Rajasthan', value: 55 },
  { state: 'Kerala', value: 12 },
  { state: 'Maharashtra', value: 34 },
  { state: 'Uttar Pradesh', value: 67 },
  { state: 'Tamil Nadu', value: 22 },
  { state: 'Gujarat', value: 45 },
  { state: 'West Bengal', value: 30 }
];

export const FULL_INDIA_DATA: StateDataRow[] = [
  { state: 'J&K', value: 3.2 },
  { state: 'Ladakh', value: 1.5 },
  { state: 'Himachal', value: 2.8 },
  { state: 'Punjab', value: 4.6 },
  { state: 'HR', value: 5.1 },
  { state: 'Delhi', value: 2.3 },
  { state: 'Uttarakhand', value: 3.7 },
  { state: 'Rajasthan', value: 6.4 },
  { state: 'Uttar Pradesh', value: 5.9 },
  { state: 'Bihar', value: 4.8 },
  { state: 'Jharkhand', value: 4.2 },
  { state: 'WB', value: 3.9 },
  { state: 'Sikkim', value: 1.9 },
  { state: 'Assam', value: 6.1 },
  { state: 'Arunachal', value: 2.2 },
  { state: 'Nagaland', value: 1.8 },
  { state: 'Manipur', value: 2.5 },
  { state: 'Mizoram', value: 1.4 },
  { state: 'Tripura', value: 3.1 },
  { state: 'Meghalaya', value: 4.0 },
  { state: 'Odisha', value: 4.9 },
  { state: 'CG', value: 5.3 },
  { state: 'Madhya Pradesh', value: 5.6 },
  { state: 'Gujarat', value: 4.1 },
  { state: 'Maharashtra', value: 3.5 },
  { state: 'Telangana', value: 2.9 },
  { state: 'Andhra', value: 3.8 },
  { state: 'Karnataka', value: 3.2 },
  { state: 'Tamil Nadu', value: 2.6 },
  { state: 'Kerala', value: 1.1 },
  { state: 'Goa', value: 2.0 },
  { state: 'Puducherry', value: 1.7 },
  { state: 'A&N Islands', value: 0.9 },
  { state: 'Lakshadweep', value: 0.4 },
  { state: 'DNHDD', value: 2.1 },
  { state: 'Chandigarh', value: 1.3 }
];
