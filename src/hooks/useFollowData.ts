import { useState, useEffect, useCallback } from 'react';
import type { FollowData, User } from '../types';
import { parseFollowersFile, parseFollowingFile, findNotMutual } from '../utils/parseInstagramData';

const STORAGE_KEY = 'follow-manager-data';

interface StoredData {
  followers: User[];
  following: User[];
  timestamp: number;
}

export function useFollowData() {
  const [data, setData] = useState<FollowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredData = JSON.parse(stored);
        const notMutual = findNotMutual(parsed.following, parsed.followers);
        setData({
          followers: parsed.followers,
          following: parsed.following,
          notMutual,
        });
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processFiles = useCallback(async (followersFile: File | null, followingFile: File | null) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!followersFile || !followingFile) {
        throw new Error('missingFiles');
      }

      const followersText = await followersFile.text();
      const followingText = await followingFile.text();

      let followersJson: unknown;
      let followingJson: unknown;

      try {
        followersJson = JSON.parse(followersText);
      } catch {
        throw new Error('invalidFile');
      }

      try {
        followingJson = JSON.parse(followingText);
      } catch {
        throw new Error('invalidFile');
      }

      const followers = parseFollowersFile(followersJson);
      const following = parseFollowingFile(followingJson);

      if (followers.length === 0 && following.length === 0) {
        throw new Error('invalidFile');
      }

      const notMutual = findNotMutual(following, followers);

      const newData: FollowData = {
        followers,
        following,
        notMutual,
      };

      setData(newData);

      // Save to localStorage
      const toStore: StoredData = {
        followers,
        following,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));

      return newData;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'invalidFile';
      setError(errorMessage);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    isLoading,
    error,
    processFiles,
    reset,
  };
}
