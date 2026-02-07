import { Loader2, Sparkles, Calendar, Tag, Hash, FileText, Image, Eye, Type, Users, Info } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { useSourceAnalysis, useAnalyzeSource } from '../../hooks/useSources';
import { useToast } from '../../contexts/ToastContext';
import type { SourceDto, SourceStatus, DetectedEntityDto } from '../../types';

interface SourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: SourceDto | null;
  workspaceId: string;
}

const statusVariants: Record<SourceStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  analyzing: 'info',
  transcribing: 'info',
  ready: 'success',
  failed: 'error',
  stale: 'warning',
};

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="w-20 h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
      <div
        className={cn(
          'h-full rounded-full transition-all',
          value >= 0.8 ? 'bg-emerald-500' : value >= 0.5 ? 'bg-amber-500' : 'bg-red-500'
        )}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

function EntityRow({ entity }: { entity: DetectedEntityDto }) {
  return (
    <tr className="border-b border-[#2A2A2A] last:border-0">
      <td className="py-2 pr-3 text-sm text-[#F5F5F5]">{entity.name}</td>
      <td className="py-2 pr-3">
        <Badge variant="default" size="sm">{entity.type}</Badge>
      </td>
      <td className="py-2 pr-3">
        <div className="flex items-center gap-2">
          <ConfidenceBar value={entity.confidence} />
          <span className="text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
            {Math.round(entity.confidence * 100)}%
          </span>
        </div>
      </td>
    </tr>
  );
}

export function SourceDetailModal({ isOpen, onClose, source, workspaceId }: SourceDetailModalProps) {
  const isImage = source?.sourceType === 'image';
  const { data: analysis, isLoading: isLoadingAnalysis } = useSourceAnalysis(
    isImage ? workspaceId : undefined,
    isImage ? source?.id : undefined
  );
  const analyzeSource = useAnalyzeSource();
  const { success, error: showError } = useToast();

  const handleAnalyze = async () => {
    if (!source) return;
    try {
      await analyzeSource.mutateAsync({ workspaceId, sourceId: source.id });
      success('Analysis started');
    } catch {
      showError('Failed to start analysis');
    }
  };

  if (!source) return null;

  const hasAnalysis = analysis && analysis.status === 'completed';
  const isAnalyzing = source.status === 'analyzing' || analyzeSource.isPending;
  const canAnalyze = isImage && source.status === 'ready' && !hasAnalysis && !isAnalyzing;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={source.name} size="xl">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Header info */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={statusVariants[source.status]} size="sm">
            {source.status}
          </Badge>
          <Badge variant="default" size="sm">{source.sourceType}</Badge>
          {source.origin?.contentType && (
            <span className="text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
              {source.origin.contentType}
            </span>
          )}
        </div>

        {/* Processing stats */}
        {source.processing && (
          <div className="grid grid-cols-3 gap-4">
            {source.processing.chunksCount > 0 && (
              <div className="bg-[#0A0A0A] rounded-sm border border-[#2A2A2A] p-3">
                <div className="flex items-center gap-2 text-[#666666] text-xs mb-1">
                  <Hash className="h-3 w-3" />
                  Chunks
                </div>
                <div className="text-lg font-medium text-[#F5F5F5]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {source.processing.chunksCount}
                </div>
              </div>
            )}
            {source.processing.tokensCount > 0 && (
              <div className="bg-[#0A0A0A] rounded-sm border border-[#2A2A2A] p-3">
                <div className="flex items-center gap-2 text-[#666666] text-xs mb-1">
                  <Type className="h-3 w-3" />
                  Tokens
                </div>
                <div className="text-lg font-medium text-[#F5F5F5]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {source.processing.tokensCount.toLocaleString()}
                </div>
              </div>
            )}
            {source.processing.pagesCount != null && source.processing.pagesCount > 0 && (
              <div className="bg-[#0A0A0A] rounded-sm border border-[#2A2A2A] p-3">
                <div className="flex items-center gap-2 text-[#666666] text-xs mb-1">
                  <FileText className="h-3 w-3" />
                  Pages
                </div>
                <div className="text-lg font-medium text-[#F5F5F5]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {source.processing.pagesCount}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-6 text-sm text-[#666666]">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Created {new Date(source.createdAt).toLocaleDateString()}
          </span>
          {source.lastSyncedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Synced {new Date(source.lastSyncedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Tags */}
        {source.tags && source.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-3.5 w-3.5 text-[#666666]" />
            {source.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">{tag}</Badge>
            ))}
          </div>
        )}

        {/* === Image Analysis Panel === */}
        {isImage && (
          <div className="border-t border-[#2A2A2A] pt-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#F5F5F5] flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#E80ADE]" />
                Visual Analysis
              </h3>
              {canAnalyze && (
                <Button
                  size="sm"
                  onClick={handleAnalyze}
                  isLoading={analyzeSource.isPending}
                  leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                >
                  Analyze Image
                </Button>
              )}
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-sm text-[#E80ADE]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              )}
            </div>

            {isLoadingAnalysis && isImage && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#E80ADE]" />
              </div>
            )}

            {hasAnalysis && (
              <div className="space-y-4">
                {/* Caption */}
                {analysis.caption && (
                  <div className="bg-[#0A0A0A] rounded-sm border border-[#2A2A2A] p-4">
                    <div className="flex items-center gap-2 text-xs text-[#666666] mb-2">
                      <Image className="h-3 w-3" />
                      Caption
                    </div>
                    <p className="text-sm text-[#F5F5F5]">{analysis.caption}</p>
                  </div>
                )}

                {/* Detailed Description */}
                {analysis.detailedDescription && (
                  <div className="bg-[#0A0A0A] rounded-sm border border-[#2A2A2A] p-4">
                    <div className="flex items-center gap-2 text-xs text-[#666666] mb-2">
                      <Info className="h-3 w-3" />
                      Description
                    </div>
                    <p className="text-sm text-[#A0A0A0] leading-relaxed">{analysis.detailedDescription}</p>
                  </div>
                )}

                {/* Extracted Text (OCR) */}
                {analysis.extractedText && (
                  <div className="bg-[#0A0A0A] rounded-sm border border-[#2A2A2A] p-4">
                    <div className="flex items-center gap-2 text-xs text-[#666666] mb-2">
                      <Type className="h-3 w-3" />
                      Extracted Text
                    </div>
                    <pre className="text-sm text-[#A0A0A0] whitespace-pre-wrap max-h-48 overflow-y-auto" style={{ fontFamily: 'var(--font-mono)' }}>
                      {analysis.extractedText}
                    </pre>
                  </div>
                )}

                {/* Detected Entities */}
                {analysis.entities && analysis.entities.length > 0 && (
                  <div className="bg-[#0A0A0A] rounded-sm border border-[#2A2A2A] p-4">
                    <div className="flex items-center gap-2 text-xs text-[#666666] mb-3">
                      <Users className="h-3 w-3" />
                      Detected Entities ({analysis.entities.length})
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#2A2A2A] text-xs text-[#666666]">
                          <th className="text-left py-1.5 pr-3 font-medium">Name</th>
                          <th className="text-left py-1.5 pr-3 font-medium">Type</th>
                          <th className="text-left py-1.5 pr-3 font-medium">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.entities.map((entity, i) => (
                          <EntityRow key={`${entity.name}-${i}`} entity={entity} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Image Metadata */}
                {analysis.metadata && (
                  <div className="bg-[#0A0A0A] rounded-sm border border-[#2A2A2A] p-4">
                    <div className="flex items-center gap-2 text-xs text-[#666666] mb-3">
                      <Info className="h-3 w-3" />
                      Image Metadata
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {analysis.metadata.width != null && analysis.metadata.height != null && (
                        <div>
                          <span className="text-[#666666]">Dimensions: </span>
                          <span className="text-[#F5F5F5]" style={{ fontFamily: 'var(--font-mono)' }}>
                            {analysis.metadata.width} x {analysis.metadata.height}
                          </span>
                        </div>
                      )}
                      {analysis.metadata.format && (
                        <div>
                          <span className="text-[#666666]">Format: </span>
                          <span className="text-[#F5F5F5]" style={{ fontFamily: 'var(--font-mono)' }}>
                            {analysis.metadata.format}
                          </span>
                        </div>
                      )}
                      {analysis.metadata.detectedLanguages && analysis.metadata.detectedLanguages.length > 0 && (
                        <div>
                          <span className="text-[#666666]">Languages: </span>
                          <span className="text-[#F5F5F5]">
                            {analysis.metadata.detectedLanguages.join(', ')}
                          </span>
                        </div>
                      )}
                      {analysis.metadata.tags && analysis.metadata.tags.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-[#666666]">Tags: </span>
                          <span className="inline-flex gap-1.5 flex-wrap mt-1">
                            {analysis.metadata.tags.map((tag) => (
                              <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No analysis yet and not analyzing */}
            {!hasAnalysis && !isAnalyzing && !isLoadingAnalysis && source.status === 'ready' && (
              <div className="text-center py-6 text-sm text-[#666666]">
                No analysis yet. Click "Analyze Image" to extract visual intelligence.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
