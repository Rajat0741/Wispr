import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import type { SearchUser } from "@/features/chat-list/components/user-search/user-item";

export async function searchUsers(
  username: string,
  excludedUserIds?: string[],
): Promise<SearchUser[]> {
  const params = new URLSearchParams();
  if (excludedUserIds && excludedUserIds.length > 0) {
    params.set("exclude", excludedUserIds.join(","));
  }
  const queryString = params.toString();
  const url = `/api/search-user/${encodeURIComponent(username)}${queryString ? `?${queryString}` : ""}`;

  const { data, error } = await betterFetch<SearchUser[]>(url);

  if (error) {
    throw new Error(error.message || "Unable to search users.");
  }

  return data ?? [];
}

export function useUserSearchQuery(search: string, excludedUserIds?: string[]) {
  const hasMinLength = search.length >= 3;
  const excludeKey = excludedUserIds
    ? [...excludedUserIds].sort().join(",")
    : "";

  const query = useQuery({
    queryKey: ["user-search", search, excludeKey],
    queryFn: () => searchUsers(search, excludedUserIds),
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
