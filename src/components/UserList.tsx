import type { User, Translations } from '../types';

interface UserListProps {
  users: User[];
  searchQuery: string;
  t: Translations;
}

export function UserList({ users, searchQuery, t }: UserListProps) {
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p>{t.emptyList}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {filteredUsers.map((user, index) => (
        <div
          key={`${user.username}-${index}`}
          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">@{user.username}</p>
            {user.href && (
              <a
                href={user.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:underline"
              >
                View profile →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
