"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  displayUsername: string | null;
  image: string | null;
  bio: string | null;
  lastActiveAt: string | null; // ISO string from JSON serialization
}

async function fetchUserProfile(username: string): Promise<UserProfile> {
  const { data, error } = await betterFetch<UserProfile>(
    `/api/users/by-username/${encodeURIComponent(username)}`,
  );
  if (error) throw new Error("Failed to fetch user profile.");
  return data;
}

export const userProfileQueryKey = (username: string) =>
  ["user-profile", username] as const;

export function useUserProfileQuery(username: string, enabled: boolean) {
  return useQuery({
    queryKey: userProfileQueryKey(username),
    queryFn: () => fetchUserProfile(username),
    enabled,
    staleTime: 30_000,
  });
}
