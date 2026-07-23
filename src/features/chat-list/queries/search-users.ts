import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import type { SearchUser } from "@/features/chat-list/components/user-search/user-item";

export async function searchUsers(username: string): Promise<SearchUser[]> {
  const { data, error } = await betterFetch<SearchUser[]>(
    `/api/search-user/${encodeURIComponent(username)}`,
  );

  if (error) {
    throw new Error(error.message || "Unable to search users.");
  }

  return data ?? [];
}

export function useUserSearchQuery(search: string) {
  const hasMinLength = search.length >= 3;
  const query = useQuery({
    queryKey: ["user-search", search],
    queryFn: () => searchUsers(search),
    enabled: hasMinLength,
    staleTime: 30000,
    retry: 1,
  });

  return {
    ...query,
    users: query.data ?? [],
    isSearching: query.isPending && hasMinLength,
    showSearchError: query.isError && hasMinLength,
  };
}
