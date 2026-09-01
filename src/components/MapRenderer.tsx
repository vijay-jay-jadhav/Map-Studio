import React, { useEffect, useState, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { type FeatureCollection } from 'geojson';
import { MapSettings, StateDataRow } from '../types';
import {
  LABEL_POSITIONS,
  SMALL_LABEL_STATES,
  KERALA_LIKE_BLACK_STATES,
  VALUE_BOLD_STATES,
  PALETTES
} from '../constants/mapConfig';
import {
  getColorInterpolator,
  getLuminanceTextColor,
  getCanonicalStateName,
  wrapTextByWords
} from '../utils/mapUtils';
import { Download, Copy, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MapRendererProps {
  data: StateDataRow[];
  settings: MapSettings;
  isGenerating?: boolean;
}

export const MapRenderer: React.FC<MapRendererProps> = ({
  data,
  settings,
  isGenerating = false
}) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(true);
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Width & height matching Matplotlib's 8:10 aspect ratio
  const WIDTH = 800;
  const HEIGHT = 1000;
  const BG_COLOR = '#F2EFEB';

  // Load India States GeoJSON & Logo Data URL
  useEffect(() => {
    fetch('/geo/india_states.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load GeoJSON');
        return res.json();
      })
      .then((json: FeatureCollection) => {
        setGeoData(json);
        setLoadingGeo(false);
      })
      .catch((err) => {
        console.error('Error fetching GeoJSON:', err);
        setLoadingGeo(false);
      });

    // Preload logo as Data URL for canvas serialization reliability
    fetch('/map_assets/logo.png')
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setLogoDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.warn('Could not load logo as Data URL:', err);
      });
  }, []);

  // Compute Value Mapping & Min/Max
  const { dataMap, minVal, maxVal, numericValues } = useMemo(() => {
    const map = new Map<string, number | string>();
    const nums: number[] = [];

    data.forEach((row) => {
      const canonical = row.canonical_state || getCanonicalStateName(row.state);
      map.set(canonical, row.value);
      if (typeof row.value === 'number' && !isNaN(row.value)) {
        nums.push(row.value);
      }
    });

    const min = nums.length > 0 ? Math.min(...nums) : 0;
    const max = nums.length > 0 ? Math.max(...nums) : 100;

    return {
      dataMap: map,
      minVal: min,
      maxVal: max === min ? min + 1 : max,
      numericValues: nums
    };
  }, [data]);

  // Color Scale
  const colorInterpolator = useMemo(() => {
    return getColorInterpolator(settings.palette);
  }, [settings.palette]);

  const getColorForValue = (val: number | string | undefined): string => {
    if (val === undefined || val === null || val === 'NA' || typeof val !== 'number' || isNaN(val)) {
      return '#eeeeee';
    }
    const t = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal)));
    return colorInterpolator(t);
  };

  // D3 Projection and Path Generator
  const { projection, pathGenerator } = useMemo(() => {
    if (!geoData) return { projection: null, pathGenerator: null };

    const proj = d3.geoMercator();
    // Fit bounds precisely into our 800x1000 viewport with top margin for title & legend
    proj.fitExtent(
      [
        [WIDTH * 0.03, HEIGHT * 0.12],
        [WIDTH * 0.97, HEIGHT * 0.95]
      ],
      geoData
    );

    const path = d3.geoPath().projection(proj);
    return { projection: proj, pathGenerator: path };
  }, [geoData]);

  // UP Neighbor color for Delhi
  const upColor = useMemo(() => {
    const upVal = dataMap.get('Uttar Pradesh');
    return getColorForValue(upVal);
  }, [dataMap, minVal, maxVal, colorInterpolator]);

  // Wrapped title lines
  const titleLines = useMemo(() => {
    return wrapTextByWords(settings.titleText || '', 5);
  }, [settings.titleText]);

  // Wrapped annotation lines
  const annotationLines = useMemo(() => {
    return wrapTextByWords(settings.annotationText || '', 5);
  }, [settings.annotationText]);

  // Export to High-Res PNG
  const handleDownloadPng = async () => {
    if (!svgRef.current) return;
    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL_API = window.URL || window.webkitURL || window;
      const blobURL = URL_API.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        // High resolution 3x multiplier
        const scale = 3;
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH * scale;
        canvas.height = HEIGHT * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        URL_API.revokeObjectURL(blobURL);

        const a = document.createElement('a');
        a.download = `india_choropleth_${Date.now()}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      image.src = blobURL;
    } catch (e) {
      console.error('Failed to export PNG', e);
    }
  };

  // Export to SVG
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgString = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const a = document.createElement('a');
    a.download = `india_choropleth_${Date.now()}.svg`;
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!svgRef.current) return;
    try {
      const svgString = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH * 2;
        canvas.height = HEIGHT * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobURL);

        canvas.toBlob(async (blob) => {
          if (blob && navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          }
        });
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
    }
  };

  // Generate colorbar gradient stops
  const gradientStops = useMemo(() => {
    const stops: { offset: string; color: string }[] = [];
    const count = 10;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      stops.push({
        offset: `${t * 100}%`,
        color: colorInterpolator(t)
      });
    }
    return stops;
  }, [colorInterpolator]);

  return (
    <div id="map-preview-card" className="flex flex-col bg-white rounded-xl shadow-sm border border-[#e5e1da] overflow-hidden">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-[#e5e1da] bg-[#faf9f7] gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#333333]">2. Preview & Export</span>
          {isGenerating && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 animate-pulse">
              Rendering…
            </span>
          )}
          <span className="text-xs text-neutral-500 hidden sm:inline">
            (Ratio 4:5 · Editorial Quality)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-white border border-[#dedad3] rounded-lg p-0.5 text-neutral-700 shadow-2xs">
            <button
              id="zoom-out-btn"
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
              className="p-1 hover:bg-[#f2efeb] rounded transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-medium text-neutral-600">{Math.round(zoomLevel * 100)}%</span>
            <button
              id="zoom-in-btn"
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
              className="p-1 hover:bg-[#f2efeb] rounded transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="zoom-reset-btn"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-[#f2efeb] rounded transition-colors border-l border-neutral-200 ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            id="copy-map-btn"
            onClick={handleCopyImage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-[#dedad3] rounded-lg shadow-2xs transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            id="download-png-btn"
            onClick={handleDownloadPng}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#c0245d] hover:bg-[#a61c4e] rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download High-Res PNG</span>
          </button>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="p-4 sm:p-6 bg-[#eae7e1] flex justify-center items-center overflow-auto min-h-[580px]">
        {loadingGeo ? (
          <div className="flex flex-col items-center justify-center p-12 text-neutral-500">
            <div className="w-10 h-10 border-3 border-[#c0245d] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium">Loading Map Geometry…</p>
          </div>
        ) : !geoData || !pathGenerator || !projection ? (
          <div className="p-12 text-center text-red-600 font-medium">
            Could not load India boundaries map.
          </div>
        ) : (
          <div
            className="transition-transform duration-150 origin-top shadow-xl rounded-sm"
            style={{
              width: `${WIDTH * zoomLevel}px`,
              maxWidth: '100%'
            }}
          >
            <svg
              id="india-map-svg"
              ref={svgRef}
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              width="100%"
              height="auto"
              style={{
                backgroundColor: BG_COLOR,
                display: 'block',
                fontFamily: `'${settings.fontFamily || 'Plus Jakarta Sans'}', 'Public Sans', 'Roboto', 'DejaVu Sans', 'Arial', sans-serif`
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Background Rect */}
                <rect id="bg" width={WIDTH} height={HEIGHT} fill={BG_COLOR} />

                {/* Colorbar Linear Gradient */}
                <linearGradient id="legend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  {gradientStops.map((stop, i) => (
                    <stop key={i} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </linearGradient>

                {/* Drop shadow for identity line */}
                <filter id="subtle-shadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Background */}
              <rect width={WIDTH} height={HEIGHT} fill={BG_COLOR} />

              {/* 1. Identity Line (top center crimson accent bar) */}
              <rect
                x={(WIDTH - 150) / 2}
                y={12}
                width={150}
                height={8}
                fill="#c0245d"
                rx={2}
              />

              {/* 2. Map Title */}
              {titleLines.length > 0 && (
                <g id="map-title-group" transform={`translate(${WIDTH * 0.5}, 46)`}>
                  {titleLines.map((line, idx) => {
                    const fontSize = settings.titleFontSize || 32;
                    return (
                      <text
                        key={idx}
                        x={0}
                        y={idx * (fontSize + 6)}
                        textAnchor="middle"
                        dominantBaseline="hanging"
                        fill="#1a1a1a"
                        fontSize={fontSize}
                        fontWeight="bold"
                        style={{
                          letterSpacing: '-0.015em',
                          fontFamily: `'${settings.titleFontFamily || settings.fontFamily || 'Plus Jakarta Sans'}', sans-serif`
                        }}
                      >
                        {line}
                      </text>
                    );
                  })}
                </g>
              )}

              {/* 3. Colorbar Legend (Horizontal at x: 59%, dynamic Y below title) */}
              <g
                id="map-legend-group"
                transform={`translate(${WIDTH * 0.59}, ${Math.max(165, 72 + titleLines.length * ((settings.titleFontSize || 32) + 6) + 20)})`}
              >
                {/* Legend Label */}
                <text
                  x={135}
                  y={-11}
                  textAnchor="middle"
                  fontSize="13.5"
                  fontWeight="bold"
                  fill="#222222"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {settings.creditsText || 'DataVizPulse / Vijay'}
                </text>

                {/* Color Bar */}
                <rect
                  x={0}
                  y={0}
                  width={270}
                  height={18}
                  fill="url(#legend-gradient)"
                  stroke="#444444"
                  strokeWidth="0.85"
                />

                {/* Min / Max Ticks & Labels */}
                <text
                  x={0}
                  y={34}
                  textAnchor="start"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#222222"
                  style={{ fontFeatureSettings: '"tnum"', letterSpacing: '-0.02em' }}
                >
                  {settings.valuePrefix}
                  {numericValues.length > 0 ? minVal : 0}
                  {settings.valueSuffix}
                </text>

                {numericValues.length > 0 && maxVal !== minVal && (
                  <text
                    x={135}
                    y={34}
                    textAnchor="middle"
                    fontSize="12.5"
                    fontWeight="600"
                    fill="#444444"
                    style={{ fontFeatureSettings: '"tnum"', letterSpacing: '-0.02em' }}
                  >
                    {settings.valuePrefix}
                    {Number(((minVal + maxVal) / 2).toFixed(1))}
                    {settings.valueSuffix}
                  </text>
                )}

                <text
                  x={270}
                  y={34}
                  textAnchor="end"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#222222"
                  style={{ fontFeatureSettings: '"tnum"', letterSpacing: '-0.02em' }}
                >
                  {settings.valuePrefix}
                  {numericValues.length > 0 ? maxVal : 100}
                  {settings.valueSuffix}
                </text>
              </g>

              {/* 4. India States GeoJSON Polygons */}
              <g id="map-states-group">
                {geoData.features.map((feature, index) => {
                  const stateName = (feature.properties?.name || feature.properties?.st_nm || '') as string;
                  const canonical = getCanonicalStateName(stateName);
                  const val = dataMap.get(canonical);
                  const fillColor = getColorForValue(val);
                  const d = pathGenerator(feature);

                  if (!d) return null;

                  return (
                    <path
                      key={feature.id || index}
                      d={d}
                      fill={fillColor}
                      stroke="#000000"
                      strokeWidth="0.8"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    >
                      <title>{`${stateName}: ${val !== undefined ? `${settings.valuePrefix}${val}${settings.valueSuffix}` : 'NA'}`}</title>
                    </path>
                  );
                })}
              </g>

              {/* 5. State Labels & Data Values */}
              <g id="map-labels-group">
                {LABEL_POSITIONS.map((pos) => {
                  const [px, py] = projection([pos.x, pos.y]) || [0, 0];
                  if (!px || !py) return null;

                  const rawState = pos.state;
                  const canonical = getCanonicalStateName(rawState);
                  const rawVal = dataMap.get(canonical);
                  const hasVal = rawVal !== undefined && rawVal !== null && rawVal !== 'NA';
                  const displayValue = hasVal ? `${settings.valuePrefix}${rawVal}${settings.valueSuffix}` : 'NA';

                  const stateFillColor = getColorForValue(rawVal);

                  // Determine Text Color
                  let textColor = 'black';
                  if (KERALA_LIKE_BLACK_STATES.has(rawState)) {
                    textColor = 'black';
                  } else if (rawState === 'Delhi') {
                    textColor = getLuminanceTextColor(upColor);
                  } else {
                    textColor = getLuminanceTextColor(stateFillColor);
                  }

                  const valueColor =
                    KERALA_LIKE_BLACK_STATES.has(rawState) || rawState === 'Meghalaya'
                      ? 'black'
                      : textColor;

                  const isSmall = SMALL_LABEL_STATES.has(rawState);
                  const isBold = VALUE_BOLD_STATES.has(rawState);
                  const isMeghalaya = rawState === 'Meghalaya';

                  const nameFontSize = isSmall ? 8.2 : 10.0;
                  const valueFontSize = isSmall ? 10.8 : 13.5;
                  const valueWeight = isBold ? 'bold' : '700';

                  const nameY = isMeghalaya ? -8.5 : (isSmall ? -6.2 : -7.5);
                  const valueY = isMeghalaya ? 9.5 : (isSmall ? 7.2 : 8.8);

                  if (rawState === 'Assam') {
                    return (
                      <text
                        key={rawState}
                        x={px}
                        y={py}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={textColor}
                        fontSize={valueFontSize}
                        fontWeight={valueWeight}
                        style={{
                          letterSpacing: '-0.035em',
                          fontFeatureSettings: '"tnum"'
                        }}
                      >
                        {`${rawState} ${displayValue}`}
                      </text>
                    );
                  }

                  return (
                    <g key={rawState} transform={`translate(${px}, ${py})`}>
                      {/* State Name */}
                      <text
                        x={0}
                        y={nameY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={textColor}
                        fontSize={nameFontSize}
                        fontWeight="600"
                        style={{ letterSpacing: '-0.02em' }}
                      >
                        {rawState}
                      </text>

                      {/* State Value */}
                      <text
                        x={0}
                        y={valueY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={valueColor}
                        fontSize={valueFontSize}
                        fontWeight={valueWeight}
                        style={{
                          letterSpacing: '-0.04em',
                          fontFeatureSettings: '"tnum"'
                        }}
                      >
                        {displayValue}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* 6. Annotation Box (East side, centered around x: 78.5%, y: 63.5%) */}
              {annotationLines.length > 0 && (
                <g id="map-annotation-group" transform={`translate(${WIDTH * 0.785}, ${HEIGHT * 0.635})`}>
                  {annotationLines.map((line, idx) => (
                    <text
                      key={idx}
                      x={0}
                      y={(idx - (annotationLines.length - 1) / 2) * 16}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#111111"
                      fontSize="11.5"
                      fontWeight="bold"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              )}

              {/* 7. Source Text (Bottom Left) */}
              {settings.sourceText && (
                <text
                  x={WIDTH * 0.05}
                  y={HEIGHT * 0.965}
                  textAnchor="start"
                  dominantBaseline="auto"
                  fill="#222222"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {settings.sourceText}
                </text>
              )}

              {/* 8. Logo / Editorial Brand (Bottom Right Corner) */}
              <g id="map-logo-group" transform={`translate(${WIDTH * 0.978}, ${HEIGHT * 0.985})`}>
                <image
                  href={logoDataUrl || "/map_assets/logo.png"}
                  x={-200}
                  y={-70}
                  width="200"
                  height="70"
                  preserveAspectRatio="xMaxYMax meet"
                  onError={(e) => {
                    // Fallback to text badge if image asset isn't loaded
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Palette indicator summary */}
      <div className="px-5 py-2.5 bg-white border-t border-[#dedad3] flex items-center justify-between text-xs text-neutral-500">
        <div>
          Palette:{' '}
          <span className="font-semibold text-neutral-800">
            {PALETTES.find((p) => p.name === settings.palette)?.label || settings.palette}
          </span>
        </div>
        <div>
          Active States with Data:{' '}
          <span className="font-semibold text-neutral-800">{numericValues.length} / 36</span>
        </div>
      </div>
    </div>
  );
};
