import { useState } from 'react';

export function MenuBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menus = [
    {
      name: 'File',
      items: ['New Scene', 'Open Scene', 'Save', 'Save As...', 'Build Settings', 'Exit']
    },
    {
      name: 'Edit',
      items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Duplicate', 'Delete', 'Frame Selected', 'Select All']
    },
    {
      name: 'Assets',
      items: ['Create', 'Import New Asset...', 'Import Package', 'Export Package...', 'Refresh']
    },
    {
      name: 'GameObject',
      items: ['Create Empty', '3D Object', '2D Object', 'Effects', 'Light', 'Audio', 'Video', 'UI', 'Camera']
    },
    {
      name: 'Component',
      items: ['Add...', 'Mesh', 'Effects', 'Physics', 'Audio', 'Rendering', 'Scripts']
    },
    {
      name: 'Window',
      items: ['Layouts', 'Asset Store', 'Package Manager', 'General', 'Animation', 'Audio', 'Rendering']
    },
    {
      name: 'Help',
      items: ['About Unity', 'Unity Manual', 'Scripting Reference', 'Unity Forum', 'Report a Bug']
    }
  ];

  return (
    <div className="bg-[#2b2b2b] border-b border-[#1a1a1a] px-2 py-1 flex gap-1 relative z-50">
      {menus.map((menu) => (
        <div key={menu.name} className="relative">
          <button
            className={`px-3 py-1 text-sm hover:bg-[#3f3f46] transition-colors ${
              openMenu === menu.name ? 'bg-[#3f3f46]' : ''
            }`}
            onMouseEnter={() => openMenu && setOpenMenu(menu.name)}
            onClick={() => setOpenMenu(openMenu === menu.name ? null : menu.name)}
          >
            {menu.name}
          </button>
          
          {openMenu === menu.name && (
            <>
              <div 
                className="fixed inset-0" 
                onClick={() => setOpenMenu(null)}
              />
              <div className="absolute left-0 top-full mt-0 bg-[#2b2b2b] border border-[#1a1a1a] shadow-lg min-w-48 py-1 z-50">
                {menu.items.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#0e639c] transition-colors"
                    onClick={() => setOpenMenu(null)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
