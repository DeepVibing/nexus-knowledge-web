import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, FileText } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { SourceCard } from '../components/sources/SourceCard';
import { UploadSourceModal } from '../components/sources/UploadSourceModal';
import { useSources, useUploadSource, useAddSourceUrl, useDeleteSource, useSyncSource } from '../hooks/useSources';
import { useToast } from '../contexts/ToastContext';

export default function SourcesPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data, isLoading } = useSources(workspaceId, { search: search || undefined });
  const uploadSource = useUploadSource();
  const addSourceUrl = useAddSourceUrl();
  const deleteSource = useDeleteSource();
  const syncSource = useSyncSource();
  const { success, error: showError } = useToast();

  const handleUpload = async (file: File, name?: string) => {
    if (!workspaceId) return;
    try {
      await uploadSource.mutateAsync({ workspaceId, file, name });
      success('Source uploaded successfully');
    } catch {
      showError('Failed to upload source');
      throw new Error('Upload failed');
    }
  };

  const handleAddUrl = async (url: string, name?: string) => {
    if (!workspaceId) return;
    try {
      await addSourceUrl.mutateAsync({ workspaceId, data: { url, name } });
      success('URL added successfully');
    } catch {
      showError('Failed to add URL');
      throw new Error('Add URL failed');
    }
  };

  const handleDelete = async (sourceId: string) => {
    if (!workspaceId) return;
    if (!confirm('Are you sure you want to delete this source?')) return;
    try {
      await deleteSource.mutateAsync({ workspaceId, sourceId });
      success('Source deleted');
    } catch {
      showError('Failed to delete source');
    }
  };

  const handleSync = async (sourceId: string) => {
    if (!workspaceId) return;
    try {
      await syncSource.mutateAsync({ workspaceId, sourceId });
      success('Sync started');
    } catch {
      showError('Failed to start sync');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const sources = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Sources</h1>
        <Button onClick={() => setShowUploadModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Source
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search sources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* List */}
      {sources.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No sources yet"
          description="Upload documents, add URLs, or connect integrations to build your knowledge base"
          action={
            <Button onClick={() => setShowUploadModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Add Source
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              onSync={() => handleSync(source.id)}
              onDelete={() => handleDelete(source.id)}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <UploadSourceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        onAddUrl={handleAddUrl}
      />
    </div>
  );
}
