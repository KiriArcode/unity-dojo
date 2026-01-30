"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type AnchorPresetId =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right"
  | "stretch-h"
  | "stretch-v"
  | "stretch-all";

interface AnchorPreset {
  id: AnchorPresetId;
  label: string;
  anchorMin: [number, number];
  anchorMax: [number, number];
  /** Grid position for 4x3: row 0..2, col 0..3 */
  gridRow: number;
  gridCol: number;
}

const PRESETS: AnchorPreset[] = [
  { id: "top-left", label: "Top Left", anchorMin: [0, 1], anchorMax: [0, 1], gridRow: 0, gridCol: 0 },
  { id: "top", label: "Top", anchorMin: [0.5, 1], anchorMax: [0.5, 1], gridRow: 0, gridCol: 1 },
  { id: "top-right", label: "Top Right", anchorMin: [1, 1], anchorMax: [1, 1], gridRow: 0, gridCol: 2 },
  { id: "left", label: "Left", anchorMin: [0, 0.5], anchorMax: [0, 0.5], gridRow: 1, gridCol: 0 },
  { id: "center", label: "Center", anchorMin: [0.5, 0.5], anchorMax: [0.5, 0.5], gridRow: 1, gridCol: 1 },
  { id: "right", label: "Right", anchorMin: [1, 0.5], anchorMax: [1, 0.5], gridRow: 1, gridCol: 2 },
  { id: "bottom-left", label: "Bottom Left", anchorMin: [0, 0], anchorMax: [0, 0], gridRow: 2, gridCol: 0 },
  { id: "bottom", label: "Bottom", anchorMin: [0.5, 0], anchorMax: [0.5, 0], gridRow: 2, gridCol: 1 },
  { id: "bottom-right", label: "Bottom Right", anchorMin: [1, 0], anchorMax: [1, 0], gridRow: 2, gridCol: 2 },
  { id: "stretch-h", label: "Stretch H", anchorMin: [0, 0.5], anchorMax: [1, 0.5], gridRow: 3, gridCol: 0 },
  { id: "stretch-v", label: "Stretch V", anchorMin: [0.5, 0], anchorMax: [0.5, 1], gridRow: 3, gridCol: 1 },
  { id: "stretch-all", label: "Stretch All", anchorMin: [0, 0], anchorMax: [1, 1], gridRow: 3, gridCol: 2 },
];

/** Compute rect (left, top, width, height) in 0..1 for preview. Unity: origin bottom-left; CSS top-left. */
function getPreviewRect(preset: AnchorPreset): { left: number; top: number; width: number; height: number } {
  const [minX, minY] = preset.anchorMin;
  const [maxX, maxY] = preset.anchorMax;
  const isPoint = minX === maxX && minY === maxY;
  const size = 0.22; // fixed size for point anchors
  const margin = 0.04; // inset for stretch

  if (isPoint) {
    const left = minX - size / 2;
    const bottom = minY - size / 2;
    const top = 1 - bottom - size;
    return { left, top, width: size, height: size };
  }
  const stretchW = maxX - minX - margin * 2;
  const stretchH = maxY - minY - margin * 2;
  const width = Math.max(stretchW, size * 0.5);
  const height = Math.max(stretchH, size * 0.5);
  const left = minX + margin;
  const top = 1 - maxY - margin;
  return { left, top, width, height };
}

function PresetIcon({ presetId }: { presetId: AnchorPresetId }) {
  const isStretchH = presetId === "stretch-h";
  const isStretchV = presetId === "stretch-v";
  const isStretchAll = presetId === "stretch-all";
  const isCorner = ["top-left", "top-right", "bottom-left", "bottom-right"].includes(presetId);
  const isEdge = ["top", "bottom", "left", "right"].includes(presetId);
  const isCenter = presetId === "center";

  if (isStretchAll) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="1" />
      </svg>
    );
  }
  if (isStretchH) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12h20" />
        <circle cx="4" cy="12" r="1.5" fill="currentColor" />
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (isStretchV) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20" />
        <circle cx="12" cy="4" r="1.5" fill="currentColor" />
        <circle cx="12" cy="20" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (isCenter) {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (isCorner || isEdge) {
    const arrows: Record<string, string> = {
      "top-left": "M12 4L4 12M4 4h8v8",
      top: "M12 4v8M12 4l-4 4M12 4l4 4",
      "top-right": "M12 4l8 8M20 4h-8v8",
      left: "M4 12h8M4 12l4-4M4 12l4 4",
      right: "M20 12H12M20 12l-4-4M20 12l-4 4",
      "bottom-left": "M12 20L4 12M4 20h8v-8",
      bottom: "M12 20v-8M12 20l-4-4M12 20l4-4",
      "bottom-right": "M12 20l8-8M20 20h-8v-8",
    };
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d={arrows[presetId] ?? "M12 12"} />
      </svg>
    );
  }
  return null;
}

interface AnchorsVisualizerProps {
  interactive?: boolean;
  showAllPresets?: boolean;
  [key: string]: unknown;
}

const SCREEN_ASPECTS = [
  { w: 1, h: 1 },
  { w: 0.85, h: 1.15 },
  { w: 1.2, h: 0.9 },
  { w: 0.9, h: 0.9 },
];

export default function AnchorsVisualizer({
  interactive = true,
  showAllPresets = true,
}: AnchorsVisualizerProps) {
  const [selectedId, setSelectedId] = useState<AnchorPresetId>("center");
  const [screenIndex, setScreenIndex] = useState(0);

  const presetsToShow = showAllPresets ? PRESETS : PRESETS.slice(0, 9);
  const selectedPreset = PRESETS.find((p) => p.id === selectedId) ?? PRESETS[8];
  const previewRect = useMemo(() => getPreviewRect(selectedPreset), [selectedPreset]);

  const aspect = SCREEN_ASPECTS[screenIndex % SCREEN_ASPECTS.length];
  const previewWidth = 280;
  const previewHeight = previewWidth * (aspect.h / aspect.w);

  const cycleScreenSize = () => {
    setScreenIndex((i) => i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6 items-start">
        {/* 4x3 grid of preset buttons */}
        <div
          className="grid gap-1.5 flex-shrink-0"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(4, 1fr)", width: 132 }}
        >
          {presetsToShow.map((preset) => {
            const isSelected = selectedId === preset.id;
            return (
              <motion.button
                key={preset.id}
                type="button"
                onClick={() => interactive && setSelectedId(preset.id)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded border-2 transition-colors
                  ${isSelected ? "border-violet-500 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300" : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500"}
                `}
                style={{
                  gridRow: preset.gridRow + 1,
                  gridColumn: preset.gridCol + 1,
                }}
                whileHover={interactive ? { scale: 1.05 } : undefined}
                whileTap={interactive ? { scale: 0.98 } : undefined}
                aria-pressed={isSelected}
                aria-label={preset.label}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <PresetIcon presetId={preset.id} />
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Preview: device screen with purple element */}
        <motion.div
          className="flex-shrink-0 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 overflow-hidden shadow-lg"
          style={{ width: previewWidth, height: previewHeight }}
          animate={{ width: previewWidth, height: previewHeight }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="relative w-full h-full bg-neutral-200 dark:bg-neutral-700">
            {/* Dashed anchor lines (from anchor point to element edges) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <defs>
                <pattern id="dash" patternUnits="userSpaceOnUse" width="6" height="4">
                  <path d="M0 2h4" stroke="currentColor" strokeWidth="1" fill="none" className="text-neutral-500" />
                </pattern>
              </defs>
              <AnimatePresence mode="wait">
                {selectedPreset.anchorMin[0] === selectedPreset.anchorMax[0] &&
                selectedPreset.anchorMin[1] === selectedPreset.anchorMax[1] ? (
                  <motion.g
                    key="point"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    stroke="rgba(139,92,246,0.6)"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                    fill="none"
                  >
                    <line
                      x1={`${selectedPreset.anchorMin[0] * 100}%`}
                      y1={`${(1 - selectedPreset.anchorMin[1]) * 100}%`}
                      x2={`${(previewRect.left + previewRect.width / 2) * 100}%`}
                      y2={`${(previewRect.top + previewRect.height / 2) * 100}%`}
                    />
                  </motion.g>
                ) : (
                  <motion.g
                    key="stretch"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    stroke="rgba(139,92,246,0.5)"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                    fill="none"
                  >
                    <rect
                      x={`${previewRect.left * 100}%`}
                      y={`${previewRect.top * 100}%`}
                      width={`${previewRect.width * 100}%`}
                      height={`${previewRect.height * 100}%`}
                    />
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
            {/* Purple UI element */}
            <motion.div
              className="absolute rounded-md bg-violet-500 dark:bg-violet-600 border-2 border-violet-400 dark:border-violet-500 shadow-lg flex items-center justify-center"
              initial={false}
              animate={{
                left: `${previewRect.left * 100}%`,
                top: `${previewRect.top * 100}%`,
                width: `${previewRect.width * 100}%`,
                height: `${previewRect.height * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <span className="text-[10px] font-bold text-white drop-shadow">UI</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Info: preset name, Anchor Min/Max, Inspector code */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Preset</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{selectedPreset.label}</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Anchor Min</p>
              <p className="text-xs font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                ({selectedPreset.anchorMin[0]}, {selectedPreset.anchorMin[1]})
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Anchor Max</p>
              <p className="text-xs font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                ({selectedPreset.anchorMax[0]}, {selectedPreset.anchorMax[1]})
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Inspector</p>
          <pre className="text-xs font-mono bg-neutral-800 dark:bg-neutral-900 text-neutral-100 p-3 rounded overflow-x-auto">
{`Anchor Min  X: ${selectedPreset.anchorMin[0]}  Y: ${selectedPreset.anchorMin[1]}
Anchor Max  X: ${selectedPreset.anchorMax[0]}  Y: ${selectedPreset.anchorMax[1]}`}
          </pre>
        </div>
      </div>

      {/* Screen resize simulation */}
      {interactive && (
        <div>
          <motion.button
            type="button"
            onClick={cycleScreenSize}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium shadow transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Изменить размер экрана
          </motion.button>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            Меняет пропорции превью — видно, как элемент ведёт себя относительно anchor.
          </p>
        </div>
      )}
    </div>
  );
}
