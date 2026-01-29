import { Search, FolderOpen, FileText, Image, Music, Film, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: 'script' | 'material' | 'prefab' | 'scene' | 'texture' | 'model' | 'audio';
  expanded?: boolean;
  children?: FolderItem[];
}

export function ProjectPanel() {
  const [activeTab, setActiveTab] = useState<'Project' | 'Console'>('Project');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('Assets');
  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id: '1',
      name: 'Assets',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: '1-1',
          name: 'Scenes',
          type: 'folder',
          expanded: false,
          children: [
            { id: '1-1-1', name: 'MainScene.unity', type: 'file', fileType: 'scene' },
          ],
        },
        {
          id: '1-2',
          name: 'Scripts',
          type: 'folder',
          expanded: false,
          children: [
            { id: '1-2-1', name: 'PlayerController.cs', type: 'file', fileType: 'script' },
            { id: '1-2-2', name: 'GameManager.cs', type: 'file', fileType: 'script' },
          ],
        },
        {
          id: '1-3',
          name: 'Materials',
          type: 'folder',
          expanded: false,
        },
        {
          id: '1-4',
          name: 'Prefabs',
          type: 'folder',
          expanded: false,
        },
        {
          id: '1-5',
          name: 'Textures',
          type: 'folder',
          expanded: false,
        },
        {
          id: '1-6',
          name: 'Models',
          type: 'folder',
          expanded: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Packages',
      type: 'folder',
      expanded: false,
    },
  ]);

  const [consoleMessages] = useState([
    { type: 'log', message: 'Unity Editor initialized successfully', time: '10:23:45' },
    { type: 'warning', message: 'Shader warning: Unsupported feature in shader "Standard"', time: '10:24:12' },
    { type: 'log', message: 'Scene loaded: MainScene', time: '10:24:15' },
    { type: 'log', message: 'Compilation completed in 0.45 seconds', time: '10:25:03' },
  ]);

  const toggleFolder = (folderId: string, items: FolderItem[] = folders): FolderItem[] => {
    return items.map((item) => {
      if (item.id === folderId) {
        return { ...item, expanded: !item.expanded };
      }
      if (item.children) {
        return { ...item, children: toggleFolder(folderId, item.children) };
      }
      return item;
    });
  };

  const handleFolderToggle = (folderId: string) => {
    setFolders(toggleFolder(folderId));
  };

  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'script':
        return <FileText className="size-4 text-[#4a9eff]" />;
      case 'texture':
        return <Image className="size-4 text-[#ff6b6b]" />;
      case 'audio':
        return <Music className="size-4 text-[#51cf66]" />;
      case 'scene':
        return <Film className="size-4 text-[#ffd43b]" />;
      default:
        return <FileText className="size-4 text-[#999]" />;
    }
  };

  const renderFolderTree = (items: FolderItem[], level: number = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <div
          className={`flex items-center gap-1 py-0.5 px-2 cursor-pointer hover:bg-[#3f3f46] transition-colors ${
            selectedFolder === item.name ? 'bg-[#2a5481]' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              handleFolderToggle(item.id);
              setSelectedFolder(item.name);
            }
          }}
        >
          {item.type === 'folder' ? (
            <>
              {item.children && item.children.length > 0 ? (
                item.expanded ? (
                  <ChevronDown className="size-3" />
                ) : (
                  <ChevronRight className="size-3" />
                )
              ) : (
                <div className="size-3" />
              )}
              <FolderOpen className="size-4 text-[#ffa94d]" />
            </>
          ) : (
            <>
              <div className="size-3" />
              {getFileIcon(item.fileType)}
            </>
          )}
          <span className="text-xs">{item.name}</span>
        </div>
        {item.type === 'folder' && item.expanded && item.children && (
          <div>{renderFolderTree(item.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const projectAssets = [
    { name: 'MainScene', type: 'scene', icon: '🎬' },
    { name: 'PlayerController', type: 'script', icon: '📄' },
    { name: 'GameManager', type: 'script', icon: '📄' },
    { name: 'PlayerMaterial', type: 'material', icon: '🎨' },
    { name: 'GroundTexture', type: 'texture', icon: '🖼️' },
    { name: 'PlayerPrefab', type: 'prefab', icon: '📦' },
    { name: 'BackgroundMusic', type: 'audio', icon: '🎵' },
    { name: 'PlayerModel', type: 'model', icon: '🧊' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#282828]">
      {/* Tabs */}
      <div className="bg-[#2b2b2b] border-b border-[#1a1a1a] flex items-center">
        <button
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === 'Project'
              ? 'bg-[#282828] border-b-2 border-[#0e639c]'
              : 'hover:bg-[#3f3f46]'
          }`}
          onClick={() => setActiveTab('Project')}
        >
          Project
        </button>
        <button
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === 'Console'
              ? 'bg-[#282828] border-b-2 border-[#0e639c]'
              : 'hover:bg-[#3f3f46]'
          }`}
          onClick={() => setActiveTab('Console')}
        >
          Console
        </button>
        <div className="flex-1" />
        <button className="hover:bg-[#3f3f46] p-2 rounded transition-colors mr-2">
          <Plus className="size-4" />
        </button>
      </div>

      {activeTab === 'Project' ? (
        <div className="flex-1 flex min-h-0">
          {/* Folder Tree */}
          <div className="w-48 border-r border-[#1a1a1a] overflow-y-auto">
            <div className="p-2 text-xs">
              <div className="mb-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-[#999]" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#3f3f46] rounded pl-7 pr-2 py-1 text-xs focus:outline-none focus:border-[#0e639c]"
                  />
                </div>
              </div>
              {renderFolderTree(folders)}
            </div>
          </div>

          {/* Assets Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-4 gap-4">
              {projectAssets.map((asset) => (
                <div
                  key={asset.name}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-[#3f3f46] rounded cursor-pointer transition-colors"
                >
                  <div className="size-16 bg-[#3a3a3a] rounded flex items-center justify-center text-3xl">
                    {asset.icon}
                  </div>
                  <span className="text-xs text-center break-all">{asset.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Console Messages */}
          <div className="text-xs font-mono">
            {consoleMessages.map((msg, index) => (
              <div
                key={index}
                className={`px-3 py-1.5 border-b border-[#1a1a1a] flex items-start gap-2 ${
                  msg.type === 'warning'
                    ? 'bg-[#3a2f1f] hover:bg-[#4a3f2f]'
                    : 'hover:bg-[#3f3f46]'
                }`}
              >
                <span className="text-[#666]">{msg.time}</span>
                <span
                  className={
                    msg.type === 'warning' ? 'text-[#ffd43b]' : 'text-[#aaa]'
                  }
                >
                  {msg.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
