import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { CreateInsightRequest, UpdateInsightRequest, InsightDto, InsightType } from '../../types';

interface CreateInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInsightRequest | UpdateInsightRequest) => Promise<boolean>;
  editInsight?: InsightDto | null;
}

const insightTypes: { value: InsightType; label: string }[] = [
  { value: 'decision', label: 'Decision' },
  { value: 'action_item', label: 'Action Item' },
  { value: 'finding', label: 'Finding' },
  { value: 'question', label: 'Question' },
];

export function CreateInsightModal({
  isOpen,
  onClose,
  onSubmit,
  editInsight,
}: CreateInsightModalProps) {
  const [type, setType] = useState<InsightType>(editInsight?.type ?? 'finding');
  const [title, setTitle] = useState(editInsight?.title ?? '');
  const [content, setContent] = useState(editInsight?.content ?? '');
  const [assignee, setAssignee] = useState(editInsight?.assignee ?? '');
  const [dueDate, setDueDate] = useState(editInsight?.dueDate?.split('T')[0] ?? '');
  const [tagsInput, setTagsInput] = useState(editInsight?.tags.join(', ') ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const data: CreateInsightRequest = {
        type,
        title,
        content,
        ...(assignee && { assignee }),
        ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
        ...(tags.length > 0 && { tags }),
      };

      const ok = await onSubmit(data);
      if (ok) {
        handleClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setType('finding');
    setTitle('');
    setContent('');
    setAssignee('');
    setDueDate('');
    setTagsInput('');
    onClose();
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editInsight ? 'Edit Insight' : 'Add Insight'} size="lg">
      <div className="space-y-4">
        {/* Type Select */}
        <div className="w-full">
          <label className="block text-sm font-medium text-[#A0A0A0] mb-1">Type</label>
          <select
            className="w-full px-4 py-2 bg-[#141414] border border-[#2A2A2A] rounded text-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent"
            value={type}
            onChange={(e) => setType(e.target.value as InsightType)}
          >
            {insightTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Title"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-[#A0A0A0] mb-1">Content</label>
          <textarea
            className="w-full px-4 py-2 bg-[#141414] border border-[#2A2A2A] rounded text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent resize-none"
            rows={4}
            placeholder="Describe the insight..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Assignee"
            placeholder="Who is responsible?"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1">Due Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-[#141414] border border-[#2A2A2A] rounded text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <Input
          label="Tags (comma-separated)"
          placeholder="e.g. architecture, priority, sprint-1"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#2A2A2A]">
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid} isLoading={isLoading}>
          {editInsight ? 'Update Insight' : 'Add Insight'}
        </Button>
      </div>
    </Modal>
  );
}
