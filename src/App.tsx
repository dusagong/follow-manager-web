import { useState, useCallback } from 'react';
import { translations } from './types';
import { useFollowData } from './hooks/useFollowData';
import { FileUpload } from './components/FileUpload';
import { Results } from './components/Results';

type Language = 'ko' | 'en';

function App() {
  const [lang, setLang] = useState<Language>(() => {
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('ko') ? 'ko' : 'en';
  });

  const t = translations[lang];
  const { data, isLoading, error, processFiles, reset } = useFollowData();

  const handleFilesSelected = useCallback(
    async (followersFile: File | null, followingFile: File | null) => {
      try {
        await processFiles(followersFile, followingFile);
      } catch {
        // Error is handled in the hook
      }
    },
    [processFiles]
  );

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="min-h-screen">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setLang((l) => (l === 'ko' ? 'en' : 'ko'))}
          className="bg-white/90 backdrop-blur shadow-lg rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
        >
          {lang === 'ko' ? 'EN' : '한국어'}
        </button>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {t[error as keyof typeof t] || error}
        </div>
      )}

      {/* Main Content */}
      {data ? (
        <Results data={data} t={t} onReset={handleReset} />
      ) : (
        <FileUpload t={t} onFilesSelected={handleFilesSelected} isLoading={isLoading} />
      )}
    </div>
  );
}

export default App;
