"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type LayoutNodeId = "canvas" | "safe-area" | "header" | "game-board" | "footer";

interface RectTransform {
  anchorPreset: string;
  anchorMin: [number, number];
  anchorMax: [number, number];
  width: number;
  height: number;
  posX: number;
  posY: number;
}

interface LayoutNode {
  id: LayoutNodeId;
  name: string;
  children?: LayoutNode[];
  rectTransform?: RectTransform;
}

const UI_TREE: LayoutNode = {
  id: "canvas",
  name: "Canvas",
  rectTransform: {
    anchorPreset: "Stretch All",
    anchorMin: [0, 0],
    anchorMax: [1, 1],
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
  },
  children: [
    {
      id: "safe-area",
      name: "SafeAreaPanel",
      rectTransform: {
        anchorPreset: "Stretch All",
        anchorMin: [0, 0],
        anchorMax: [1, 1],
        width: 0,
        height: 0,
        posX: 0,
        posY: 0,
      },
      children: [
        {
          id: "header",
          name: "Header",
          rectTransform: {
            anchorPreset: "Stretch Horizontal",
            anchorMin: [0, 1],
            anchorMax: [1, 1],
            width: 0,
            height: 80,
            posX: 0,
            posY: 0,
          },
        },
        {
          id: "game-board",
          name: "GameBoard",
          rectTransform: {
            anchorPreset: "Center",
            anchorMin: [0.5, 0.5],
            anchorMax: [0.5, 0.5],
            width: 320,
            height: 320,
            posX: 0,
            posY: 0,
          },
        },
        {
          id: "footer",
          name: "Footer",
          rectTransform: {
            anchorPreset: "Stretch Horizontal",
            anchorMin: [0, 0],
            anchorMax: [1, 0],
            width: 0,
            height: 72,
            posX: 0,
            posY: 0,
          },
        },
      ],
    },
  ],
};

function findNodeById(node: LayoutNode, id: LayoutNodeId): LayoutNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

const ZONE_COLORS: Record<LayoutNodeId, string> = {
  canvas: "bg-neutral-600/30 border-neutral-500",
  "safe-area": "bg-neutral-500/20 border-neutral-400",
  header: "bg-blue-500/40 border-blue-400 dark:bg-blue-600/50 dark:border-blue-500",
  "game-board": "bg-amber-500/40 border-amber-400 dark:bg-amber-600/50 dark:border-amber-500",
  footer: "bg-violet-500/40 border-violet-400 dark:bg-violet-600/50 dark:border-violet-500",
};

interface Layout2048Props {
  interactive?: boolean;
  highlightOnHover?: boolean;
  /** "tabs" = switch Hierarchy/Preview by tabs; "full" = show all panels in one row */
  layout?: "tabs" | "full";
  showInspector?: boolean;
  showHierarchy?: boolean;
  [key: string]: unknown;
}

function InspectorPanel({ node }: { node: LayoutNode | null }) {
  if (!node?.rectTransform) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-neutral-500 dark:text-neutral-400 p-4">
        Выберите объект в Hierarchy или в превью
      </div>
    );
  }
  const rt = node.rectTransform;
  return (
    <div className="text-left space-y-0 overflow-auto">
      <div className="sticky top-0 bg-neutral-800 dark:bg-neutral-900 border-b border-neutral-700 px-2 py-1.5">
        <p className="text-xs font-semibold text-neutral-200 truncate">{node.name}</p>
        <p className="text-[10px] text-neutral-500">RectTransform</p>
      </div>
      <div className="p-1.5 space-y-1">
        <div className="border-b border-neutral-700/80 pb-1.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider px-1 mb-1">Anchor</p>
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs font-mono text-neutral-300">
            <span className="text-neutral-500">Preset</span>
            <span>{rt.anchorPreset}</span>
            <span className="text-neutral-500">Min</span>
            <span>({rt.anchorMin[0]}, {rt.anchorMin[1]})</span>
            <span className="text-neutral-500">Max</span>
            <span>({rt.anchorMax[0]}, {rt.anchorMax[1]})</span>
          </div>
        </div>
        <div className="border-b border-neutral-700/80 pb-1.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider px-1 mb-1">Size</p>
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs font-mono text-neutral-300">
            <span className="text-neutral-500">Width</span>
            <span>{rt.width}</span>
            <span className="text-neutral-500">Height</span>
            <span>{rt.height}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider px-1 mb-1">Position</p>
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs font-mono text-neutral-300">
            <span className="text-neutral-500">Pos X</span>
            <span>{rt.posX}</span>
            <span className="text-neutral-500">Pos Y</span>
            <span>{rt.posY}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HierarchyTree({
  node,
  depth,
  selectedId,
  hoveredId,
  highlightOnHover,
  interactive,
  onSelect,
  onHover,
  expandedIds,
  toggleExpanded,
}: {
  node: LayoutNode;
  depth: number;
  selectedId: LayoutNodeId | null;
  hoveredId: LayoutNodeId | null;
  highlightOnHover: boolean;
  interactive: boolean;
  onSelect: (id: LayoutNodeId) => void;
  onHover: (id: LayoutNodeId | null) => void;
  expandedIds: Set<LayoutNodeId>;
  toggleExpanded: (id: LayoutNodeId) => void;
}) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isExpanded = !hasChildren || expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-1 py-0.5 pr-1 rounded cursor-pointer text-xs font-mono
          ${isSelected ? "bg-blue-600/40 text-blue-100 dark:bg-blue-500/30 dark:text-blue-200" : ""}
          ${highlightOnHover && isHovered && !isSelected ? "bg-neutral-600/50 dark:bg-neutral-600/40" : ""}
          ${interactive ? "hover:bg-neutral-600/30 dark:hover:bg-neutral-600/20" : ""}
        `}
        style={{ paddingLeft: depth * 12 + 4 }}
        onClick={() => interactive && onSelect(node.id)}
        onMouseEnter={() => highlightOnHover && interactive && onHover(node.id)}
        onMouseLeave={() => highlightOnHover && interactive && onHover(null)}
      >
        <button
          type="button"
          className="w-4 h-4 flex items-center justify-center rounded hover:bg-neutral-500/50 p-0"
          aria-label={isExpanded ? "Collapse" : "Expand"}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleExpanded(node.id);
          }}
        >
          {hasChildren ? (
            <span className="text-neutral-400 text-[10px]">{isExpanded ? "▼" : "▶"}</span>
          ) : (
            <span className="w-2 h-2 rounded-sm bg-neutral-500" aria-hidden />
          )}
        </button>
        <span className="truncate flex-1">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <HierarchyTree
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              hoveredId={hoveredId}
              highlightOnHover={highlightOnHover}
              interactive={interactive}
              onSelect={onSelect}
              onHover={onHover}
              expandedIds={expandedIds}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const DEVICE_WIDTH = 260;
const DEVICE_HEIGHT = 420;

function VisualPreview({
  selectedId,
  hoveredId,
  highlightOnHover,
  interactive,
  onSelect,
  onHover,
}: {
  selectedId: LayoutNodeId | null;
  hoveredId: LayoutNodeId | null;
  highlightOnHover: boolean;
  interactive: boolean;
  onSelect: (id: LayoutNodeId) => void;
  onHover: (id: LayoutNodeId | null) => void;
}) {
  const clickableIds: LayoutNodeId[] = ["header", "game-board", "footer"];
  const handleZone = (id: LayoutNodeId) => {
    if (!interactive) return;
    onSelect(id);
  };

  return (
    <div
      className="rounded-xl border-2 border-neutral-400 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-800 shadow-lg overflow-hidden flex flex-col"
      style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
    >
      <div className="flex-1 flex flex-col bg-neutral-100 dark:bg-neutral-900 relative min-h-0">
        {/* Header zone */}
        <motion.div
          className={`
            h-20 flex-shrink-0 flex items-center justify-center border-b-2 border-neutral-300 dark:border-neutral-700
            ${ZONE_COLORS.header}
            ${selectedId === "header" ? "ring-2 ring-blue-400 ring-inset dark:ring-blue-500" : ""}
            ${highlightOnHover && hoveredId === "header" ? "ring-2 ring-blue-300 ring-inset dark:ring-blue-400" : ""}
          `}
          onClick={() => handleZone("header")}
          onMouseEnter={() => interactive && onHover("header")}
          onMouseLeave={() => interactive && onHover(null)}
          whileHover={interactive ? { opacity: 0.95 } : undefined}
          transition={{ type: "tween", duration: 0.15 }}
        >
          <span className="text-xs font-medium text-blue-900 dark:text-blue-100">Счёт</span>
        </motion.div>

        {/* Game board zone */}
        <motion.div
          className={`
            flex-1 flex items-center justify-center p-2 min-h-0
            ${ZONE_COLORS["game-board"]}
            ${selectedId === "game-board" ? "ring-2 ring-amber-400 ring-inset dark:ring-amber-500" : ""}
            ${highlightOnHover && hoveredId === "game-board" ? "ring-2 ring-amber-300 ring-inset dark:ring-amber-400" : ""}
          `}
          onClick={() => handleZone("game-board")}
          onMouseEnter={() => interactive && onHover("game-board")}
          onMouseLeave={() => interactive && onHover(null)}
          whileHover={interactive ? { opacity: 0.95 } : undefined}
          transition={{ type: "tween", duration: 0.15 }}
        >
          <div className="w-full aspect-square max-w-[200px] grid grid-cols-4 grid-rows-4 gap-1 bg-neutral-800/50 dark:bg-neutral-900/50 rounded p-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded bg-neutral-700/80 dark:bg-neutral-600/80 flex items-center justify-center text-[10px] font-bold text-neutral-400"
              />
            ))}
          </div>
        </motion.div>

        {/* Footer zone */}
        <motion.div
          className={`
            h-[72px] flex-shrink-0 flex items-center justify-center gap-2 border-t-2 border-neutral-300 dark:border-neutral-700
            ${ZONE_COLORS.footer}
            ${selectedId === "footer" ? "ring-2 ring-violet-400 ring-inset dark:ring-violet-500" : ""}
            ${highlightOnHover && hoveredId === "footer" ? "ring-2 ring-violet-300 ring-inset dark:ring-violet-400" : ""}
          `}
          onClick={() => handleZone("footer")}
          onMouseEnter={() => interactive && onHover("footer")}
          onMouseLeave={() => interactive && onHover(null)}
          whileHover={interactive ? { opacity: 0.95 } : undefined}
          transition={{ type: "tween", duration: 0.15 }}
        >
          <span className="text-xs font-medium text-violet-900 dark:text-violet-100">New Game | Undo</span>
        </motion.div>
      </div>
    </div>
  );
}

export default function Layout2048({
  interactive = true,
  highlightOnHover = true,
  layout = "tabs",
  showInspector = true,
  showHierarchy = true,
}: Layout2048Props) {
  const [activeTab, setActiveTab] = useState<"hierarchy" | "preview">("hierarchy");
  const [selectedId, setSelectedId] = useState<LayoutNodeId | null>(null);
  const [hoveredId, setHoveredId] = useState<LayoutNodeId | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<LayoutNodeId>>(new Set(["canvas", "safe-area"]));

  const toggleExpanded = useCallback((id: LayoutNodeId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectedNode = selectedId ? findNodeById(UI_TREE, selectedId) : null;
  const isFullLayout = layout === "full";

  const hierarchyPanel = (
    <div className="p-3 flex gap-4 max-h-[420px]">
      <div className="flex-1 min-w-0 overflow-auto">
        <HierarchyTree
          node={UI_TREE}
          depth={0}
          selectedId={selectedId}
          hoveredId={hoveredId}
          highlightOnHover={highlightOnHover}
          interactive={interactive}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          expandedIds={expandedIds}
          toggleExpanded={toggleExpanded}
        />
      </div>
      {highlightOnHover && !isFullLayout && (
        <div className="flex-shrink-0 flex items-center justify-center pr-2">
          <div
            className="rounded-lg border-2 border-neutral-400 dark:border-neutral-600 overflow-hidden flex flex-col bg-neutral-100 dark:bg-neutral-900"
            style={{ width: 120, height: 194 }}
          >
            <div
              className={`h-8 flex-shrink-0 border-b border-neutral-300 dark:border-neutral-700 transition-colors ${ZONE_COLORS.header} ${hoveredId === "header" ? "ring-1 ring-blue-400" : ""}`}
            />
            <div
              className={`flex-1 min-h-0 border-b border-neutral-300 dark:border-neutral-700 transition-colors ${ZONE_COLORS["game-board"]} ${hoveredId === "game-board" ? "ring-1 ring-amber-400" : ""}`}
            />
            <div
              className={`h-7 flex-shrink-0 transition-colors ${ZONE_COLORS.footer} ${hoveredId === "footer" ? "ring-1 ring-violet-400" : ""}`}
            />
          </div>
        </div>
      )}
    </div>
  );

  const previewPanel = (
    <div className="p-4 flex items-start justify-center overflow-auto">
      <VisualPreview
        selectedId={selectedId}
        hoveredId={hoveredId}
        highlightOnHover={highlightOnHover ?? true}
        interactive={interactive ?? true}
        onSelect={setSelectedId}
        onHover={setHoveredId}
      />
    </div>
  );

  const inspectorPanel = showInspector ? (
    <div
      className="w-52 flex-shrink-0 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-800 dark:bg-neutral-900 text-neutral-200 overflow-hidden flex flex-col"
      style={{ minHeight: 320 }}
    >
      <div className="px-2 py-1.5 border-b border-neutral-700 bg-neutral-900/80 text-[10px] uppercase tracking-wider text-neutral-500">
        Inspector
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <InspectorPanel node={selectedNode} />
      </div>
    </div>
  ) : null;

  if (isFullLayout) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 min-h-0 flex-wrap">
          {showHierarchy && (
            <div className="w-52 flex-shrink-0 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden max-h-[420px]">
              <div className="px-2 py-1.5 border-b border-neutral-200 dark:border-neutral-700 text-[10px] uppercase tracking-wider text-neutral-500">
                Hierarchy
              </div>
              <div className="overflow-auto p-2">
                <HierarchyTree
                  node={UI_TREE}
                  depth={0}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  highlightOnHover={highlightOnHover ?? true}
                  interactive={interactive ?? true}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                  expandedIds={expandedIds}
                  toggleExpanded={toggleExpanded}
                />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden flex items-start justify-center p-4">
            {previewPanel}
          </div>
          {inspectorPanel}
        </div>
        {interactive && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Hierarchy, превью и Inspector в одном экране. Клик по элементу или зоне выделяет и показывает настройки.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex border-b border-neutral-200 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => setActiveTab("hierarchy")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === "hierarchy"
              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 border-b-0 -mb-px"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          }`}
        >
          Hierarchy View
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === "preview"
              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 border-b-0 -mb-px"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          }`}
        >
          Visual Preview
        </button>
      </div>

      <div className="flex gap-4 min-h-0">
        <div className="flex-1 min-w-0 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "hierarchy" ? (
              <motion.div key="hierarchy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {hierarchyPanel}
              </motion.div>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {previewPanel}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {inspectorPanel}
      </div>

      {interactive && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {activeTab === "hierarchy"
            ? "Клик по элементу — показать в Inspector. При наведении подсвечивается превью."
            : "Клик по зоне (Header / GameBoard / Footer) выделяет элемент и отображает настройки в Inspector."}
        </p>
      )}
    </div>
  );
}
