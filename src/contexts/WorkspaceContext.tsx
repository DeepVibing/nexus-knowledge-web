import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../config/constants';
import { useWorkspace } from '../hooks/useWorkspaces';
import type { WorkspaceDetailDto } from '../types';

interface WorkspaceContextType {
  workspaceId: string | null;
  workspace: WorkspaceDetailDto | null;
  isLoading: boolean;
  error: Error | null;
  setWorkspaceId: (id: string | null) => void;
  navigateToWorkspace: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { workspaceId: urlWorkspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();

  const [workspaceId, setWorkspaceIdState] = useState<string | null>(() => {
    // First check URL, then localStorage
    return urlWorkspaceId || localStorage.getItem(LOCAL_STORAGE_KEYS.WORKSPACE_ID);
  });

  // Fetch workspace details
  const {
    data: workspace,
    isLoading,
    error,
  } = useWorkspace(workspaceId ?? undefined);

  // Sync URL workspace ID to state
  useEffect(() => {
    if (urlWorkspaceId && urlWorkspaceId !== workspaceId) {
      setWorkspaceIdState(urlWorkspaceId);
      localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE_ID, urlWorkspaceId);
    }
  }, [urlWorkspaceId, workspaceId]);

  const setWorkspaceId = useCallback((id: string | null) => {
    setWorkspaceIdState(id);
    if (id) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE_ID, id);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.WORKSPACE_ID);
    }
  }, []);

  const navigateToWorkspace = useCallback(
    (id: string) => {
      setWorkspaceId(id);
      navigate(ROUTES.WORKSPACE_CHAT.replace(':workspaceId', id));
    },
    [navigate, setWorkspaceId]
  );

  const value: WorkspaceContextType = {
    workspaceId,
    workspace: workspace ?? null,
    isLoading,
    error: error as Error | null,
    setWorkspaceId,
    navigateToWorkspace,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceContext(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}
