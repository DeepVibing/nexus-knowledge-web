import { NavLink, useParams } from 'react-router-dom';
import {
  MessageSquare,
  FileText,
  Users,
  BookOpen,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ROUTES } from '../../config/constants';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    name: 'Chat',
    icon: MessageSquare,
    path: (id: string) => ROUTES.WORKSPACE_CHAT.replace(':workspaceId', id),
  },
  {
    name: 'Sources',
    icon: FileText,
    path: (id: string) => ROUTES.WORKSPACE_SOURCES.replace(':workspaceId', id),
  },
  {
    name: 'Entities',
    icon: Users,
    path: (id: string) => ROUTES.WORKSPACE_ENTITIES.replace(':workspaceId', id),
  },
  {
    name: 'Glossary',
    icon: BookOpen,
    path: (id: string) => ROUTES.WORKSPACE_GLOSSARY.replace(':workspaceId', id),
  },
  {
    name: 'Insights',
    icon: Lightbulb,
    path: (id: string) => ROUTES.WORKSPACE_INSIGHTS.replace(':workspaceId', id),
  },
  {
    name: 'Settings',
    icon: Settings,
    path: (id: string) => ROUTES.WORKSPACE_SETTINGS.replace(':workspaceId', id),
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  if (!workspaceId) return null;

  return (
    <aside
      className={cn(
        'flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        {!isCollapsed && (
          <span className="text-lg font-semibold text-white">Knowledge</span>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path(workspaceId)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
