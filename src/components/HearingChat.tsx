import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, QuestionCategory } from '../types';
import { 
  Send, 
  Volume2, 
  Copy, 
  Check, 
  ShieldAlert, 
  User, 
  Sparkles, 
  CornerDownLeft, 
  Award, 
  Scale, 
  DollarSign, 
  AlertTriangle 
} from 'lucide-react';

interface HearingChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onOpenReport: () => void;
  isSupported: boolean;
}

export const HearingChat: React.FC<HearingChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onOpenReport,
  isSupported,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0;
    utterance.pitch = 0.95; // calm, slightly lower tone
    window.speechSynthesis.speak(utterance);
  };

  const getCategoryBadge = (category?: QuestionCategory) => {
    switch (category) {
      case 'A_FEASIBILITY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800">
            <DollarSign className="w-3 h-3 text-blue-400" />
            A. 실현 가능성 (예산·재원)
          </span>
        );
      case 'B_EQUITY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
            <Scale className="w-3 h-3 text-amber-400" />
            B. 형평성 (역차별·편애)
          </span>
        );
      case 'C_SIDE_EFFECTS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800">
            <AlertTriangle className="w-3 h-3 text-purple-400" />
            C. 부작용 (악용·풍선효과)
          </span>
        );
      case 'SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700 animate-pulse">
            <Award className="w-3 h-3 text-emerald-400" />
            조건부 지지 획득
          </span>
        );
      case 'GREETING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            청문회 시작 (첫인사)
          </span>
        );
      default:
        return null;
    }
  };

  const quickDefenses = [
    {
      label: '예산안 수치 제시',
      text: '구체적인 소요 예산은 관내 조례 개정을 통한 불요불급 예산 4% 절감분 120억 원과 시비 매칭 펀드로 전액 충당하며, 단계적 3개년 시범사업으로 리스크를 최소화하겠습니다.',
    },
    {
      label: '형평성/역차별 보완책',
      text: '소외 계층 및 일반 학생 간의 위화감을 막기 위해 보편적 바우처 형태로 일괄 지급하되, 다자녀·취약계층에는 추가 교육 포인트를 가산하는 보정 장치를 마련하여 공정성을 담보하겠습니다.',
    },
    {
      label: '부작용 통제/일몰제',
      text: '정책 시행 6개월 후 학생·교사·학부모 합동 감사위원회를 구성해 악용 사례와 학습 저해 요소를 전수조사하고, 실효성 미달 시 자동 폐기되는 일몰제 조항을 명문화하겠습니다.',
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 relative">
      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-6">
        {messages.map((message) => {
          const isVoter = message.role === 'model';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isVoter ? 'items-start' : 'items-end'} max-w-4xl mx-auto`}
            >
              {/* Speaker Metadata */}
              <div className="flex items-center gap-2 mb-1.5 px-1">
                {isVoter ? (
                  <>
                    <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">
                      18세 유권자
                    </span>
                    {getCategoryBadge(message.category)}
                  </>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-indigo-400">
                      후보자 (학생)
                    </span>
                    <div className="w-5 h-5 rounded-md bg-indigo-950 border border-indigo-700 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                  </>
                )}
              </div>

              {/* Speech Bubble */}
              <div
                className={`group relative p-4 sm:p-5 rounded-2xl max-w-2xl text-sm leading-relaxed tracking-normal shadow-md transition-all ${
                  isVoter
                    ? message.isSupported
                      ? 'bg-gradient-to-br from-emerald-950/70 to-slate-900 border-2 border-emerald-600/80 text-emerald-100 rounded-tl-sm'
                      : 'bg-slate-900 border border-slate-750 text-slate-200 rounded-tl-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-950/50'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
                  {message.content}
                </div>

                {/* Actions on hover */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {isVoter && (
                      <button
                        onClick={() => speakText(message.content)}
                        className="p-1 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                        title="음성으로 듣기"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(message.id, message.content)}
                      className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                      title="내용 복사"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400">
                18세 유권자가 논리적 허점을 분석하고 있습니다...
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 rounded-tl-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span className="text-xs text-slate-400">
                예산 타당성, 형평성, 부작용 통제 방안 교차 검증 중
              </span>
            </div>
          </div>
        )}

        {/* Congratulatory Support Banner */}
        {isSupported && (
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-600/70 text-center space-y-2 shadow-xl shadow-emerald-950/40 animate-in fade-in zoom-in-95">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-300 text-xs font-bold">
              <Award className="w-4 h-4 text-emerald-400" />
              청문회 방어 성공 (조건부 지지 획득)
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              18세 유권자의 매서운 압박 질문을 논리적 대안과 수치로 성공적으로 설득했습니다.
            </p>
            <button
              onClick={onOpenReport}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              공식 정책 청문회 감사 보고서 확인하기
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Defense Helper Area */}
      <div className="border-t border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Quick Defense Templates */}
          {!isSupported && messages.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-400 text-[11px] whitespace-nowrap font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> 추천 방어 논리:
              </span>
              {quickDefenses.map((qd, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(qd.text)}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 whitespace-nowrap transition-colors text-[11px]"
                >
                  {qd.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-end gap-2 bg-slate-950 border border-slate-750 rounded-xl p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              placeholder={
                messages.length <= 1
                  ? "준비하신 정책의 명칭과 핵심 제안 내용을 입력하세요..."
                  : "유권자의 날카로운 질문에 대해 구체적인 수치와 대안으로 논리적으로 답변하세요..."
              }
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none max-h-32 px-2 py-1 leading-normal"
            />

            <div className="flex items-center gap-1.5 self-end">
              <span className="text-[11px] text-slate-500 hidden sm:inline px-1">
                {inputText.length}자
              </span>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                  inputText.trim() && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950 cursor-pointer'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
                title="답변 제출 (Enter)"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Enter 키로 전송, Shift + Enter 줄바꿈</span>
            <span>판단 기준: 오직 데이터 · 예산 · 실효성 · 공익성</span>
          </div>
        </div>
      </div>
    </div>
  );
};
