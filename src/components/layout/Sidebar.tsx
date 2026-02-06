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
    section: 'navigate',
  },
  {
    name: 'Sources',
    icon: FileText,
    path: (id: string) => ROUTES.WORKSPACE_SOURCES.replace(':workspaceId', id),
    section: 'navigate',
  },
  {
    name: 'Entities',
    icon: Users,
    path: (id: string) => ROUTES.WORKSPACE_ENTITIES.replace(':workspaceId', id),
    section: 'navigate',
  },
  {
    name: 'Glossary',
    icon: BookOpen,
    path: (id: string) => ROUTES.WORKSPACE_GLOSSARY.replace(':workspaceId', id),
    section: 'navigate',
  },
  {
    name: 'Insights',
    icon: Lightbulb,
    path: (id: string) => ROUTES.WORKSPACE_INSIGHTS.replace(':workspaceId', id),
    section: 'navigate',
  },
  {
    name: 'Settings',
    icon: Settings,
    path: (id: string) => ROUTES.WORKSPACE_SETTINGS.replace(':workspaceId', id),
    section: 'workspace',
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  if (!workspaceId) return null;

  const navigateItems = navItems.filter((i) => i.section === 'navigate');
  const workspaceItems = navItems.filter((i) => i.section === 'workspace');

  return (
    <aside
      className={cn(
        'flex flex-col bg-[#141414] border-r border-[#2A2A2A] transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#2A2A2A]">
        {!isCollapsed && (
          <span className="text-sm font-semibold tracking-[0.15em] uppercase text-[#E80ADE]" style={{ fontFamily: 'var(--font-heading)' }}>
            Vault
          </span>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-[#666666] hover:text-[#F5F5F5] hover:bg-[#1C1C1C] rounded-sm transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        {/* Navigate Section */}
        {!isCollapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#666666]" style={{ fontFamily: 'var(--font-heading)' }}>
            Navigate
          </p>
        )}
        <div className="space-y-0.5 mb-6">
          {navigateItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path(workspaceId)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 transition-colors relative',
                  isActive
                    ? 'text-[#E80ADE] bg-[rgba(232,10,222,0.08)]'
                    : 'text-[#A0A0A0] hover:bg-[#1C1C1C] hover:text-[#F5F5F5]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#E80ADE]" />
                  )}
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Workspace Section */}
        {!isCollapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#666666]" style={{ fontFamily: 'var(--font-heading)' }}>
            Workspace
          </p>
        )}
        <div className="space-y-0.5">
          {workspaceItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path(workspaceId)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 transition-colors relative',
                  isActive
                    ? 'text-[#E80ADE] bg-[rgba(232,10,222,0.08)]'
                    : 'text-[#A0A0A0] hover:bg-[#1C1C1C] hover:text-[#F5F5F5]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#E80ADE]" />
                  )}
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
