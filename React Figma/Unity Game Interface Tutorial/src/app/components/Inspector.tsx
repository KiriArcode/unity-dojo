import { ChevronDown, Plus, Check } from 'lucide-react';
import { useState } from 'react';

interface InspectorProps {
  selectedObject: string;
}

export function Inspector({ selectedObject }: InspectorProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    transform: true,
    camera: true,
    light: true,
    renderer: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getComponentsForObject = (objectName: string) => {
    if (objectName === 'Main Camera') {
      return ['Transform', 'Camera', 'Audio Listener'];
    } else if (objectName === 'Directional Light') {
      return ['Transform', 'Light'];
    } else if (objectName.includes('Player')) {
      return ['Transform', 'Mesh Renderer', 'Box Collider', 'Player Controller'];
    } else {
      return ['Transform', 'Mesh Renderer'];
    }
  };

  const components = getComponentsForObject(selectedObject);

  return (
    <div className="h-full flex flex-col bg-[#282828] overflow-y-auto">
      {/* Header */}
      <div className="bg-[#2b2b2b] border-b border-[#1a1a1a] px-3 py-2 flex items-center justify-between sticky top-0 z-10">
        <span className="text-sm">Inspector</span>
        <button className="hover:bg-[#3f3f46] p-1 rounded transition-colors" title="Add Component">
          <Plus className="size-4" />
        </button>
      </div>

      {/* Object Header */}
      <div className="p-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2 mb-3">
          <input type="checkbox" defaultChecked className="size-4" />
          <input
            type="text"
            value={selectedObject}
            readOnly
            className="flex-1 bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-[#999]">
          <span>Static</span>
          <select className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 flex-1">
            <option>Default</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#999] mt-2">
          <span>Tag</span>
          <select className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 flex-1">
            <option>Untagged</option>
            <option>MainCamera</option>
            <option>Player</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#999] mt-2">
          <span>Layer</span>
          <select className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 flex-1">
            <option>Default</option>
            <option>UI</option>
          </select>
        </div>
      </div>

      {/* Transform Component */}
      {components.includes('Transform') && (
        <div className="border-b border-[#1a1a1a]">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 bg-[#333333] hover:bg-[#3a3a3a] transition-colors"
            onClick={() => toggleSection('transform')}
          >
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.transform ? '' : '-rotate-90'
              }`}
            />
            <Check className="size-4 text-[#4a9eff]" />
            <span className="text-sm">Transform</span>
          </button>
          {expandedSections.transform && (
            <div className="p-3 space-y-2 text-sm">
              <div className="grid grid-cols-4 gap-2 items-center">
                <label className="text-xs text-[#999]">Position</label>
                <input
                  type="number"
                  defaultValue="0"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="X"
                />
                <input
                  type="number"
                  defaultValue="0"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="Y"
                />
                <input
                  type="number"
                  defaultValue="0"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="Z"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <label className="text-xs text-[#999]">Rotation</label>
                <input
                  type="number"
                  defaultValue="0"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="X"
                />
                <input
                  type="number"
                  defaultValue="0"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="Y"
                />
                <input
                  type="number"
                  defaultValue="0"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="Z"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <label className="text-xs text-[#999]">Scale</label>
                <input
                  type="number"
                  defaultValue="1"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="X"
                />
                <input
                  type="number"
                  defaultValue="1"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="Y"
                />
                <input
                  type="number"
                  defaultValue="1"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs"
                  placeholder="Z"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Camera Component */}
      {components.includes('Camera') && (
        <div className="border-b border-[#1a1a1a]">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 bg-[#333333] hover:bg-[#3a3a3a] transition-colors"
            onClick={() => toggleSection('camera')}
          >
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.camera ? '' : '-rotate-90'
              }`}
            />
            <Check className="size-4 text-[#4a9eff]" />
            <span className="text-sm">Camera</span>
          </button>
          {expandedSections.camera && (
            <div className="p-3 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#999]">Clear Flags</label>
                <select className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs flex-1 ml-2">
                  <option>Skybox</option>
                  <option>Solid Color</option>
                  <option>Depth only</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#999]">Background</label>
                <input
                  type="color"
                  defaultValue="#000000"
                  className="ml-2 h-6 w-20 bg-[#1e1e1e] border border-[#3f3f46] rounded"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#999]">Culling Mask</label>
                <select className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs flex-1 ml-2">
                  <option>Everything</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#999]">Projection</label>
                <select className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs flex-1 ml-2">
                  <option>Perspective</option>
                  <option>Orthographic</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#999]">Field of View</label>
                <input
                  type="number"
                  defaultValue="60"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs w-20 ml-2"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Light Component */}
      {components.includes('Light') && (
        <div className="border-b border-[#1a1a1a]">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 bg-[#333333] hover:bg-[#3a3a3a] transition-colors"
            onClick={() => toggleSection('light')}
          >
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.light ? '' : '-rotate-90'
              }`}
            />
            <Check className="size-4 text-[#4a9eff]" />
            <span className="text-sm">Light</span>
          </button>
          {expandedSections.light && (
            <div className="p-3 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#999]">Type</label>
                <select className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs flex-1 ml-2">
                  <option>Directional</option>
                  <option>Point</option>
                  <option>Spot</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#999]">Color</label>
                <input
                  type="color"
                  defaultValue="#ffffff"
                  className="ml-2 h-6 w-20 bg-[#1e1e1e] border border-[#3f3f46] rounded"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#999]">Intensity</label>
                <input
                  type="number"
                  defaultValue="1"
                  step="0.1"
                  className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-xs w-20 ml-2"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Other Components */}
      {components.includes('Mesh Renderer') && (
        <div className="border-b border-[#1a1a1a]">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 bg-[#333333] hover:bg-[#3a3a3a] transition-colors"
            onClick={() => toggleSection('renderer')}
          >
            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.renderer ? '' : '-rotate-90'
              }`}
            />
            <Check className="size-4 text-[#4a9eff]" />
            <span className="text-sm">Mesh Renderer</span>
          </button>
        </div>
      )}

      {components.includes('Box Collider') && (
        <div className="border-b border-[#1a1a1a]">
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-[#333333] hover:bg-[#3a3a3a] transition-colors">
            <ChevronDown className="size-4" />
            <Check className="size-4 text-[#4a9eff]" />
            <span className="text-sm">Box Collider</span>
          </button>
        </div>
      )}

      {components.includes('Player Controller') && (
        <div className="border-b border-[#1a1a1a]">
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-[#333333] hover:bg-[#3a3a3a] transition-colors">
            <ChevronDown className="size-4" />
            <Check className="size-4 text-[#4a9eff]" />
            <span className="text-sm">Player Controller (Script)</span>
          </button>
        </div>
      )}

      {components.includes('Audio Listener') && (
        <div className="border-b border-[#1a1a1a]">
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-[#333333] hover:bg-[#3a3a3a] transition-colors">
            <ChevronDown className="size-4" />
            <Check className="size-4 text-[#4a9eff]" />
            <span className="text-sm">Audio Listener</span>
          </button>
        </div>
      )}

      {/* Add Component Button */}
      <div className="p-3">
        <button className="w-full bg-[#3f3f46] hover:bg-[#4a5057] transition-colors rounded py-2 text-sm flex items-center justify-center gap-2">
          Add Component
        </button>
      </div>
    </div>
  );
}
