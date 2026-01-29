import { useState, useRef, useEffect } from 'react';
import { Maximize2, Grid3x3, Eye, Sun, Box } from 'lucide-react';

export function SceneView() {
  const [activeTab, setActiveTab] = useState<'Scene' | 'Game'>('Scene');
  const [is2D, setIs2D] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw a simple 3D scene visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    const gridSize = 50;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Horizontal lines
    for (let i = -10; i <= 10; i++) {
      const y = centerY + i * gridSize * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Vertical lines with perspective
    for (let i = -10; i <= 10; i++) {
      const x = centerX + i * gridSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw a simple cube in the center
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 2;
    
    const cubeSize = 80;
    const offsetX = centerX - 40;
    const offsetY = centerY - 60;
    
    // Front face
    ctx.strokeRect(offsetX, offsetY, cubeSize, cubeSize);
    
    // Back face (perspective)
    const perspectiveOffset = 30;
    ctx.strokeRect(
      offsetX + perspectiveOffset,
      offsetY - perspectiveOffset,
      cubeSize,
      cubeSize
    );
    
    // Connecting lines
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX + perspectiveOffset, offsetY - perspectiveOffset);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(offsetX + cubeSize, offsetY);
    ctx.lineTo(offsetX + cubeSize + perspectiveOffset, offsetY - perspectiveOffset);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + cubeSize);
    ctx.lineTo(offsetX + perspectiveOffset, offsetY + cubeSize - perspectiveOffset);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(offsetX + cubeSize, offsetY + cubeSize);
    ctx.lineTo(offsetX + cubeSize + perspectiveOffset, offsetY + cubeSize - perspectiveOffset);
    ctx.stroke();

    // Draw coordinate axes
    const axisLength = 100;
    // X axis (red)
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(50 + axisLength, canvas.height - 50);
    ctx.stroke();
    ctx.fillStyle = '#ff0000';
    ctx.fillText('X', 50 + axisLength + 10, canvas.height - 45);

    // Y axis (green)
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(50, canvas.height - 50 - axisLength);
    ctx.stroke();
    ctx.fillStyle = '#00ff00';
    ctx.fillText('Y', 45, canvas.height - 50 - axisLength - 10);

    // Z axis (blue)
    ctx.strokeStyle = '#0000ff';
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(50 - axisLength * 0.5, canvas.height - 50 + axisLength * 0.5);
    ctx.stroke();
    ctx.fillStyle = '#0000ff';
    ctx.fillText('Z', 50 - axisLength * 0.5 - 15, canvas.height - 50 + axisLength * 0.5 + 5);

  }, [activeTab]);

  return (
    <div className="flex-1 flex flex-col bg-[#282828] min-h-0">
      {/* Tabs */}
      <div className="bg-[#2b2b2b] border-b border-[#1a1a1a] flex items-center">
        <button
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === 'Scene'
              ? 'bg-[#282828] border-b-2 border-[#0e639c]'
              : 'hover:bg-[#3f3f46]'
          }`}
          onClick={() => setActiveTab('Scene')}
        >
          Scene
        </button>
        <button
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === 'Game'
              ? 'bg-[#282828] border-b-2 border-[#0e639c]'
              : 'hover:bg-[#3f3f46]'
          }`}
          onClick={() => setActiveTab('Game')}
        >
          Game
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-1 px-2">
          <button
            className={`p-1.5 hover:bg-[#3f3f46] rounded transition-colors ${
              is2D ? 'bg-[#0e639c]' : ''
            }`}
            onClick={() => setIs2D(!is2D)}
            title="2D/3D Toggle"
          >
            {is2D ? '2D' : '3D'}
          </button>
        </div>
      </div>

      {/* Viewport Controls */}
      <div className="absolute top-20 right-[21rem] z-10 bg-[#2b2b2b] border border-[#1a1a1a] rounded shadow-lg p-1 flex flex-col gap-1">
        <button
          className="p-2 hover:bg-[#3f3f46] rounded transition-colors"
          title="Shading Mode"
        >
          <Box className="size-4" />
        </button>
        <button
          className="p-2 hover:bg-[#3f3f46] rounded transition-colors"
          title="Scene Lighting"
        >
          <Sun className="size-4" />
        </button>
        <button
          className="p-2 hover:bg-[#3f3f46] rounded transition-colors"
          title="Scene Visibility"
        >
          <Eye className="size-4" />
        </button>
        <button
          className="p-2 hover:bg-[#3f3f46] rounded transition-colors"
          title="Grid Visibility"
        >
          <Grid3x3 className="size-4" />
        </button>
      </div>

      {/* Scene Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
        
        {/* Overlay Info */}
        <div className="absolute bottom-4 right-4 bg-[#2b2b2bb0] backdrop-blur-sm px-3 py-2 rounded text-xs space-y-0.5">
          <div>Camera: Perspective</div>
          <div>Position: (0, 1, -10)</div>
          <div>Rotation: (0, 0, 0)</div>
        </div>
      </div>
    </div>
  );
}
