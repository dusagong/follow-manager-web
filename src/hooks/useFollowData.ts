import { useState, useEffect, useCallback } from 'react';
import type { FollowData, User } from '../types';
import { parseFollowersFile, parseFollowingFile, findNotMutual } from '../utils/parseInstagramData';

const STORAGE_KEY = 'follow-manager-data';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface StoredData {
  followers: User[];
  following: User[];
  notFollowing?: User[];
  mutuals?: User[];
  username?: string;
  timestamp: number;
}

interface APIResponse {
  status: string;
  data: {
    username: string;
    followers: User[];
    following: User[];
    not_follow_back: User[];
    not_following: User[];
    mutuals: User[];
    followers_count: number;
    following_count: number;
  };
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
          username: parsed.username,
          followers: parsed.followers,
          following: parsed.following,
          notMutual,
          notFollowing: parsed.notFollowing,
          mutuals: parsed.mutuals,
        });
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch from API using session ID
  const fetchFromAPI = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/insta/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'fetchError');
      }

      const result: APIResponse = await response.json();

      if (result.status !== 'success') {
        throw new Error('fetchError');
      }

      const newData: FollowData = {
        username: result.data.username,
        followers: result.data.followers,
        following: result.data.following,
        notMutual: result.data.not_follow_back,
        notFollowing: result.data.not_following,
        mutuals: result.data.mutuals,
      };

      setData(newData);

      // Save to localStorage
      const toStore: StoredData = {
        username: result.data.username,
        followers: result.data.followers,
        following: result.data.following,
        notFollowing: result.data.not_following,
        mutuals: result.data.mutuals,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));

      return newData;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'fetchError';
      setError(errorMessage);
      throw e;
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

      // Calculate notFollowing (followers I don't follow back)
      const followingSet = new Set(following.map(u => u.username));
      const notFollowing = followers.filter(f => !followingSet.has(f.username));

      // Calculate mutuals
      const followerSet = new Set(followers.map(u => u.username));
      const mutuals = following.filter(f => followerSet.has(f.username));

      const newData: FollowData = {
        followers,
        following,
        notMutual,
        notFollowing,
        mutuals,
      };

      setData(newData);

      // Save to localStorage
      const toStore: StoredData = {
        followers,
        following,
        notFollowing,
        mutuals,
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
    fetchFromAPI,
    reset,
  };
}
