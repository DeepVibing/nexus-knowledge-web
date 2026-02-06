import { useParams } from 'react-router-dom';
import { Settings, Users, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { PageLoader } from '../components/common/Spinner';
import { useWorkspace, useWorkspaceMembers, useUpdateWorkspace, useDeleteWorkspace } from '../hooks/useWorkspaces';
import { useToast } from '../contexts/ToastContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';

export default function SettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { data: workspace, isLoading } = useWorkspace(workspaceId);
  const { data: members } = useWorkspaceMembers(workspaceId);
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const { success, error: showError } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Initialize form when workspace loads
  if (workspace && !name && !description) {
    setName(workspace.name);
    setDescription(workspace.description || '');
  }

  const handleSave = async () => {
    if (!workspaceId) return;
    try {
      await updateWorkspace.mutateAsync({
        id: workspaceId,
        data: { name, description },
      });
      success('Settings saved');
    } catch {
      showError('Failed to save settings');
    }
  };

  const handleDelete = async () => {
    if (!workspaceId) return;
    if (!confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteWorkspace.mutateAsync(workspaceId);
      success('Workspace deleted');
      navigate(ROUTES.WORKSPACES);
    } catch {
      showError('Failed to delete workspace');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-medium tracking-wide text-[#F5F5F5]">Settings</h1>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#666666]" />
            <CardTitle>General</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Workspace Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button onClick={handleSave} isLoading={updateWorkspace.isPending}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#666666]" />
            <CardTitle>Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members?.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between py-2 border-b border-[#2A2A2A] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#E80ADE] flex items-center justify-center text-white font-medium text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[#F5F5F5] text-sm">{member.name}</p>
                    <p className="text-xs text-[#666666]">{member.email}</p>
                  </div>
                </div>
                <Badge variant="default">{member.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-400" />
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[#666666] mb-4 text-sm">
            Permanently delete this workspace and all of its data. This action cannot be undone.
          </p>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteWorkspace.isPending}
          >
            Delete Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
