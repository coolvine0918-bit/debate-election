import React from 'react';
import { PolicyPreset, QuestionCategory } from '../types';
import { POLICY_PRESETS } from '../data/presets';
import { 
  Scale, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  UserCheck, 
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

interface MetricsSidebarProps {
  currentPolicyTitle: string;
  candidateName: string;
  onChangePolicyTitle: (title: string) => void;
  onSelectPreset: (preset: PolicyPreset) => void;
  pressureTurns: number;
  lastCategory?: QuestionCategory;
  isSupported: boolean;
}

export const MetricsSidebar: React.FC<MetricsSidebarProps> = ({
  currentPolicyTitle,
  candidateName,
  onChangePolicyTitle,
  onSelectPreset,
  pressureTurns,
  lastCategory,
  isSupported,
}) => {
  const getAttitudeStatus = () => {
    if (isSupported) {
      return {
        label: '조건부 지지 결정 (설득 완료)',
        color: 'text-emerald-400 bg-emerald-950/80 border-emerald-700',
        desc: '구체적인 계획과 방어 논리에 어느 정도 납득하여 표심을 열었습니다.',
      };
    }
    if (pressureTurns === 0) {
      return {
        label: '냉철한 관망 및 정책 대기',
        color: 'text-blue-400 bg-blue-950/80 border-blue-800',
        desc: '생애 첫 표를 행사하기 전, 후보가 내놓을 공약의 실체를 기다립니다.',
      };
    }
    if (pressureTurns === 1) {
      return {
        label: '1차 허점 포착 및 압박 중',
        color: 'text-amber-400 bg-amber-950/80 border-amber-800',
        desc: '취지는 인정하되 핵심 취약점을 겨냥한 첫 번째 질문을 던졌습니다.',
      };
    }
    if (pressureTurns === 2) {
      return {
        label: '2차 집요한 꼬리 추궁 진행',
        color: 'text-purple-400 bg-purple-950/80 border-purple-800',
        desc: '부족한 구체적 수치와 사각지대 문제를 집요하게 파고들고 있습니다.',
      };
    }
    return {
      label: '최종 방어 검증 단계',
      color: 'text-red-400 bg-red-950/80 border-red-800',
      desc: '마지막 대안과 재원 지속가능성을 확인 후 지지 여부를 결단합니다.',
    };
  };

  const status = getAttitudeStatus();

  return (
    <aside className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-4rem)] text-sm">
      {/* Policy Focus Card */}
      <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5 text-blue-400">
            <UserCheck className="w-3.5 h-3.5" /> 청문 대상 정책
          </span>
          <span className="text-[11px] text-slate-500 font-mono">후보: {candidateName}</span>
        </div>
        <input
          type="text"
          value={currentPolicyTitle}
          onChange={(e) => onChangePolicyTitle(e.target.value)}
          placeholder="정책 명칭을 입력하세요"
          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-medium text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Voter Attitude & Hearing Progress */}
      <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> 유권자 심리 상태
          </span>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            압박 턴: {pressureTurns}/3
          </span>
        </div>

        <div className={`p-2.5 rounded-lg border text-xs ${status.color}`}>
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            {status.label}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed opacity-90">{status.desc}</p>
        </div>

        {/* Turn Progress Steps */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>청문회 진행도</span>
            <span>{isSupported ? '100%' : `${Math.min(pressureTurns * 33, 90)}%`}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isSupported ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: isSupported ? '100%' : `${Math.min(pressureTurns * 33, 90)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Verification Pillars Indicator */}
      <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2.5">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> 3대 핵심 검증 축
        </span>

        <div className="space-y-2 text-xs">
          <div
            className={`p-2 rounded-lg border flex items-center justify-between ${
              lastCategory === 'A_FEASIBILITY'
                ? 'bg-blue-950/70 border-blue-600 text-blue-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span>A. 실현 가능성 (예산·재원)</span>
            </div>
            {lastCategory === 'A_FEASIBILITY' && (
              <span className="text-[10px] bg-blue-900 px-1.5 py-0.5 rounded text-blue-200 font-bold">집중 검증</span>
            )}
          </div>

          <div
            className={`p-2 rounded-lg border flex items-center justify-between ${
              lastCategory === 'B_EQUITY'
                ? 'bg-amber-950/70 border-amber-600 text-amber-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>B. 형평성 (역차별·편애)</span>
            </div>
            {lastCategory === 'B_EQUITY' && (
              <span className="text-[10px] bg-amber-900 px-1.5 py-0.5 rounded text-amber-200 font-bold">집중 검증</span>
            )}
          </div>

          <div
            className={`p-2 rounded-lg border flex items-center justify-between ${
              lastCategory === 'C_SIDE_EFFECTS'
                ? 'bg-purple-950/70 border-purple-600 text-purple-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-purple-400" />
              <span>C. 부작용 (풍선효과·통제)</span>
            </div>
            {lastCategory === 'C_SIDE_EFFECTS' && (
              <span className="text-[10px] bg-purple-900 px-1.5 py-0.5 rounded text-purple-200 font-bold">집중 검증</span>
            )}
          </div>
        </div>
      </div>

      {/* Preset Policy Selection (10 items) */}
      <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 추천 정책 안건 (10선)
          </span>
          <span className="text-[10px] text-slate-500 font-medium">클릭 시 자동 적용</span>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 text-xs">
          {POLICY_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group flex items-start justify-between gap-2 cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-blue-300 font-mono border border-slate-700 shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-300 font-medium border border-indigo-800/60 shrink-0">
                    {preset.category}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 line-clamp-1">
                  {preset.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {preset.budgetEstimate}
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
