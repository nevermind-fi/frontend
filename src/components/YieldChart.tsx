"use client";

import { useState } from "react";

const data = [
  { day: "Jan 20", apy: 3.2, tvl: 8200 },
  { day: "Jan 21", apy: 3.5, tvl: 8400 },
  { day: "Jan 22", apy: 4.1, tvl: 8900 },
  { day: "Jan 23", apy: 3.8, tvl: 9100 },
  { day: "Jan 24", apy: 4.6, tvl: 9400 },
  { day: "Jan 25", apy: 4.2, tvl: 9600 },
  { day: "Jan 26", apy: 5.1, tvl: 10200 },
  { day: "Jan 27", apy: 4.8, tvl: 10500 },
  { day: "Jan 28", apy: 5.3, tvl: 10800 },
  { day: "Jan 29", apy: 4.9, tvl: 11000 },
  { day: "Jan 30", apy: 5.5, tvl: 11400 },
  { day: "Jan 31", apy: 5.2, tvl: 11600 },
  { day: "Feb 1", apy: 5.8, tvl: 12000 },
  { day: "Feb 2", apy: 5.4, tvl: 12200 },
  { day: "Feb 3", apy: 5.9, tvl: 12800 },
  { day: "Feb 4", apy: 5.6, tvl: 13000 },
  { day: "Feb 5", apy: 6.1, tvl: 13400 },
  { day: "Feb 6", apy: 5.7, tvl: 13200 },
  { day: "Feb 7", apy: 6.3, tvl: 13800 },
];

const W = 720;
const H = 200;
const PAD_X = 0;
const PAD_Y = 10;

function getPoints(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (W - PAD_X * 2) / (values.length - 1);

  return values.map((v, i) => ({
    x: PAD_X + i * stepX,
    y: PAD_Y + (1 - (v - min) / range) * (H - PAD_Y * 2),
  }));
}

function buildPath(values: number[], fillBottom = false) {
  const points = getPoints(values);

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cx = (points[i - 1].x + points[i].x) / 2;
    d += ` C${cx},${points[i - 1].y} ${cx},${points[i].y} ${points[i].x},${points[i].y}`;
  }

  if (fillBottom) {
    d += ` L${points[points.length - 1].x},${H} L${points[0].x},${H} Z`;
  }

  return d;
}

export function YieldChart() {
  const [metric, setMetric] = useState<"apy" | "tvl">("apy");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const values = data.map((d) => (metric === "apy" ? d.apy : d.tvl));
  const linePath = buildPath(values);
  const areaPath = buildPath(values, true);
  const points = getPoints(values);

  const displayIdx = hoveredIdx !== null ? hoveredIdx : values.length - 1;
  const displayValue = values[displayIdx];
  const prevValue = displayIdx > 0 ? values[displayIdx - 1] : values[0];
  const change = displayValue - prevValue;
  const changeStr = metric === "apy"
    ? `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`
    : `${change >= 0 ? "+" : ""}$${Math.abs(change).toLocaleString()}`;

  const stepX = (W - PAD_X * 2) / (values.length - 1);

  return (
    <div className="rounded-2xl border border-neutral-800/50 bg-neutral-900/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Yield Performance</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>
              {metric === "apy" ? `${displayValue}%` : `$${displayValue.toLocaleString()}`}
            </span>
            <span className={`text-xs font-medium ${change >= 0 ? "text-emerald-400" : "text-red-400"}`} style={{ fontFamily: "var(--font-mono)" }}>
              {changeStr}
            </span>
            {hoveredIdx !== null && (
              <span className="text-xs text-neutral-500" style={{ fontFamily: "var(--font-mono)" }}>
                {data[hoveredIdx].day}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setMetric("apy")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              metric === "apy"
                ? "bg-emerald-600 text-white"
                : "border border-neutral-700 text-neutral-400 hover:text-neutral-300"
            }`}
          >
            APY
          </button>
          <button
            onClick={() => setMetric("tvl")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              metric === "tvl"
                ? "bg-emerald-600 text-white"
                : "border border-neutral-700 text-neutral-400 hover:text-neutral-300"
            }`}
          >
            TVL
          </button>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-48"
        preserveAspectRatio="none"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#009669" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#009669" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#009669" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={0}
            y1={PAD_Y + pct * (H - PAD_Y * 2)}
            x2={W}
            y2={PAD_Y + pct * (H - PAD_Y * 2)}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#chart-fill)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#chart-line)" strokeWidth="2" />

        {/* Hover crosshair + dot */}
        {hoveredIdx !== null && (
          <>
            <line
              x1={points[hoveredIdx].x}
              y1={0}
              x2={points[hoveredIdx].x}
              y2={H}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <circle
              cx={points[hoveredIdx].x}
              cy={points[hoveredIdx].y}
              r="5"
              fill="#34d399"
            />
            <circle
              cx={points[hoveredIdx].x}
              cy={points[hoveredIdx].y}
              r="10"
              fill="#34d399"
              opacity="0.2"
            />
          </>
        )}

        {/* End dot (when not hovering) */}
        {hoveredIdx === null && (
          <>
            <circle
              cx={W - PAD_X}
              cy={points[points.length - 1].y}
              r="4"
              fill="#34d399"
            />
            <circle
              cx={W - PAD_X}
              cy={points[points.length - 1].y}
              r="8"
              fill="#34d399"
              opacity="0.2"
            />
          </>
        )}

        {/* Invisible hover hit areas */}
        {data.map((_, i) => (
          <rect
            key={i}
            x={points[i].x - stepX / 2}
            y={0}
            width={stepX}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHoveredIdx(i)}
          />
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {[0, Math.floor(data.length / 3), Math.floor((data.length * 2) / 3), data.length - 1].map((idx) => (
          <span key={idx} className="text-[10px] text-neutral-600" style={{ fontFamily: "var(--font-mono)" }}>
            {data[idx].day}
          </span>
        ))}
      </div>
    </div>
  );
}
