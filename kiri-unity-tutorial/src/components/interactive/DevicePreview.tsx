"use client";

import { motion } from "framer-motion";

export type DeviceId = "iphone-se" | "iphone-14" | "ipad" | "android-tall";

const deviceConfig: Record<
  DeviceId,
  { width: number; height: number; ratio: string; notch: boolean; label: string; features: string }
> = {
  "iphone-se": {
    width: 180,
    height: 320,
    ratio: "16:9",
    notch: false,
    label: "iPhone SE",
    features: "Старый стандарт, компактный",
  },
  "iphone-14": {
    width: 180,
    height: 390,
    ratio: "19.5:9",
    notch: true,
    label: "iPhone 14 Pro",
    features: "Вытянутый + notch (чёлка)",
  },
  ipad: {
    width: 240,
    height: 320,
    ratio: "4:3",
    notch: false,
    label: "iPad",
    features: "Почти квадратный",
  },
  "android-tall": {
    width: 160,
    height: 370,
    ratio: "21:9",
    notch: false,
    label: "Android флагманы",
    features: "Очень вытянутый",
  },
};

interface DevicePreviewProps {
  devices?: DeviceId[];
  mode?: "single" | "comparison" | "all";
  showSafeArea?: boolean;
  showNotch?: boolean;
  before?: { safeArea?: boolean; label?: string };
  after?: { safeArea?: boolean; label?: string };
  caption?: string;
  children?: React.ReactNode;
}

function Demo2048() {
  return (
    <div className="flex flex-col h-full w-full bg-amber-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs">
      <header className="flex justify-between items-center px-2 py-1.5 border-b border-amber-200 dark:border-neutral-600">
        <span className="font-semibold">2048</span>
        <span>Score: 0</span>
      </header>
      <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-0.5 p-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm bg-amber-100 dark:bg-neutral-700 flex items-center justify-center"
          />
        ))}
      </div>
      <div className="p-1.5 border-t border-amber-200 dark:border-neutral-600">
        <div className="rounded bg-amber-200 dark:bg-neutral-600 py-1 text-center font-medium">New Game</div>
      </div>
    </div>
  );
}

function DeviceFrame({
  deviceId,
  showSafeArea,
  showNotch,
  label,
  children,
}: {
  deviceId: DeviceId;
  showSafeArea?: boolean;
  showNotch?: boolean;
  label?: string;
  children: React.ReactNode;
}) {
  const config = deviceConfig[deviceId];
  const hasNotch = config.notch && showNotch !== false;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="rounded-[2rem] sm:rounded-[2.25rem] p-2 sm:p-2.5 bg-neutral-800 dark:bg-neutral-900 shadow-xl border border-neutral-700 dark:border-neutral-600"
        style={{ width: config.width, minHeight: config.height + 24 }}
      >
        <div
          className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-neutral-950"
          style={{ width: config.width - 16, height: config.height }}
        >
          {hasNotch && (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-5 bg-black rounded-b-xl z-10"
              aria-hidden
            />
          )}
          {showSafeArea && (
            <div
              className="absolute inset-2 border-2 border-dashed border-emerald-500/60 rounded-lg pointer-events-none z-[5]"
              aria-hidden
            />
          )}
          <div className="absolute inset-0 overflow-hidden w-full h-full">
            {children}
          </div>
        </div>
      </div>
      <div className="text-center min-w-0">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{config.label}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{config.ratio}</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 max-w-[12rem] mx-auto">
          {config.features}
        </p>
        {label && (
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">{label}</p>
        )}
      </div>
    </motion.div>
  );
}

export function DevicePreview({
  devices = ["iphone-se", "iphone-14"],
  mode = "single",
  showSafeArea = false,
  showNotch = true,
  before,
  after,
  caption,
  children,
}: DevicePreviewProps) {
  const content = children ?? <Demo2048 />;

  const normalized = devices.map((d) => (typeof d === "string" && deviceConfig[d as DeviceId] ? (d as DeviceId) : "iphone-se"));
  const list: DeviceId[] =
    mode === "comparison" && before != null && after != null
      ? [normalized[0] ?? "iphone-se", normalized[1] ?? "iphone-14"]
      : mode === "all"
        ? normalized.length
          ? normalized
          : (Object.keys(deviceConfig) as DeviceId[])
        : [normalized[0] ?? "iphone-se"];

  const isComparison = mode === "comparison" && before != null && after != null;

  return (
    <div className="my-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap justify-center gap-8 sm:gap-10"
      >
        {isComparison ? (
          <>
            <DeviceFrame
              deviceId={list[0]}
              showSafeArea={before.safeArea ?? showSafeArea}
              showNotch={showNotch}
              label={before.label ?? "До"}
            >
              {content}
            </DeviceFrame>
            <DeviceFrame
              deviceId={list[1]}
              showSafeArea={after.safeArea ?? showSafeArea}
              showNotch={showNotch}
              label={after.label ?? "После"}
            >
              {content}
            </DeviceFrame>
          </>
        ) : (
          list.map((id) => (
            <DeviceFrame
              key={id}
              deviceId={id}
              showSafeArea={showSafeArea}
              showNotch={showNotch}
            >
              {content}
            </DeviceFrame>
          ))
        )}
      </motion.div>
      {caption && (
        <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {caption}
        </p>
      )}
    </div>
  );
}
