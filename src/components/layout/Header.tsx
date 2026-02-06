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
    <header className="flex items-center justify-between h-16 px-6 bg-slate-900 border-b border-slate-800">
      {/* Left: Workspace Selector */}
      <div className="relative">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-2 px-3 py-2 text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <span className="font-medium">
            {workspace?.name || 'Select Workspace'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {showWorkspaceMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowWorkspaceMenu(false)}
            />
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-20">
              <div className="p-2">
                {workspacesData?.data.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      navigateToWorkspace(ws.id);
                      setShowWorkspaceMenu(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                      ws.id === workspace?.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    )}
                  >
                    <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-lg">
                      {ws.icon || ws.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{ws.name}</p>
                      <p className="text-xs text-slate-400">
                        {ws.sourcesCount} sources
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-700 p-2">
                <button
                  onClick={() => {
                    navigate(ROUTES.WORKSPACES);
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors text-left"
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
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
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
            className="flex items-center gap-2 p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-20">
                <div className="p-3 border-b border-slate-700">
                  <p className="font-medium text-white truncate">{user?.name}</p>
                  <p className="text-sm text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
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
