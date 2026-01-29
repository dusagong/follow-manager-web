import type { User } from '../types';

interface InstagramFollowerEntry {
  string_list_data: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

interface InstagramFollowingEntry {
  string_list_data: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

// Instagram followers.json format (newer format)
interface InstagramFollowersFile {
  // Could be array or object with different keys
  [key: string]: InstagramFollowerEntry[] | unknown;
}

// Instagram following.json format (newer format)
interface InstagramFollowingFile {
  relationships_following?: InstagramFollowingEntry[];
  [key: string]: InstagramFollowingEntry[] | unknown;
}

export function parseFollowersFile(data: unknown): User[] {
  try {
    // Handle array format (most common for followers)
    if (Array.isArray(data)) {
      return data.flatMap((entry: InstagramFollowerEntry) => {
        if (entry.string_list_data) {
          return entry.string_list_data.map((item) => ({
            username: item.value,
            href: item.href,
            timestamp: item.timestamp,
          }));
        }
        return [];
      });
    }

    // Handle object format
    const obj = data as InstagramFollowersFile;

    // Try common keys
    const possibleKeys = ['followers', 'relationships_followers', ''];
    for (const key of possibleKeys) {
      const value = key ? obj[key] : Object.values(obj)[0];
      if (Array.isArray(value)) {
        return (value as InstagramFollowerEntry[]).flatMap((entry) => {
          if (entry.string_list_data) {
            return entry.string_list_data.map((item) => ({
              username: item.value,
              href: item.href,
              timestamp: item.timestamp,
            }));
          }
          return [];
        });
      }
    }

    return [];
  } catch (e) {
    console.error('Error parsing followers file:', e);
    return [];
  }
}

export function parseFollowingFile(data: unknown): User[] {
  try {
    const obj = data as InstagramFollowingFile;

    // Try relationships_following first (newer format)
    if (obj.relationships_following && Array.isArray(obj.relationships_following)) {
      return obj.relationships_following.flatMap((entry) => {
        if (entry.string_list_data) {
          return entry.string_list_data.map((item) => ({
            username: item.value,
            href: item.href,
            timestamp: item.timestamp,
          }));
        }
        return [];
      });
    }

    // Handle array format
    if (Array.isArray(data)) {
      return (data as InstagramFollowingEntry[]).flatMap((entry) => {
        if (entry.string_list_data) {
          return entry.string_list_data.map((item) => ({
            username: item.value,
            href: item.href,
            timestamp: item.timestamp,
          }));
        }
        return [];
      });
    }

    // Try to find any array in the object
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        return (value as InstagramFollowingEntry[]).flatMap((entry) => {
          if (entry.string_list_data) {
            return entry.string_list_data.map((item) => ({
              username: item.value,
              href: item.href,
              timestamp: item.timestamp,
            }));
          }
          return [];
        });
      }
    }

    return [];
  } catch (e) {
    console.error('Error parsing following file:', e);
    return [];
  }
}

export function findNotMutual(following: User[], followers: User[]): User[] {
  const followerUsernames = new Set(followers.map((u) => u.username.toLowerCase()));
  return following.filter((u) => !followerUsernames.has(u.username.toLowerCase()));
}
