"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

type DeviceId = "iphone-se" | "iphone-14" | "ipad" | "android-tall";

const DEVICE_CONFIG: Record<DeviceId, { width: number; height: number; label: string }> = {
  "iphone-se": { width: 180, height: 320, label: "iPhone SE" },
  "iphone-14": { width: 180, height: 390, label: "iPhone 14 Pro" },
  ipad: { width: 240, height: 320, label: "iPad" },
  "android-tall": { width: 160, height: 370, label: "Android" },
};

type ScaleMode = "constantPixel" | "scaleWithScreen" | "constantPhysical";

const MODES: Array<{
  id: ScaleMode;
  label: string;
  badge: string;
  badgeVariant: "danger" | "success" | "warning";
  description: string;
  showCheck?: boolean;
}> = [
  {
    id: "constantPixel",
    label: "Constant Pixel Size",
    badge: "Не рекомендуется",
    badgeVariant: "danger",
    description: "UI одного размера в пикселях на всех экранах. На маленьком устройстве элементы выглядят огромными, на большом — мелкими.",
  },
  {
    id: "scaleWithScreen",
    label: "Scale With Screen Size",
    badge: "Рекомендуется",
    badgeVariant: "success",
    description: "UI масштабируется пропорционально экрану. Одинаково удобно на любом устройстве.",
    showCheck: true,
  },
  {
    id: "constantPhysical",
    label: "Constant Physical Size",
    badge: "Редко для игр",
    badgeVariant: "warning",
    description: "Размер в физических единицах (см/дюймы). Чаще для приложений, не для игр.",
  },
];

interface CanvasScalerModesProps {
  showDevices?: boolean;
  interactive?: boolean;
  [key: string]: unknown;
}

function getUIScale(
  mode: ScaleMode,
  deviceWidth: number,
  deviceHeight: number
): number {
  const refW = 160;
  const refH = 320;
  switch (mode) {
    case "constantPixel":
      return 1;
    case "scaleWithScreen":
      return Math.min(deviceWidth / refW, deviceHeight / refH);
    case "constantPhysical":
      return Math.sqrt((deviceWidth * deviceHeight) / (refW * refH));
    default:
      return 1;
  }
}

function DeviceFrame({
  deviceId,
  mode,
}: {
  deviceId: DeviceId;
  mode: ScaleMode;
}) {
  const { width: w, height: h, label } = DEVICE_CONFIG[deviceId];
  const scale = getUIScale(mode, w, h);
  const baseBtnW = 40;
  const baseBtnH = 14;
  const baseFont = 11;
  const baseInputH = 14;
  const btnW = Math.max(20, Math.round(baseBtnW * scale));
  const btnH = Math.max(8, Math.round(baseBtnH * scale));
  const fontSize = Math.max(6, Math.round(baseFont * scale));
  const inputH = Math.max(8, Math.round(baseInputH * scale));

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        className="relative rounded-lg overflow-hidden bg-neutral-800 border border-neutral-600 shadow-lg"
        style={{ width: w, height: h }}
      >
        <div className="absolute inset-0 bg-neutral-900 p-2 flex flex-col gap-1 overflow-hidden">
          <div
            className="font-medium text-neutral-300 truncate"
            style={{ fontSize: `${fontSize}px` }}
          >
            Score: 0
          </div>
          <div
            className="rounded flex-1 min-h-0 border border-neutral-600 flex items-center justify-center text-neutral-400"
            style={{ fontSize: `${Math.max(6, fontSize - 1)}px` }}
          >
            UI
          </div>
          <div
            className="rounded bg-neutral-600 flex items-center justify-center text-neutral-200 font-medium shrink-0"
            style={{
              width: btnW,
              height: btnH,
              fontSize: `${Math.max(6, fontSize - 1)}px`,
            }}
          >
            OK
          </div>
          <div
            className="rounded border border-neutral-500 bg-neutral-800 shrink-0"
            style={{ height: inputH }}
          />
        </div>
      </div>
      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{label}</span>
    </div>
  );
}

function InspectorSnippet({ mode }: { mode: ScaleMode }) {
  const value =
    mode === "constantPixel"
      ? "ConstantPixelSize"
      : mode === "scaleWithScreen"
        ? "ScaleWithScreenSize"
        : "ConstantPhysicalSize";

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/80 overflow-hidden text-left">
      <div className="px-2 py-1.5 bg-neutral-200 dark:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        Canvas Scaler (Script)
      </div>
      <div className="p-2 font-mono text-[10px] space-y-1 text-neutral-600 dark:text-neutral-400">
        <div>Reference Resolution: 1080 x 1920</div>
        <div className="flex items-center gap-1">
          <span>UI Scale Mode:</span>
          <motion.span
            key={value}
            initial={{ backgroundColor: "rgba(59, 130, 246, 0.3)" }}
            animate={{ backgroundColor: "transparent" }}
            transition={{ duration: 1.5 }}
            className="px-1 rounded bg-blue-500/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 font-medium"
          >
            {value}
          </motion.span>
        </div>
        <div>Match: 1</div>
      </div>
    </div>
  );
}

export default function CanvasScalerModes({
  showDevices = true,
  interactive = true,
}: CanvasScalerModesProps) {
  const [mode, setMode] = useState<ScaleMode>("scaleWithScreen");
  const deviceIds: DeviceId[] = ["iphone-se", "iphone-14", "ipad", "android-tall"];
  const currentModeInfo = MODES.find((m) => m.id === mode)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => {
          const isSelected = mode === m.id;
          const isSuccess = m.badgeVariant === "success";
          const isDanger = m.badgeVariant === "danger";
          const isWarning = m.badgeVariant === "warning";
          return (
            <motion.button
              key={m.id}
              type="button"
              onClick={() => interactive && setMode(m.id)}
              disabled={!interactive}
              animate={{ scale: isSelected ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
              className={`relative flex flex-col items-start gap-0.5 rounded-lg border-2 px-3 py-2 text-left transition-colors ${
                isSelected && isSuccess
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                  : isSelected && isDanger
                    ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                    : isSelected && isWarning
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
                      : "border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-500"
              } ${!interactive ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {m.label}
                </span>
                {m.showCheck && (
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isDanger
                    ? "text-red-600 dark:text-red-400"
                    : isWarning
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {m.badge}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4"
        >
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {currentModeInfo.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {showDevices && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Превью на устройствах
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {deviceIds.map((id) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <DeviceFrame deviceId={id} mode={mode} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <InspectorSnippet mode={mode} />
    </div>
  );
}
