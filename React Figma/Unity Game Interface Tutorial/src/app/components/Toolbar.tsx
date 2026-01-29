import { Play, Pause, StepForward, Hand, Move, RotateCw, Square } from 'lucide-react';
import { useState } from 'react';

export function Toolbar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('move');

  return (
    <div className="bg-[#353535] border-b border-[#1a1a1a] px-4 py-2 flex items-center gap-6">
      {/* Transform Tools */}
      <div className="flex gap-1">
        <button
          className={`p-2 hover:bg-[#404040] transition-colors ${
            activeTool === 'hand' ? 'bg-[#0e639c]' : ''
          }`}
          onClick={() => setActiveTool('hand')}
          title="Hand Tool"
        >
          <Hand className="size-4" />
        </button>
        <button
          className={`p-2 hover:bg-[#404040] transition-colors ${
            activeTool === 'move' ? 'bg-[#0e639c]' : ''
          }`}
          onClick={() => setActiveTool('move')}
          title="Move Tool"
        >
          <Move className="size-4" />
        </button>
        <button
          className={`p-2 hover:bg-[#404040] transition-colors ${
            activeTool === 'rotate' ? 'bg-[#0e639c]' : ''
          }`}
          onClick={() => setActiveTool('rotate')}
          title="Rotate Tool"
        >
          <RotateCw className="size-4" />
        </button>
        <button
          className={`p-2 hover:bg-[#404040] transition-colors ${
            activeTool === 'scale' ? 'bg-[#0e639c]' : ''
          }`}
          onClick={() => setActiveTool('scale')}
          title="Scale Tool"
        >
          <Square className="size-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-[#1a1a1a]" />

      {/* Play Controls */}
      <div className="flex gap-1 items-center">
        <button
          className={`p-2 hover:bg-[#404040] transition-colors ${
            isPlaying ? 'text-[#4a9eff]' : ''
          }`}
          onClick={() => setIsPlaying(!isPlaying)}
          title="Play"
        >
          <Play className="size-5" fill={isPlaying ? 'currentColor' : 'none'} />
        </button>
        <button
          className="p-2 hover:bg-[#404040] transition-colors"
          title="Pause"
        >
          <Pause className="size-5" />
        </button>
        <button
          className="p-2 hover:bg-[#404040] transition-colors"
          title="Step"
        >
          <StepForward className="size-5" />
        </button>
      </div>

      <div className="w-px h-6 bg-[#1a1a1a]" />

      {/* Account Section */}
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-[#0e639c] flex items-center justify-center text-xs">
            U
          </div>
          <span className="text-sm">Unity Account</span>
        </div>
      </div>
    </div>
  );
}
