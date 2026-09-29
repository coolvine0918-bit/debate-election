import React, { useState, useEffect } from 'react';
import { ChatMessage, PolicyPreset, AuditReportData, QuestionCategory } from './types';
import { HearingHeader } from './components/HearingHeader';
import { HearingChat } from './components/HearingChat';
import { MetricsSidebar } from './components/MetricsSidebar';
import { RulesModal } from './components/RulesModal';
import { AuditReportModal } from './components/AuditReportModal';
import { RoleGuideModal } from './components/RoleGuideModal';

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-initial',
  role: 'model',
  content: '안녕하세요. 제 소중한 첫 표를 행사할 후보님의 정책을 들으러 왔습니다. 어떤 정책을 준비하셨나요?',
  timestamp: Date.now(),
  category: 'GREETING',
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [policyTitle, setPolicyTitle] = useState('청소년 대중교통 100% 무상 이용제');
  const [candidateName, setCandidateName] = useState('학생회장 후보');
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleGuideOpen, setIsRoleGuideOpen] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState<AuditReportData | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isTTSActive, setIsTTSActive] = useState(false);

  // Compute stats
  const pressureTurns = messages.filter(
    (m) => m.role === 'model' && m.category !== 'GREETING'
  ).length;

  const lastModelMsg = [...messages].reverse().find((m) => m.role === 'model');
  const isSupported = messages.some((m) => m.isSupported);

  // Auto speech if TTS active
  const speakVoter = (text: string) => {
    if (!isTTSActive || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newMessages.map((m) => ({ role: m.role, content: m.content })),
          policyTitle,
          turnCount: pressureTurns + 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: 'model',
        content: data.text,
        timestamp: Date.now(),
        category: data.category as QuestionCategory,
        isSupported: data.isSupported,
      };

      setMessages((prev) => [...prev, modelMsg]);
      speakVoter(data.text);
    } catch (error) {
      console.error('Failed to communicate with voter:', error);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'model',
        content: '후보님께서 말씀하신 정책의 취지는 이해하지만, 현재 설명만으로는 구체적인 연간 예산 조달 계획과 기존 복지 제도와의 중복 문제를 납득하기 어렵습니다. 어느 세목의 세수를 활용하거나 어떤 사업을 삭감해 이 재원을 마련하실 것인지 구체적으로 밝혀 주십시오.',
        timestamp: Date.now(),
        category: 'A_FEASIBILITY',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: PolicyPreset) => {
    setPolicyTitle(preset.title);
    handleSendMessage(`[정책 제안]: ${preset.title}\n\n${preset.initialPitch}`);
  };

  const handleFetchReport = async () => {
    setIsReportOpen(true);
    setIsReportLoading(true);

    try {
      const response = await fetch('/api/audit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          policyTitle,
          candidateName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Failed to generate audit report:', error);
      setReportData(null);
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleReset = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        ...INITIAL_GREETING,
        timestamp: Date.now(),
      },
    ]);
    setReportData(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Hearing Header */}
      <HearingHeader
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenRoleGuide={() => setIsRoleGuideOpen(true)}
        onOpenReport={handleFetchReport}
        onReset={handleReset}
        isTTSActive={isTTSActive}
        onToggleTTS={() => setIsTTSActive((prev) => !prev)}
        hasMessages={messages.length > 1}
        isSupported={isSupported}
      />

      {/* Main Workspace: Chat Arena + Verification Radar Sidebar */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat / Hearing Arena */}
        <section className="flex-1 flex flex-col min-w-0">
          <HearingChat
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onOpenReport={handleFetchReport}
            isSupported={isSupported}
          />
        </section>

        {/* Verification Metrics & Policy Preset Sidebar */}
        <MetricsSidebar
          currentPolicyTitle={policyTitle}
          candidateName={candidateName}
          onChangePolicyTitle={setPolicyTitle}
          onSelectPreset={handleSelectPreset}
          pressureTurns={pressureTurns}
          lastCategory={lastModelMsg?.category}
          isSupported={isSupported}
        />
      </main>

      {/* Initial Entry Role Guide Modal */}
      <RoleGuideModal
        isOpen={isRoleGuideOpen}
        onClose={() => setIsRoleGuideOpen(false)}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Policy Audit Report Modal */}
      <AuditReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={reportData}
        isLoading={isReportLoading}
        candidateName={candidateName}
        onRetry={handleFetchReport}
      />
    </div>
  );
}
