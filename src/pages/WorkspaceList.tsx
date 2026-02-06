import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FolderOpen } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { useWorkspaces, useCreateWorkspace } from '../hooks/useWorkspaces';
import { useToast } from '../contexts/ToastContext';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../config/constants';
import type { CreateWorkspaceRequest } from '../types';

export default function WorkspaceList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState<CreateWorkspaceRequest>({
    name: '',
    description: '',
  });

  const navigateToWorkspace = (id: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSPACE_ID, id);
    navigate(ROUTES.WORKSPACE_CHAT.replace(':workspaceId', id));
  };
  const { data, isLoading } = useWorkspaces({ search: search || undefined });
  const createWorkspace = useCreateWorkspace();
  const { success, error: showError } = useToast();

  const handleCreate = async () => {
    if (!newWorkspace.name.trim()) return;
    try {
      const created = await createWorkspace.mutateAsync(newWorkspace);
      setShowCreateModal(false);
      setNewWorkspace({ name: '', description: '' });
      success('Workspace created');
      navigateToWorkspace(created.id);
    } catch {
      showError('Failed to create workspace');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const workspaces = data?.data || [];

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Workspaces</h1>
            <p className="text-slate-400">
              Manage your knowledge bases and collaborate with your team
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            New Workspace
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <Input
            placeholder="Search workspaces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Grid */}
        {workspaces.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-6 w-6" />}
            title="No workspaces yet"
            description="Create your first workspace to start building your knowledge base"
            action={
              <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Create Workspace
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                hover
                onClick={() => navigateToWorkspace(workspace.id)}
                className="cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-xl">
                    {workspace.icon || workspace.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate mb-1">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                        {workspace.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <Badge variant="default" size="sm">
                        {workspace.sourcesCount} sources
                      </Badge>
                      <Badge variant="default" size="sm">
                        {workspace.membersCount} members
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Workspace"
        >
          <div className="space-y-4">
            <Input
              label="Name"
              placeholder="My Knowledge Base"
              value={newWorkspace.name}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
            />
            <Input
              label="Description (optional)"
              placeholder="A brief description..."
              value={newWorkspace.description || ''}
              onChange={(e) =>
                setNewWorkspace({ ...newWorkspace, description: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              isLoading={createWorkspace.isPending}
              disabled={!newWorkspace.name.trim()}
            >
              Create
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
