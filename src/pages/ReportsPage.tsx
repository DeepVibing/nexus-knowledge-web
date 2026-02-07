import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Plus,
  FileBarChart,
  Download,
  Trash2,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Network,
  BookOpen,
  Lightbulb,
  BookA,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import {
  useReports,
  useGenerateReport,
  useReportJobStatus,
  useDeleteReport,
} from '../hooks/useReports';
import { useToast } from '../contexts/ToastContext';
import type {
  ReportType,
  CreateReportRequest,
  ReportSummaryDto,
} from '../types';
import { REPORT_TYPES } from '../types/report';

const REPORT_TYPE_ICONS: Record<string, React.ReactNode> = {
  executive_summary: <FileText className="h-5 w-5" />,
  entity_map: <Network className="h-5 w-5" />,
  source_digest: <BookOpen className="h-5 w-5" />,
  insights_report: <Lightbulb className="h-5 w-5" />,
  glossary_reference: <BookA className="h-5 w-5" />,
  knowledge_timeline: <Clock className="h-5 w-5" />,
};

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { icon: <Clock className="h-3.5 w-3.5" />, color: 'text-[#666666]', label: 'Pending' },
  generating: { icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, color: 'text-[#E80ADE]', label: 'Generating' },
  completed: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'text-emerald-400', label: 'Completed' },
  failed: { icon: <XCircle className="h-3.5 w-3.5" />, color: 'text-red-400', label: 'Failed' },
};

function ReportCard({
  report,
  onDelete,
  isDeleting,
}: {
  report: ReportSummaryDto;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const statusCfg = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;
  const typeInfo = REPORT_TYPES.find((t) => t.type === report.type);
  const isExpired = report.expiresAt ? new Date(report.expiresAt) < new Date() : false;

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 hover:border-[#E80ADE] hover:shadow-[0_0_15px_rgba(232,10,222,0.08)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-[#E80ADE]">
            {REPORT_TYPE_ICONS[report.type] || <FileBarChart className="h-5 w-5" />}
          </div>
          <Badge variant="default">{typeInfo?.label || report.type}</Badge>
        </div>
        <div className={`flex items-center gap-1 ${statusCfg.color}`}>
          {statusCfg.icon}
          <span className="text-xs">{statusCfg.label}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-[#F5F5F5] mb-2 line-clamp-2">{report.title}</h3>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-[#666666] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
        <span>{report.sourceCount} sources</span>
        <span className="text-[#E80ADE]">/</span>
        <span>{report.entityCount} entities</span>
        {report.totalSizeMb > 0 && (
          <>
            <span className="text-[#E80ADE]">/</span>
            <span>{report.totalSizeMb.toFixed(1)} MB</span>
          </>
        )}
      </div>

      {/* Date + Expiry */}
      <div className="text-xs text-[#666666] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
        {new Date(report.createdAt).toLocaleDateString()}
        {report.expiresAt && (
          <span className={isExpired ? 'text-red-400 ml-2' : 'ml-2'}>
            {isExpired ? '(Expired)' : `Expires ${new Date(report.expiresAt).toLocaleDateString()}`}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#2A2A2A]">
        {report.downloadUrl && report.status === 'completed' && !isExpired && (
          <a
            href={report.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E80ADE] border border-[#E80ADE] rounded-sm hover:bg-[rgba(232,10,222,0.08)] transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        )}
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#666666] border border-[#2A2A2A] rounded-sm hover:text-red-400 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
}

function GenerateReportModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: CreateReportRequest) => void;
  isGenerating: boolean;
}) {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [title, setTitle] = useState('');
  const [focusTopic, setFocusTopic] = useState('');

  const handleSubmit = () => {
    if (!selectedType) return;
    onGenerate({
      type: selectedType,
      title: title.trim() || undefined,
      options: {
        focusTopic: focusTopic.trim() || undefined,
        includeEntities: true,
        includeInsights: true,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Report">
      <div className="space-y-4">
        {/* Report Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#666666] uppercase mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Report Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {REPORT_TYPES.map((rt) => (
              <button
                key={rt.type}
                onClick={() => setSelectedType(rt.type)}
                className={`flex items-start gap-2 p-3 rounded-sm border text-left transition-all ${
                  selectedType === rt.type
                    ? 'border-[#E80ADE] bg-[rgba(232,10,222,0.08)]'
                    : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
                }`}
              >
                <div className={selectedType === rt.type ? 'text-[#E80ADE]' : 'text-[#666666]'}>
                  {REPORT_TYPE_ICONS[rt.type] || <FileBarChart className="h-4 w-4" />}
                </div>
                <div>
                  <p className={`text-xs font-medium ${selectedType === rt.type ? 'text-[#E80ADE]' : 'text-[#F5F5F5]'}`}>
                    {rt.label}
                  </p>
                  <p className="text-[10px] text-[#666666] mt-0.5 line-clamp-2">{rt.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[#666666] uppercase mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
            Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Auto-generated if left blank"
            className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm text-sm text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent"
          />
        </div>

        {/* Focus Topic */}
        <div>
          <label className="block text-xs font-semibold text-[#666666] uppercase mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
            Focus Topic (optional)
          </label>
          <input
            type="text"
            value={focusTopic}
            onChange={(e) => setFocusTopic(e.target.value)}
            placeholder="e.g., Q4 product decisions"
            className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm text-sm text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#E80ADE] focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedType}
            isLoading={isGenerating}
          >
            Generate Report
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function ReportsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  const { data, isLoading } = useReports(workspaceId);
  const generateReport = useGenerateReport();
  const deleteReport = useDeleteReport();
  const { data: jobStatus } = useReportJobStatus(workspaceId, activeJobId ?? undefined);
  const { success, error: showError } = useToast();

  // Clear job when completed
  if (jobStatus?.status === 'completed' && activeJobId) {
    setActiveJobId(null);
    success('Report generated successfully');
  }
  if (jobStatus?.status === 'failed' && activeJobId) {
    setActiveJobId(null);
    showError('Report generation failed');
  }

  const handleGenerate = async (reqData: CreateReportRequest) => {
    if (!workspaceId) return;
    try {
      const job = await generateReport.mutateAsync({ workspaceId, data: reqData });
      setActiveJobId(job.id);
      setShowGenerateModal(false);
      success('Report generation started');
    } catch {
      showError('Failed to start report generation');
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!workspaceId) return;
    if (!confirm('Delete this report?')) return;
    setDeletingReportId(reportId);
    try {
      await deleteReport.mutateAsync({ workspaceId, reportId });
      success('Report deleted');
    } catch {
      showError('Failed to delete report');
    } finally {
      setDeletingReportId(null);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const reports = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-wide text-[#F5F5F5]">Reports</h1>
        <Button onClick={() => setShowGenerateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Generate Report
        </Button>
      </div>

      {/* Active Job Indicator */}
      {activeJobId && jobStatus && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#E80ADE] rounded-sm">
          <Loader2 className="h-4 w-4 text-[#E80ADE] animate-spin" />
          <div>
            <p className="text-sm text-[#F5F5F5]">
              Generating: {jobStatus.title || jobStatus.type}
            </p>
            <p className="text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
              Status: {jobStatus.status}
            </p>
          </div>
        </div>
      )}

      {/* Report Type Gallery */}
      <div>
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#666666] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Report Types
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt.type}
              onClick={() => setShowGenerateModal(true)}
              className="flex flex-col items-center gap-2 p-4 bg-[#141414] border border-[#2A2A2A] rounded-sm hover:border-[#E80ADE] hover:shadow-[0_0_15px_rgba(232,10,222,0.08)] transition-all text-center"
            >
              <div className="text-[#E80ADE]">
                {REPORT_TYPE_ICONS[rt.type] || <FileBarChart className="h-6 w-6" />}
              </div>
              <span className="text-xs font-medium text-[#F5F5F5]">{rt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      <div>
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#666666] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Generated Reports
        </h2>

        {reports.length === 0 ? (
          <EmptyState
            icon={<FileBarChart className="h-6 w-6" />}
            title="No reports yet"
            description="Generate reports from your knowledge base to create executive summaries, entity maps, and more"
            action={
              <Button onClick={() => setShowGenerateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Generate Report
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDelete={() => handleDelete(report.id)}
                isDeleting={deletingReportId === report.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Generate Modal */}
      <GenerateReportModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerate}
        isGenerating={generateReport.isPending}
      />
    </div>
  );
}
