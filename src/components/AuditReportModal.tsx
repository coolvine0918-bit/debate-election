import React from 'react';
import { AuditReportData } from '../types';
import { 
  X, 
  Award, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Vote, 
  Scale, 
  DollarSign, 
  ShieldCheck, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReportData | null;
  isLoading: boolean;
  candidateName: string;
  onRetry: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  report,
  isLoading,
  candidateName,
  onRetry,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!report) return;
    const reportText = `[18세 유권자의 정책 검증 청문회 공식 보고서]
안건: ${report.policyTitle}
후보자: ${candidateName}
최종 판정: ${report.verdictLabel} (종합 점수: ${report.overallScore}점 / 100점)

[세부 검증 점수]
- 실현 가능성 & 예산: ${report.scores.feasibility}점 (${report.scoreComment?.feasibility || ''})
- 형평성 & 역차별 해소: ${report.scores.equity}점 (${report.scoreComment?.equity || ''})
- 부작용 통제 방안: ${report.scores.sideEffectControl}점 (${report.scoreComment?.sideEffectControl || ''})
- 논리적 방어력: ${report.scores.logicDefense}점

[주요 강점]
${report.strengths.map((s) => `• ${s}`).join('\n')}

[보완 필요 허점]
${report.criticalFlaws.map((f) => `• ${f}`).join('\n')}

[결정적 압박 질문]
"${report.sharpestQuestion}"

[18세 유권자 최종 소회]
"${report.voterVerdictText}"
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getVerdictStyle = (verdict: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    switch (verdict) {
      case 'APPROVED':
        return {
          bg: 'bg-emerald-950/60 border-emerald-600 text-emerald-300',
          badge: 'bg-emerald-800 text-emerald-100',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        };
      case 'PENDING':
        return {
          bg: 'bg-amber-950/60 border-amber-600 text-amber-300',
          badge: 'bg-amber-800 text-amber-100',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
        };
      case 'REJECTED':
      default:
        return {
          bg: 'bg-red-950/60 border-red-600 text-red-300',
          badge: 'bg-red-800 text-red-100',
          icon: <XCircle className="w-6 h-6 text-red-400" />,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                정책 검증 청문회 공식 감사 보고서
              </h2>
              <p className="text-xs text-slate-400">
                대한민국 18세 첫 투표권자의 팩트 기반 최종 심사 결과
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {isLoading && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-300 font-medium text-sm">
                18세 유권자가 청문회 기록을 냉정하게 채점하고 있습니다...
              </p>
              <p className="text-xs text-slate-500">
                예산 타당성 · 형평성 · 부작용 억제력 지표 정밀 산출 중
              </p>
            </div>
          )}

          {!isLoading && !report && (
            <div className="py-12 text-center space-y-3">
              <p className="text-slate-400">보고서 데이터를 불러오지 못했습니다.</p>
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
              >
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && report && (
            <>
              {/* Official Stamp & Verdict Banner */}
              {(() => {
                const style = getVerdictStyle(report.verdict);
                return (
                  <div className={`p-5 rounded-2xl border-2 ${style.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80">
                        {style.icon}
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                          청문 안건: {report.policyTitle}
                        </div>
                        <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                          {report.verdictLabel}
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-700 sm:pl-6 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                      <span className="text-xs text-slate-400">종합 검증 점수</span>
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                        {report.overallScore}<span className="text-sm font-normal text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Detailed Pillar Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Feasibility */}
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-300 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> 실현 가능성 & 예산
                    </span>
                    <span className="font-mono font-bold text-white">{report.scores.feasibility}점</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${report.scores.feasibility}%` }}
                    />
                  </div>
                  {report.scoreComment?.feasibility && (
                    <p className="text-[11px] text-slate-400 leading-normal pt-1">
                      {report.scoreComment.feasibility}
                    </p>
                  )}
                </div>

                {/* Equity */}
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" /> 형평성 & 역차별 해소
                    </span>
                    <span className="font-mono font-bold text-white">{report.scores.equity}점</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${report.scores.equity}%` }}
                    />
                  </div>
                  {report.scoreComment?.equity && (
                    <p className="text-[11px] text-slate-400 leading-normal pt-1">
                      {report.scoreComment.equity}
                    </p>
                  )}
                </div>

                {/* Side Effect Control */}
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> 부작용 통제 및 지속가능성
                    </span>
                    <span className="font-mono font-bold text-white">{report.scores.sideEffectControl}점</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${report.scores.sideEffectControl}%` }}
                    />
                  </div>
                  {report.scoreComment?.sideEffectControl && (
                    <p className="text-[11px] text-slate-400 leading-normal pt-1">
                      {report.scoreComment.sideEffectControl}
                    </p>
                  )}
                </div>

                {/* Logic Defense */}
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 후보자 질의 방어력
                    </span>
                    <span className="font-mono font-bold text-white">{report.scores.logicDefense}점</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${report.scores.logicDefense}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal pt-1">
                    압박 질문에 대한 수치 기반 근거 제시 및 대안의 논리성
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 인정된 정책 강점
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {report.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> 지적된 허점 및 개선 과제
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {report.criticalFlaws.map((flaw, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{flaw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sharpest Question & Final Verdict */}
              {report.sharpestQuestion && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    가장 날카로웠던 유권자 검증 질문
                  </span>
                  <p className="text-xs text-blue-300 font-medium italic">
                    "{report.sharpestQuestion}"
                  </p>
                </div>
              )}

              {/* 18-Year-Old Voter's Final Verdict */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5 text-blue-400" /> 18세 유권자 최종 소회
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  "{report.voterVerdictText}"
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            공식 청문 기록은 로컬에 즉시 복사 및 출력 가능합니다.
          </div>
          <div className="flex items-center gap-2">
            {report && (
              <>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사 완료' : '보고서 복사'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 font-medium"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>인쇄</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
