"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type DeviceId = "iphone-se" | "iphone-14" | "ipad" | "android-tall";

const DEVICE_CONFIG: Record<
  DeviceId,
  { width: number; height: number; label: string; ratio: string; resolution: string }
> = {
  "iphone-se": {
    width: 180,
    height: 320,
    label: "iPhone SE",
    ratio: "16:9",
    resolution: "750×1334",
  },
  "iphone-14": {
    width: 180,
    height: 390,
    label: "iPhone 14 Pro",
    ratio: "19.5:9",
    resolution: "1179×2556",
  },
  ipad: {
    width: 240,
    height: 320,
    label: "iPad",
    ratio: "4:3",
    resolution: "2048×2732",
  },
  "android-tall": {
    width: 160,
    height: 370,
    label: "Android флагманы",
    ratio: "21:9",
    resolution: "1080×2340",
  },
};

interface MatchSliderProps {
  showPreview?: boolean;
  devices?: string[];
  [key: string]: unknown;
}

function getSliderColor(match: number): string {
  if (match <= 0.5) {
    const t = match * 2; // 0..1
    return `rgb(255, ${Math.round(255 * t)}, 0)`; // red -> yellow
  }
  const t = (match - 0.5) * 2; // 0..1
  return `rgb(${Math.round(255 * (1 - t))}, 255, 0)`; // yellow -> green
}

function DeviceFrame({
  deviceId,
  match,
}: {
  deviceId: DeviceId;
  match: number;
}) {
  const { width: w, height: h, label, ratio, resolution } = DEVICE_CONFIG[deviceId];
  const squareSide = (1 - match) * w + match * h;

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        className="relative rounded-lg overflow-hidden bg-neutral-800 border border-neutral-600 shadow-lg"
        style={{ width: w, height: h }}
      >
        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center overflow-hidden">
          <motion.div
            className="rounded-md bg-amber-500/90 dark:bg-amber-600/90 flex items-center justify-center border border-amber-400/50 shrink-0"
            style={{
              width: squareSide,
              height: squareSide,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            layout
          >
            <span className="text-[10px] font-bold text-amber-950">2048</span>
          </motion.div>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{label}</p>
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{ratio}</p>
        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 tabular-nums">{resolution}</p>
      </div>
    </div>
  );
}

export default function MatchSlider({
  showPreview = true,
  devices = ["iphone-se", "iphone-14", "ipad", "android-tall"],
}: MatchSliderProps) {
  const [match, setMatch] = useState(0.5);
  const [tooltip, setTooltip] = useState(false);

  const deviceIds = (devices.length ? devices : ["iphone-se", "iphone-14", "ipad", "android-tall"])
    .slice(0, 4)
    .filter((d): d is DeviceId => d in DEVICE_CONFIG) as DeviceId[];
  if (deviceIds.length === 0) deviceIds.push("iphone-se", "iphone-14", "ipad");

  const sliderColor = getSliderColor(match);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="match-slider" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Match Width Or Height
          </label>
          <span
            className="tabular-nums text-sm font-bold min-w-[3rem]"
            style={{ color: sliderColor }}
          >
            {match.toFixed(1)}
          </span>
        </div>
        <div className="relative">
          <input
            id="match-slider"
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={match}
            onChange={(e) => setMatch(Number(e.target.value))}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            className="w-full h-3 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              accentColor: sliderColor,
              background: `linear-gradient(to right, rgb(239,68,68), rgb(234,179,8), rgb(34,197,94))`,
            }}
            title="0 = приоритет ширины (landscape), 0.5 = баланс, 1 = приоритет высоты (portrait)"
          />
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-neutral-800 dark:bg-neutral-700 text-neutral-200 text-xs shadow-xl max-w-[220px] text-center pointer-events-none z-10"
            >
              0 = ширина фиксирована, 1 = высота фиксирована. Для portrait-игр (2048) ставь 1.
            </motion.div>
          )}
        </div>
        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>0 = Width</span>
          <span>0.5 = Balance</span>
          <span>1 = Height</span>
        </div>
      </div>

      {showPreview && (
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">
            Превью на устройствах
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {deviceIds.map((id) => (
              <DeviceFrame key={id} deviceId={id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
