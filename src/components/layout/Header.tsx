import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, LogOut, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useWorkspaceContext } from '../../contexts/WorkspaceContext';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { Input } from '../common/Input';
import { ROUTES } from '../../config/constants';
import { cn } from '../../lib/utils';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { workspace, navigateToWorkspace } = useWorkspaceContext();
  const { data: workspacesData } = useWorkspaces();

  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[#141414] border-b border-[#2A2A2A]">
      {/* Left: Workspace Selector */}
      <div className="relative">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-2 px-3 py-2 text-[#F5F5F5] bg-[#1C1C1C] hover:bg-[#2A2A2A] rounded-sm transition-colors border border-[#2A2A2A]"
        >
          <span className="font-medium text-sm">
            {workspace?.name || 'Select Workspace'}
          </span>
          <ChevronDown className="h-4 w-4 text-[#666666]" />
        </button>

        {showWorkspaceMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowWorkspaceMenu(false)}
            />
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#1C1C1C] border border-[#2A2A2A] rounded-sm shadow-lg z-20">
              <div className="p-2">
                {workspacesData?.data.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      navigateToWorkspace(ws.id);
                      setShowWorkspaceMenu(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-sm text-left transition-colors',
                      ws.id === workspace?.id
                        ? 'bg-[rgba(232,10,222,0.08)] text-[#E80ADE]'
                        : 'text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-[#F5F5F5]'
                    )}
                  >
                    <div className="w-8 h-8 rounded-sm bg-[#2A2A2A] flex items-center justify-center text-lg">
                      {ws.icon || ws.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{ws.name}</p>
                      <p className="text-xs text-[#666666]">
                        {ws.sourcesCount} sources
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-[#2A2A2A] p-2">
                <button
                  onClick={() => {
                    navigate(ROUTES.WORKSPACES);
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-[#E80ADE] hover:bg-[#2A2A2A] rounded-sm transition-colors text-left"
                >
                  Manage Workspaces
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-8">
        <Input
          placeholder="Search..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Right: User Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-[#666666] hover:text-[#F5F5F5] hover:bg-[#1C1C1C] rounded-sm transition-colors"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 hover:bg-[#1C1C1C] rounded-sm transition-colors"
          >
            <div className="w-8 h-8 rounded-sm bg-[#E80ADE] flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#1C1C1C] border border-[#2A2A2A] rounded-sm shadow-lg z-20">
                <div className="p-3 border-b border-[#2A2A2A]">
                  <p className="font-medium text-[#F5F5F5] text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-[#666666] truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[#A0A0A0] hover:bg-[#2A2A2A] rounded-sm transition-colors text-sm"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-[#2A2A2A] rounded-sm transition-colors text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
