"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { RealtimeTokenResponse } from "@/app/api/realtime/token/route";
import { setSupabaseRealtimeAuthToken } from "@/lib/supabase/client";

const REALTIME_TOKEN_QUERY_KEY = ["supabase-realtime-token"] as const;

async function fetchRealtimeToken(): Promise<RealtimeTokenResponse> {
  const { data, error } = await betterFetch<RealtimeTokenResponse>(
    "/api/realtime/token",
    { cache: "no-store" },
  );

  if (error) {
    throw new Error(error.message || "Failed to fetch Realtime token");
  }
  if (!data?.token || !data.expiresAt) {
    throw new Error("Realtime token response is invalid");
  }

  return data;
}

export function useRealtimeToken(enabled = true) {
  const query = useQuery({
    queryKey: REALTIME_TOKEN_QUERY_KEY,
    queryFn: fetchRealtimeToken,
    enabled,
    staleTime: 9 * 60 * 1000,
    refetchInterval: (currentQuery) => {
      const expiresAt = currentQuery.state.data?.expiresAt;
      if (!expiresAt) return false;

      return Math.max(
        30_000,
        (expiresAt - Math.floor(Date.now() / 1000) - 60) * 1000,
      );
    },
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (query.data?.token) {
      setSupabaseRealtimeAuthToken(query.data.token);
    }
  }, [query.data?.token]);

  return query;
}
