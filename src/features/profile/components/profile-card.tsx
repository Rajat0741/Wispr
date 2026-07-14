"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface ProfileCardProps {
  session: {
    user: { name: string; email: string; image?: string | null };
  };
}

export function ProfileCard({ session: { user } }: ProfileCardProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await authClient.signOut({ 
      fetchOptions: { onSuccess: () => { router.push("/login"); router.refresh(); } } 
    });
    setIsLoggingOut(false);
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="p-8">
        <div className="flex items-center gap-5">
          {user.image ? (
            <img src={user.image} alt={user.name} className="h-16 w-16 rounded-full ring-2 ring-zinc-100 dark:ring-zinc-800" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-xl font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {user.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{user.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
