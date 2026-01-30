import { useState, useCallback } from 'react';
import type { Translations } from '../types';

interface SessionLoginProps {
  t: Translations;
  onSessionSubmit: (sessionId: string) => void;
  onSwitchToUpload: () => void;
  isLoading: boolean;
}

export function SessionLogin({ t, onSessionSubmit, onSwitchToUpload, isLoading }: SessionLoginProps) {
  const [sessionId, setSessionId] = useState('');

  const handleSubmit = useCallback(() => {
    if (sessionId.trim()) {
      onSessionSubmit(sessionId.trim());
    }
  }, [sessionId, onSessionSubmit]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.loginTitle}</h1>
          <p className="text-gray-500 text-sm">{t.loginDescription}</p>
        </div>

        {/* How to get session ID */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-2 text-sm">{t.howToGetSession}</h3>
          <div className="text-xs text-purple-700 space-y-1">
            <p>{t.sessionStep1}</p>
            <p>{t.sessionStep2}</p>
            <p>{t.sessionStep3}</p>
          </div>
        </div>

        {/* Session ID input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.pasteSessionId}
          </label>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder={t.sessionIdPlaceholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading}
          />
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
      </div>
    </div>
  );
}
