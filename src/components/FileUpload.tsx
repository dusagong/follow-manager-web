import { useState, useCallback, useRef, type DragEvent } from 'react';
import type { Translations } from '../types';

interface FileUploadProps {
  t: Translations;
  onFilesSelected: (followersFile: File | null, followingFile: File | null) => void;
  isLoading: boolean;
}

export function FileUpload({ t, onFilesSelected, isLoading }: FileUploadProps) {
  const [followersFile, setFollowersFile] = useState<File | null>(null);
  const [followingFile, setFollowingFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const name = file.name.toLowerCase();
      if (name.includes('follower') && !name.includes('following')) {
        setFollowersFile(file);
      } else if (name.includes('following')) {
        setFollowingFile(file);
      }
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleAnalyze = useCallback(() => {
    onFilesSelected(followersFile, followingFile);
  }, [followersFile, followingFile, onFilesSelected]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.uploadTitle}</h1>
          <p className="text-gray-500 text-sm">{t.uploadDescription}</p>
        </div>

        {/* How to download section */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-2 text-sm">{t.howToDownload}</h3>
          <div className="text-xs text-purple-700 space-y-1">
            <p>{t.step1}</p>
            <p>{t.step2}</p>
            <p>{t.step3}</p>
            <p>{t.step4}</p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            multiple
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="gradient-bg text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t.selectFiles}
          </button>
          <p className="text-gray-400 text-sm mt-2">{t.dragAndDrop}</p>
        </div>

        {/* Selected files */}
        <div className="mt-4 space-y-2">
          <div className={`flex items-center justify-between p-3 rounded-lg ${followersFile ? 'bg-green-50' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-600">{t.followersFile}</span>
            {followersFile ? (
              <span className="text-sm text-green-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {followersFile.name}
              </span>
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </div>
          <div className={`flex items-center justify-between p-3 rounded-lg ${followingFile ? 'bg-green-50' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-600">{t.followingFile}</span>
            {followingFile ? (
              <span className="text-sm text-green-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {followingFile.name}
              </span>
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!followersFile || !followingFile || isLoading}
          className={`w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all ${
            followersFile && followingFile && !isLoading
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
              Loading...
            </span>
          ) : (
            t.analyze
          )}
        </button>
      </div>
    </div>
  );
}
