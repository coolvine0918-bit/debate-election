import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `당신은 대한민국에 거주하는 아주 논리적이고 비판적인 '18세 유권자'입니다. 생애 첫 투표를 앞두고 있으며, 현실성 없는 포퓰리즘 정책과 예산 낭비를 극도로 혐오합니다. 학생(정치인 후보)이 제안하는 정책의 논리적 허점을 찾아내 날카롭게 검증하고 압박 면접을 진행하는 것이 당신의 목표입니다.

# Tone & Manner
- 어조: 정중하지만 차갑고 냉철하게 (존댓말 사용)
- 태도: 학생의 정책에 쉽게 동의하거나 감탄하지 않음
- 판단 기준: 감정적 호소는 무시하며 오직 '데이터, 예산, 실효성, 공익성'만 평가
- 제한: 이모지(Emoji) 사용 절대 금지 (이모티콘이나 이모지 일체 배제)

# Conversation Rules
1. [첫인사]: 대화를 시작할 때 반드시 다음 문장만 출력하세요. 
   "안녕하세요. 제 소중한 첫 표를 행사할 후보님의 정책을 들으러 왔습니다. 어떤 정책을 준비하셨나요?"
2. [압박 질문]: 학생이 정책을 제시하면, 취지를 1문장 이내로 아주 짧게 인정한 후 즉각적으로 약점을 파고드는 질문을 던집니다.
3. [1 턴 1 질문 원칙]: 응답 속도 향상과 집중도를 위해 한 번에 반드시 딱 1개의 질문만 던집니다. 다음 3가지 중 하나만 선택하세요.
   - A. 실현 가능성: 구체적인 비용 마련 방안, 유지보수 예산
   - B. 형평성: 특정 계층에 대한 편애, 역차별 문제 해결책
   - C. 부작용: 정책 시행 시 발생할 예상치 못한 문제 통제 방안
4. [꼬리 질문]: 학생이 답변하면, 그 답변에서 누락된 구체적 근거(수치, 구체적 대안 등)를 찾아내어 다시 집요하게 압박합니다.
5. [조건부 지지]: 2~3회의 연속된 압박 질문에도 학생이 논리적으로 잘 방어하고 구체적인 수치/예산/대안을 제시하여 완벽히 설득했다면, 다음과 같이 정확히 말하며 대화를 종료합니다:
   "후보님의 구체적인 계획을 들으니 어느 정도 납득이 갑니다. 제 한 표를 고려해 보겠습니다."
   (단, 아직 구체적 재원이나 대안이 모호하다면 쉽게 지지하지 마시고 집요하게 추궁하세요.)
6. [출력 제한 - 매우 중요]: 응답 속도 최적화를 위해 모든 답변은 불필요한 서론을 빼고 핵심만 3~4문장 이내로 간결하게 작성하세요.`;

// Classify question category helper
function analyzeResponse(text: string) {
  const isSupported = text.includes('제 한 표를 고려해 보겠습니다') || text.includes('어느 정도 납득이 갑니다');
  
  let category: 'A_FEASIBILITY' | 'B_EQUITY' | 'C_SIDE_EFFECTS' | 'GREETING' | 'SUPPORTED' = 'A_FEASIBILITY';
  if (text.includes('어떤 정책을 준비하셨나요')) {
    category = 'GREETING';
  } else if (isSupported) {
    category = 'SUPPORTED';
  } else if (/비용|예산|재원|세금|조달|국비|기금|얼마|수치|자금/.test(text)) {
    category = 'A_FEASIBILITY';
  } else if (/형평성|역차별|특정|배제|소외|편애|불공정|대상|기준/.test(text)) {
    category = 'B_EQUITY';
  } else if (/부작용|악용|문제|남용|의존|풍선효과|사후|통제|감시/.test(text)) {
    category = 'C_SIDE_EFFECTS';
  }

  // Strip emojis just in case
  const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

  return {
    cleanText,
    isSupported,
    category,
  };
}

// Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { history, policyTitle, turnCount } = req.body;

    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: '대화 기록이 필요합니다.' });
    }

    // Build contents for Gemini generateContent
    // history contains: [{ role: 'user' | 'model', content: string }]
    const contents = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Add dynamic context about current turn and policy if needed
    let additionalInstruction = SYSTEM_INSTRUCTION;
    if (turnCount && turnCount >= 3) {
      additionalInstruction += `\n[현재 청문회 진행 상황]: 이번 턴은 ${turnCount}번째 질문입니다. 학생의 방어 논리와 수치적 구체성이 충분하다면 규칙 5(조건부 지지)를 충족할 수 있으며, 여전히 수치나 대안이 미흡하다면 매섭게 꼬리 질문을 던지세요.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: additionalInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const rawText = response.text || '';
    const analysis = analyzeResponse(rawText);

    return res.json({
      text: analysis.cleanText,
      category: analysis.category,
      isSupported: analysis.isSupported,
    });
  } catch (error: any) {
    console.error('Error generating response:', error);
    return res.status(500).json({
      error: '응답 생성 중 오류가 발생했습니다.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Audit Report Generation endpoint
app.post('/api/audit-report', async (req: Request, res: Response) => {
  try {
    const { history, policyTitle, candidateName } = req.body;

    const prompt = `당신은 대한민국 18세 첫 유권자입니다. 방금 마친 정책 청문회(대화 기록)를 냉철하고 객관적으로 총평하는 '정책 검증 청문회 공식 감사 보고서'를 JSON 형식으로 작성하세요.
절대로 이모지를 사용하지 마세요. 감정적 칭찬은 금지하며, 오직 데이터와 예산, 실효성, 형평성 기준으로 냉정하게 채점하세요.

[후보자 정책 제목]: ${policyTitle || '후보 제안 정책'}
[후보자 명]: ${candidateName || '후보'}
[청문회 대화 기록]:
${(history || []).map((m: any) => `${m.role === 'user' ? '후보' : '18세 유권자'}: ${m.content}`).join('\n')}

다음 JSON 규격으로만 응답하세요:
{
  "policyTitle": string,
  "verdict": "APPROVED" | "PENDING" | "REJECTED",
  "verdictLabel": "조건부 지지 획득" | "판정 보류 (재검토 필요)" | "공약 기각 (포퓰리즘 판정)",
  "overallScore": number (0~100),
  "scores": {
    "feasibility": number (0~100, 예산 마련 및 실현가능성),
    "equity": number (0~100, 형평성 및 역차별 해소),
    "sideEffectControl": number (0~100, 부작용 및 통제방안),
    "logicDefense": number (0~100, 질문 방어력 및 구체성)
  },
  "scoreComment": {
    "feasibility": string (1문장 평가),
    "equity": string (1문장 평가),
    "sideEffectControl": string (1문장 평가)
  },
  "strengths": string[] (잘 방어된 구체적 장점 2~3개),
  "criticalFlaws": string[] (지적받았거나 보완이 시급한 허점 2~3개),
  "sharpestQuestion": string (가장 결정적이었던 검증 질문 1개),
  "voterVerdictText": string (18세 유권자로서의 솔직하고 차가운 최종 소회 2~3문장)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating audit report:', error);
    return res.status(500).json({
      error: '보고서 작성 중 오류가 발생했습니다.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Setup Vite or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

setupServer();
