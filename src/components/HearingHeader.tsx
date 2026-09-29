import React from 'react';
import { Vote, FileText, HelpCircle, Volume2, VolumeX, RotateCcw, ShieldCheck, UserCheck } from 'lucide-react';

interface HearingHeaderProps {
  onOpenRules: () => void;
  onOpenRoleGuide: () => void;
  onOpenReport: () => void;
  onReset: () => void;
  isTTSActive: boolean;
  onToggleTTS: () => void;
  hasMessages: boolean;
  isSupported: boolean;
}

export const HearingHeader: React.FC<HearingHeaderProps> = ({
  onOpenRules,
  onOpenRoleGuide,
  onOpenReport,
  onReset,
  isTTSActive,
  onToggleTTS,
  hasMessages,
  isSupported,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Persona Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-950/50">
            <Vote className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                18세 유권자의 정책 청문회
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-blue-300 border border-slate-700">
                생애 첫 투표권자
              </span>
              {isSupported && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 animate-pulse">
                  <ShieldCheck className="w-3 h-3" />
                  조건부 지지 획득
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              감정 배제 · 예산과 실효성 중심의 날카로운 압박 면접
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Role Guide Trigger */}
          <button
            onClick={onOpenRoleGuide}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-indigo-700/80 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 font-medium"
            title="후보자 vs AI 유권자 역할 안내 보기"
          >
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">역할 안내</span>
          </button>

          {/* TTS Voice Toggle */}
          <button
            onClick={onToggleTTS}
            title={isTTSActive ? '유권자 음성 읽기 끄기' : '유권자 음성 읽기 켜기'}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              isTTSActive
                ? 'bg-blue-900/40 border-blue-600 text-blue-300 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isTTSActive ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline font-medium">음성 낭독</span>
          </button>

          {/* Rules Modal Trigger */}
          <button
            onClick={onOpenRules}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            title="청문회 6대 규칙 보기"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-medium">행동 강령</span>
          </button>

          {/* Policy Audit Report Trigger */}
          <button
            onClick={onOpenReport}
            disabled={!hasMessages}
            className={`px-3 py-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 font-medium ${
              hasMessages
                ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-950/40 cursor-pointer'
                : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="정책 검증 결과 보고서 발급"
          >
            <FileText className="w-4 h-4" />
            <span>감사 보고서</span>
          </button>

          {/* Reset / Clear */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-xs"
            title="청문회 새로 시작"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
