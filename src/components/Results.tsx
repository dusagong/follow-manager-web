import { useState, useMemo } from 'react';
import type { FollowData, TabType, Translations } from '../types';
import { UserList } from './UserList';

interface ResultsProps {
  data: FollowData;
  t: Translations;
  onReset: () => void;
}

export function Results({ data, t, onReset }: ResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('notMutual');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = useMemo(() => [
    { id: 'notMutual' as TabType, label: t.notMutual, count: data.notMutual.length, color: 'orange' },
    { id: 'notFollowing' as TabType, label: t.notFollowing, count: data.notFollowing?.length ?? 0, color: 'blue' },
    { id: 'mutuals' as TabType, label: t.mutuals, count: data.mutuals?.length ?? 0, color: 'green' },
    { id: 'following' as TabType, label: t.following, count: data.following.length, color: 'purple' },
    { id: 'followers' as TabType, label: t.followers, count: data.followers.length, color: 'pink' },
  ], [data, t]);

  const currentUsers = useMemo(() => {
    switch (activeTab) {
      case 'notMutual':
        return data.notMutual;
      case 'notFollowing':
        return data.notFollowing ?? [];
      case 'mutuals':
        return data.mutuals ?? [];
      case 'following':
        return data.following;
      case 'followers':
        return data.followers;
      default:
        return [];
    }
  }, [activeTab, data]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">{t.appTitle}</h1>
            <button
              onClick={onReset}
              className="text-white/80 hover:text-white text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t.reset}
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all min-w-[80px] ${
                  activeTab === tab.id
                    ? 'bg-white shadow-lg'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <div className={`text-2xl font-bold ${activeTab === tab.id ? 'gradient-text' : 'text-white'}`}>
                  {tab.count}
                </div>
                <div className={`text-xs ${activeTab === tab.id ? 'text-gray-600' : 'text-white/80'}`}>
                  {tab.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-lg mx-auto px-4 -mt-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* User List */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <UserList users={currentUsers} searchQuery={searchQuery} t={t} />
        </div>
      </div>
    </div>
  );
}
