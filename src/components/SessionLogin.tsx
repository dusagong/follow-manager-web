import { useState, useCallback, useEffect } from 'react';
import type { Translations } from '../types';

interface SessionLoginProps {
  t: Translations;
  onSessionSubmit: (sessionId: string) => void;
  onSwitchToUpload: () => void;
  isLoading: boolean;
}

export function SessionLogin({ t, onSessionSubmit, onSwitchToUpload, isLoading }: SessionLoginProps) {
  const [sessionId, setSessionId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Auto-submit when session ID is pasted
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text').trim();
    if (pastedText && pastedText.length > 20) {
      setSessionId(pastedText);
      // Auto submit after a short delay
      setTimeout(() => {
        onSessionSubmit(pastedText);
      }, 300);
    }
  }, [onSessionSubmit]);

  const handleSubmit = useCallback(() => {
    if (sessionId.trim()) {
      onSessionSubmit(sessionId.trim());
    }
  }, [sessionId, onSessionSubmit]);

  const openInstagram = useCallback(() => {
    window.open('https://www.instagram.com/', '_blank');
    setCurrentStep(2);
  }, []);

  // Listen for focus to detect when user comes back
  useEffect(() => {
    const handleFocus = () => {
      if (currentStep === 2) {
        setCurrentStep(3);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentStep]);

  const steps = [
    {
      num: 1,
      title: t.sessionStep1,
      action: (
        <button
          onClick={openInstagram}
          className="mt-2 w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
          </svg>
          Instagram 열기
        </button>
      ),
    },
    {
      num: 2,
      title: t.sessionStep2,
      detail: (
        <div className="mt-2 space-y-2">
          <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-3">
            <p className="font-mono">F12 → Application → Cookies → instagram.com → sessionid</p>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img
              src={`${import.meta.env.BASE_URL}images/session-guide.png`}
              alt="Session ID 찾는 방법"
              className="w-full h-auto"
            />
          </div>
        </div>
      ),
    },
    {
      num: 3,
      title: t.sessionStep3,
    },
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.loginTitle}</h1>
          <p className="text-gray-500 text-sm">{t.loginDescription}</p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentStep === step.num
                  ? 'border-purple-500 bg-purple-50'
                  : currentStep > step.num
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep > step.num
                      ? 'bg-green-500 text-white'
                      : currentStep === step.num
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-300 text-white'
                  }`}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${currentStep >= step.num ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                  {currentStep === step.num && step.action}
                  {currentStep >= step.num && step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Session ID input */}
        <div className="mb-4">
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            onPaste={handlePaste}
            placeholder={t.sessionIdPlaceholder}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-center"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-400 mt-2 text-center">붙여넣기하면 자동으로 분석이 시작됩니다</p>
        </div>

        {/* Start button */}
        <button
          onClick={handleSubmit}
          disabled={!sessionId.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
            sessionId.trim() && !isLoading
              ? 'gradient-bg hover:opacity-90 shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t.fetchingData}
            </span>
          ) : (
            t.startAnalysis
          )}
        </button>

        {/* Switch to upload mode */}
        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToUpload}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            {t.switchToUpload}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-800 mb-1">안전한 서비스입니다</h4>
              <p className="text-xs text-amber-700 mb-2">
                Session ID는 팔로워/팔로잉 목록 조회에만 사용되며, 서버에 저장되지 않습니다.
                비밀번호 변경, 게시물 삭제 등 계정 변경 작업은 절대 수행하지 않습니다.
              </p>
              <p className="text-xs text-amber-600 mb-2">
                아래는 Instagram 공식 안내문입니다. 본 서비스는 로그인 정보를 요구하지 않으며,
                오직 분석 편의를 위한 도구입니다.
              </p>
              <div className="rounded-lg overflow-hidden border border-amber-200">
                <img
                  src={`${import.meta.env.BASE_URL}images/warning.png`}
                  alt="Instagram 공식 보안 안내"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
