import { useState } from 'react';
import { MenuBar } from '@/app/components/MenuBar';
import { Toolbar } from '@/app/components/Toolbar';
import { Hierarchy } from '@/app/components/Hierarchy';
import { SceneView } from '@/app/components/SceneView';
import { Inspector } from '@/app/components/Inspector';
import { ProjectPanel } from '@/app/components/ProjectPanel';

export function UnityEditor() {
  const [selectedObject, setSelectedObject] = useState<string>('Main Camera');

  return (
    <div className="h-screen flex flex-col bg-[#383838] text-[#CCCCCC] overflow-hidden">
      {/* Menu Bar */}
      <MenuBar />
      
      {/* Toolbar */}
      <Toolbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Hierarchy */}
        <div className="w-64 border-r border-[#1a1a1a] flex flex-col">
          <Hierarchy selectedObject={selectedObject} onSelectObject={setSelectedObject} />
        </div>
        
        {/* Center Panel - Scene/Game View */}
        <div className="flex-1 flex flex-col min-w-0">
          <SceneView />
          
          {/* Bottom Panel - Project/Console */}
          <div className="h-64 border-t border-[#1a1a1a]">
            <ProjectPanel />
          </div>
        </div>
        
        {/* Right Panel - Inspector */}
        <div className="w-80 border-l border-[#1a1a1a]">
          <Inspector selectedObject={selectedObject} />
        </div>
      </div>
    </div>
  );
}
