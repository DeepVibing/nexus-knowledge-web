import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, BookOpen } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { GlossaryTermCard } from '../components/glossary/GlossaryTermCard';
import { CreateTermModal } from '../components/glossary/CreateTermModal';
import {
  useGlossaryTerms,
  useGlossaryCategories,
  useCreateGlossaryTerm,
  useUpdateGlossaryTerm,
  useDeleteGlossaryTerm,
} from '../hooks/useGlossary';
import { useToast } from '../contexts/ToastContext';
import type { GlossaryTermDto, CreateGlossaryTermRequest, UpdateGlossaryTermRequest } from '../types';
import { cn } from '../lib/utils';

export default function GlossaryPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTerm, setEditTerm] = useState<GlossaryTermDto | null>(null);
  const [deletingTermId, setDeletingTermId] = useState<string | null>(null);

  const { data, isLoading } = useGlossaryTerms(workspaceId, {
    search: search || undefined,
    category: categoryFilter || undefined,
  });
  const { data: categories } = useGlossaryCategories(workspaceId);
  const createTerm = useCreateGlossaryTerm();
  const updateTerm = useUpdateGlossaryTerm();
  const deleteTerm = useDeleteGlossaryTerm();
  const { success, error: showError } = useToast();

  const handleCreate = async (formData: CreateGlossaryTermRequest | UpdateGlossaryTermRequest) => {
    if (!workspaceId) return false;
    try {
      await createTerm.mutateAsync({ workspaceId, data: formData as CreateGlossaryTermRequest });
      success('Term added successfully');
      return true;
    } catch {
      showError('Failed to add term');
      return false;
    }
  };

  const handleUpdate = async (formData: CreateGlossaryTermRequest | UpdateGlossaryTermRequest) => {
    if (!workspaceId || !editTerm) return false;
    try {
      await updateTerm.mutateAsync({
        workspaceId,
        termId: editTerm.id,
        data: formData as UpdateGlossaryTermRequest,
      });
      success('Term updated successfully');
      return true;
    } catch {
      showError('Failed to update term');
      return false;
    }
  };

  const handleDelete = async (termId: string) => {
    if (!workspaceId) return;
    if (!confirm('Are you sure you want to delete this term?')) return;
    setDeletingTermId(termId);
    try {
      await deleteTerm.mutateAsync({ workspaceId, termId });
      success('Term deleted');
    } catch {
      showError('Failed to delete term');
    } finally {
      setDeletingTermId(null);
    }
  };

  // Group terms alphabetically
  const groupedTerms = useMemo(() => {
    const terms = data?.data || [];
    const groups: Record<string, GlossaryTermDto[]> = {};

    for (const term of terms) {
      const letter = term.term.charAt(0).toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(term);
    }

    // Sort letters and terms within each group
    const sortedKeys = Object.keys(groups).sort();
    const sorted: { letter: string; terms: GlossaryTermDto[] }[] = [];
    for (const key of sortedKeys) {
      sorted.push({
        letter: key,
        terms: groups[key].sort((a, b) => a.term.localeCompare(b.term)),
      });
    }
    return sorted;
  }, [data]);

  if (isLoading) {
    return <PageLoader />;
  }

  const terms = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-wide text-[#F5F5F5]">Glossary</h1>
        <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Term
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="max-w-md flex-1">
          <Input
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        {categories && categories.length > 0 && (
          <select
            className="px-4 py-2 bg-[#141414] border border-[#2A2A2A] rounded text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Terms List */}
      {terms.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="No glossary terms yet"
          description="Define key terms and concepts for your knowledge base"
          action={
            <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Add Term
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {groupedTerms.map(({ letter, terms: groupTerms }) => (
            <div key={letter}>
              {/* Letter Header */}
              <div className={cn(
                'flex items-center gap-3 mb-4',
                'border-b border-[#2A2A2A] pb-2'
              )}>
                <span
                  className="text-xl font-bold text-[#E80ADE] tracking-wider"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {letter}
                </span>
                <span className="text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {groupTerms.length} {groupTerms.length === 1 ? 'term' : 'terms'}
                </span>
              </div>

              {/* Terms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupTerms.map((term) => (
                  <GlossaryTermCard
                    key={term.id}
                    term={term}
                    onEdit={() => setEditTerm(term)}
                    onDelete={() => handleDelete(term.id)}
                    isDeleting={deletingTermId === term.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateTermModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        categories={categories}
      />

      {/* Edit Modal */}
      {editTerm && (
        <CreateTermModal
          isOpen={!!editTerm}
          onClose={() => setEditTerm(null)}
          onSubmit={handleUpdate}
          categories={categories}
          editTerm={editTerm}
        />
      )}
    </div>
  );
}
