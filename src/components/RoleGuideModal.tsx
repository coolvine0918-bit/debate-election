import React from 'react';
import { User, ShieldAlert, Award, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface RoleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleGuideModal: React.FC<RoleGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-indigo-500/80 text-slate-100 rounded-3xl w-full max-w-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 px-6 py-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 청문회 입장 필수 안내
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            잠깐! 대화 전 '역할'을 꼭 확인하세요
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 opacity-90">
            이 청문회는 단순한 대화가 아닌 실전 정책 검증 압박 면접입니다.
          </p>
        </div>

        {/* Core Role Comparison Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student (Candidate) Card */}
            <div className="p-5 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500/70 relative flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                      당신 (학생)
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      정치인 후보자
                    </h3>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>정책 제안자</strong>로서 자신의 공약을 발표하고 유권자를 설득해야 합니다.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>감정적 호소는 통하지 않습니다. <strong>구체적 예산, 통계, 대안</strong>으로 방어하세요.</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-900/40 border border-indigo-700/50 text-[11px] text-indigo-200 font-medium text-center">
                👉 "제 정책은 실현 가능하고 공정합니다!"
              </div>
            </div>

            {/* AI (Voter) Card */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border-2 border-slate-700 relative flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-600 text-blue-400 flex items-center justify-center shadow-md font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                      상대방 (인공지능)
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      18세 첫 유권자
                    </h3>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>포퓰리즘과 세금 낭비를 극도로 싫어하는 <strong>냉철한 심사관</strong>입니다.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>칭찬이나 이모지 없이 <strong>1턴에 딱 1개씩</strong> 날카로운 약점 질문만 던집니다.</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium text-center">
                🧐 "취지는 알겠으나, 그 예산은 어디서 조달합니까?"
              </div>
            </div>
          </div>

          {/* Victory Goal Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/60 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-500 text-emerald-300 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                최종 미션: 18세 유권자의 '지지' 획득하기!
              </div>
              <p className="text-slate-300 leading-relaxed">
                2~3번의 꼬리 질문을 완벽히 방어하여 
                <span className="text-emerald-200 font-semibold font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/80 ml-1">
                  "제 한 표를 고려해 보겠습니다"
                </span>
                라는 답변을 이끌어내면 청문회 통과입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            준비되셨나요? 후보자로서 당당하게 정책을 제시하세요!
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>역할 확인 완료! 청문회 입장하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
