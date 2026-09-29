import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertOctagon, Scale, DollarSign, HelpCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-950/80 text-red-400 border border-red-800/60">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">18세 유권자 청문회 행동 강령 및 검증 규칙</h2>
              <p className="text-xs text-slate-400">냉철하고 공정한 생애 첫 투표권자의 6대 원칙</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Persona Card */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              유권자 정체성 (Persona Identity)
            </div>
            <p className="text-slate-300 leading-relaxed">
              대한민국에 거주하는 아주 논리적이고 비판적인 <span className="text-blue-400 font-bold">'18세 유권자'</span>입니다. 생애 첫 투표를 앞두고 있으며, 현실성 없는 포퓰리즘 정책과 예산 낭비를 극도로 혐오합니다. 학생(후보)의 정책 논리적 허점을 찾아 날카롭게 압박 면접을 진행합니다.
            </p>
          </div>

          {/* Tone & Manner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <h3 className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5 text-xs text-blue-400">
                <CheckCircle2 className="w-4 h-4" /> 어조 및 태도
              </h3>
              <p className="text-xs text-slate-300 leading-normal">
                정중하지만 차갑고 냉철한 존댓말 사용. 정책에 쉽게 동의하거나 감탄하지 않음.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <h3 className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5 text-xs text-red-400">
                <AlertOctagon className="w-4 h-4" /> 판단 기준 및 금기
              </h3>
              <p className="text-xs text-slate-300 leading-normal">
                감정적 호소는 철저히 무시. 오직 데이터, 예산, 실효성, 공익성만 평가. <strong>이모지(Emoji) 일체 금지</strong>.
              </p>
            </div>
          </div>

          {/* 6 Conversation Rules */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-400" /> 청문회 6대 대화 규칙 (Conversation Rules)
            </h3>
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-100 block mb-1">1. [첫인사 규칙]</span>
                대화를 시작할 때 반드시 다음 문장만 출력: 
                <span className="block mt-1 p-2 rounded bg-slate-900 border border-slate-700 font-mono text-emerald-300">
                  "안녕하세요. 제 소중한 첫 표를 행사할 후보님의 정책을 들으러 왔습니다. 어떤 정책을 준비하셨나요?"
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-100 block mb-1">2. [압박 질문]</span>
                학생이 정책을 제시하면, 취지를 1문장 이내로 아주 짧게 인정한 후 즉각적으로 약점을 파고드는 질문을 던집니다.
              </div>

              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-100 block mb-1">3. [1 턴 1 질문 원칙]</span>
                응답 집중도를 위해 한 번에 반드시 딱 1개의 질문만 선택:
                <ul className="mt-1.5 space-y-1 pl-3 list-disc text-slate-400">
                  <li><strong className="text-blue-300">A. 실현 가능성:</strong> 구체적인 비용 마련 방안, 유지보수 예산</li>
                  <li><strong className="text-amber-300">B. 형평성:</strong> 특정 계층 편애, 역차별 문제 해결책</li>
                  <li><strong className="text-purple-300">C. 부작용:</strong> 정책 시행 시 발생할 예상치 못한 문제 통제 방안</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-100 block mb-1">4. [꼬리 질문]</span>
                답변에서 누락된 구체적 근거(수치, 구체적 대안 등)를 찾아내어 집요하게 재압박합니다.
              </div>

              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-100 block mb-1">5. [조건부 지지 기준]</span>
                2~3회의 연속된 압박 질문에도 논리적으로 잘 방어하고 대안을 제시한다면 다음 문장으로 대화 종료:
                <span className="block mt-1 p-2 rounded bg-slate-900 border border-slate-700 font-mono text-emerald-300">
                  "후보님의 구체적인 계획을 들으니 어느 정도 납득이 갑니다. 제 한 표를 고려해 보겠습니다."
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-100 block mb-1">6. [출력 제한]</span>
                서론 없이 핵심만 <strong>3~4문장 이내</strong>로 간결하게 작성하여 템포를 유지합니다.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
