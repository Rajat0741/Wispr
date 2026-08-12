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

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await betterFetch<UserProfile>(
    `/api/users/${userId}`,
  );
  if (error) throw new Error("Failed to fetch user profile.");
  return data;
}

export const userProfileQueryKey = (userId: string) =>
  ["user-profile", userId] as const;

export function useUserProfileQuery(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: userProfileQueryKey(userId),
    queryFn: () => fetchUserProfile(userId),
    enabled,
    staleTime: 30_000,
  });
}
