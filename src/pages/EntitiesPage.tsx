import { useParams } from 'react-router-dom';
import { EntityBrowser } from '../components/entities/EntityBrowser';
import { useEntities, useExtractEntities } from '../hooks/useEntities';
import { useToast } from '../contexts/ToastContext';

export default function EntitiesPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data, isLoading } = useEntities(workspaceId);
  const extractEntities = useExtractEntities();
  const { success, error: showError } = useToast();

  const handleExtract = async () => {
    if (!workspaceId) return;
    try {
      await extractEntities.mutateAsync({ workspaceId, data: {} });
      success('Entity extraction started');
    } catch {
      showError('Failed to start entity extraction');
    }
  };

  return (
    <EntityBrowser
      entities={data?.data || []}
      isLoading={isLoading}
      onExtractEntities={handleExtract}
    />
  );
}
