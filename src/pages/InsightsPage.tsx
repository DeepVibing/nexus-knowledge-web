import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Lightbulb } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { InsightCard } from '../components/insights/InsightCard';
import { InsightStatsBar } from '../components/insights/InsightStatsBar';
import { CreateInsightModal } from '../components/insights/CreateInsightModal';
import {
  useInsights,
  useInsightStats,
  useCreateInsight,
  useUpdateInsight,
  useDeleteInsight,
} from '../hooks/useInsights';
import { useToast } from '../contexts/ToastContext';
import type { InsightDto, InsightType, InsightStatus, CreateInsightRequest, UpdateInsightRequest } from '../types';

const typeOptions: { value: InsightType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'decision', label: 'Decisions' },
  { value: 'action_item', label: 'Action Items' },
  { value: 'finding', label: 'Findings' },
  { value: 'question', label: 'Questions' },
];

export default function InsightsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<InsightType | ''>('');
  const [statusFilter, setStatusFilter] = useState<InsightStatus | undefined>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editInsight, setEditInsight] = useState<InsightDto | null>(null);

  const { data, isLoading } = useInsights(workspaceId, {
    search: search || undefined,
    type: typeFilter || undefined,
    status: statusFilter,
  });
  const { data: stats } = useInsightStats(workspaceId);
  const createInsight = useCreateInsight();
  const updateInsight = useUpdateInsight();
  const deleteInsight = useDeleteInsight();
  const { success, error: showError } = useToast();

  const handleCreate = async (formData: CreateInsightRequest | UpdateInsightRequest) => {
    if (!workspaceId) return false;
    try {
      await createInsight.mutateAsync({ workspaceId, data: formData as CreateInsightRequest });
      success('Insight added successfully');
      return true;
    } catch {
      showError('Failed to add insight');
      return false;
    }
  };

  const handleUpdate = async (formData: CreateInsightRequest | UpdateInsightRequest) => {
    if (!workspaceId || !editInsight) return false;
    try {
      await updateInsight.mutateAsync({
        workspaceId,
        insightId: editInsight.id,
        data: formData as UpdateInsightRequest,
      });
      success('Insight updated successfully');
      return true;
    } catch {
      showError('Failed to update insight');
      return false;
    }
  };

  const handleDelete = async (insightId: string) => {
    if (!workspaceId) return;
    if (!confirm('Are you sure you want to delete this insight?')) return;
    try {
      await deleteInsight.mutateAsync({ workspaceId, insightId });
      success('Insight deleted');
    } catch {
      showError('Failed to delete insight');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const insights = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-wide text-[#F5F5F5]">Insights</h1>
        <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Insight
        </Button>
      </div>

      {/* Stats Bar */}
      {stats && (
        <InsightStatsBar
          stats={stats}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="max-w-md flex-1">
          <Input
            placeholder="Search insights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <select
          className="px-4 py-2 bg-[#141414] border border-[#2A2A2A] rounded text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as InsightType | '')}
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Insights List */}
      {insights.length === 0 ? (
        <EmptyState
          icon={<Lightbulb className="h-6 w-6" />}
          title="No insights yet"
          description="Capture decisions, action items, and findings from your conversations"
          action={
            <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Add Insight
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onEdit={() => setEditInsight(insight)}
              onDelete={() => handleDelete(insight.id)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateInsightModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      {editInsight && (
        <CreateInsightModal
          isOpen={!!editInsight}
          onClose={() => setEditInsight(null)}
          onSubmit={handleUpdate}
          editInsight={editInsight}
        />
      )}
    </div>
  );
}
