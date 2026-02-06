import { useState, useCallback } from 'react';
import { Upload, X, FileText, Link as LinkIcon } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { cn } from '../../lib/utils';

interface UploadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, name?: string) => Promise<boolean>;
  onAddUrl: (url: string, name?: string) => Promise<boolean>;
}

type TabType = 'upload' | 'url';

export function UploadSourceModal({
  isOpen,
  onClose,
  onUpload,
  onAddUrl,
}: UploadSourceModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (!name) {
        setName(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  }, [name]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let ok = false;
      if (activeTab === 'upload' && file) {
        ok = await onUpload(file, name || undefined);
      } else if (activeTab === 'url' && url) {
        ok = await onAddUrl(url, name || undefined);
      }
      if (ok) {
        handleClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUrl('');
    setName('');
    onClose();
  };

  const isValid =
    (activeTab === 'upload' && file) ||
    (activeTab === 'url' && url.trim().length > 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Source" size="lg">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-sm transition-colors text-sm',
            activeTab === 'upload'
              ? 'bg-[#E80ADE] text-white'
              : 'bg-[#1C1C1C] text-[#A0A0A0] hover:bg-[#2A2A2A]'
          )}
        >
          <Upload className="h-4 w-4" />
          Upload File
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-sm transition-colors text-sm',
            activeTab === 'url'
              ? 'bg-[#E80ADE] text-white'
              : 'bg-[#1C1C1C] text-[#A0A0A0] hover:bg-[#2A2A2A]'
          )}
        >
          <LinkIcon className="h-4 w-4" />
          Add URL
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={cn(
              'border-2 border-dashed rounded-sm p-8 text-center transition-colors',
              isDragging
                ? 'border-[#E80ADE] bg-[rgba(232,10,222,0.08)]'
                : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
            )}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-[#E80ADE]" />
                <div className="text-left">
                  <p className="font-medium text-[#F5F5F5]">{file.name}</p>
                  <p className="text-sm text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 text-[#666666] hover:text-[#F5F5F5]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-[#666666] mx-auto mb-3" />
                <p className="text-[#A0A0A0] mb-1">
                  Drop a file here or{' '}
                  <label className="text-[#E80ADE] hover:text-[#D000CC] cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.txt,.md,.doc,.docx"
                    />
                  </label>
                </p>
                <p className="text-sm text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
                  PDF, TXT, MD, DOC, DOCX (max 100MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL Tab */}
      {activeTab === 'url' && (
        <div className="space-y-4">
          <Input
            label="URL"
            placeholder="https://example.com/page"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}

      {/* Name Field */}
      <div className="mt-4">
        <Input
          label="Name (optional)"
          placeholder="Source name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#2A2A2A]">
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid} isLoading={isLoading}>
          Add Source
        </Button>
      </div>
    </Modal>
  );
}
