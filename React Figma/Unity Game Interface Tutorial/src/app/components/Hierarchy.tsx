import { ChevronDown, ChevronRight, Search, Plus } from 'lucide-react';
import { useState } from 'react';

interface HierarchyItem {
  id: string;
  name: string;
  icon?: string;
  children?: HierarchyItem[];
  expanded?: boolean;
}

interface HierarchyProps {
  selectedObject: string;
  onSelectObject: (object: string) => void;
}

export function Hierarchy({ selectedObject, onSelectObject }: HierarchyProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<HierarchyItem[]>([
    {
      id: '1',
      name: 'Main Camera',
      icon: '📷',
      expanded: false,
    },
    {
      id: '2',
      name: 'Directional Light',
      icon: '💡',
      expanded: false,
    },
    {
      id: '3',
      name: 'Player',
      icon: '🎮',
      expanded: true,
      children: [
        {
          id: '3-1',
          name: 'PlayerModel',
          icon: '🧊',
        },
        {
          id: '3-2',
          name: 'PlayerCamera',
          icon: '📷',
        },
      ],
    },
    {
      id: '4',
      name: 'Environment',
      icon: '🌍',
      expanded: true,
      children: [
        {
          id: '4-1',
          name: 'Ground',
          icon: '🟫',
        },
        {
          id: '4-2',
          name: 'Sky',
          icon: '🌤️',
        },
        {
          id: '4-3',
          name: 'Buildings',
          icon: '🏢',
          expanded: false,
          children: [
            {
              id: '4-3-1',
              name: 'Building_01',
              icon: '🏗️',
            },
            {
              id: '4-3-2',
              name: 'Building_02',
              icon: '🏗️',
            },
          ],
        },
      ],
    },
    {
      id: '5',
      name: 'EventSystem',
      icon: '⚡',
    },
  ]);

  const toggleExpand = (itemId: string, parentItems: HierarchyItem[] = items): HierarchyItem[] => {
    return parentItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, expanded: !item.expanded };
      }
      if (item.children) {
        return { ...item, children: toggleExpand(itemId, item.children) };
      }
      return item;
    });
  };

  const handleToggle = (itemId: string) => {
    setItems(toggleExpand(itemId));
  };

  const renderItem = (item: HierarchyItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.expanded;
    const isSelected = selectedObject === item.name;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-[#3f3f46] transition-colors ${
            isSelected ? 'bg-[#2a5481]' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelectObject(item.name)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(item.id);
              }}
              className="size-4 flex items-center justify-center hover:bg-[#404040] rounded"
            >
              {isExpanded ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
            </button>
          ) : (
            <div className="size-4" />
          )}
          <span className="text-sm mr-1">{item.icon}</span>
          <span className="text-sm flex-1">{item.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#282828]">
      {/* Header */}
      <div className="bg-[#2b2b2b] border-b border-[#1a1a1a] px-3 py-2 flex items-center justify-between">
        <span className="text-sm">Hierarchy</span>
        <button className="hover:bg-[#3f3f46] p-1 rounded transition-colors" title="Create">
          <Plus className="size-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-[#1a1a1a]">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-[#999]" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-[#3f3f46] rounded px-7 py-1 text-sm focus:outline-none focus:border-[#0e639c]"
          />
        </div>
      </div>

      {/* Hierarchy Tree */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => renderItem(item))}
      </div>
    </div>
  );
}
