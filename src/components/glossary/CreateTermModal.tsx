import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { CreateGlossaryTermRequest, UpdateGlossaryTermRequest, GlossaryTermDto } from '../../types';

interface CreateTermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGlossaryTermRequest | UpdateGlossaryTermRequest) => Promise<boolean>;
  categories?: string[];
  editTerm?: GlossaryTermDto | null;
}

export function CreateTermModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  editTerm,
}: CreateTermModalProps) {
  const [term, setTerm] = useState(editTerm?.term ?? '');
  const [definition, setDefinition] = useState(editTerm?.definition ?? '');
  const [category, setCategory] = useState(editTerm?.category ?? '');
  const [aliasesInput, setAliasesInput] = useState(editTerm?.aliases.join(', ') ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const aliases = aliasesInput
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const data: CreateGlossaryTermRequest = {
        term,
        definition,
        ...(category && { category }),
        ...(aliases.length > 0 && { aliases }),
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
    setTerm('');
    setDefinition('');
    setCategory('');
    setAliasesInput('');
    onClose();
  };

  const isValid = term.trim().length > 0 && definition.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editTerm ? 'Edit Term' : 'Add Term'} size="lg">
      <div className="space-y-4">
        <Input
          label="Term"
          placeholder="Enter term..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-[#A0A0A0] mb-1">
            Definition
          </label>
          <textarea
            className="w-full px-4 py-2 bg-[#141414] border border-[#2A2A2A] rounded text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent resize-none"
            rows={4}
            placeholder="Enter definition..."
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-[#A0A0A0] mb-1">
            Category
          </label>
          {categories.length > 0 ? (
            <div className="flex gap-2">
              <select
                className="flex-1 px-4 py-2 bg-[#141414] border border-[#2A2A2A] rounded text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select or type new...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Input
                placeholder="New category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1"
              />
            </div>
          ) : (
            <Input
              placeholder="e.g. Technical, Business, Legal..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          )}
        </div>

        <Input
          label="Aliases (comma-separated)"
          placeholder="e.g. ML, machine learning"
          value={aliasesInput}
          onChange={(e) => setAliasesInput(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#2A2A2A]">
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid} isLoading={isLoading}>
          {editTerm ? 'Update Term' : 'Add Term'}
        </Button>
      </div>
    </Modal>
  );
}
