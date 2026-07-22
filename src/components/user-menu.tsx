"use client";

import {
  BadgeCheckIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/actions/logout";
import { authClient } from "@/lib/auth-client";

export function UserMenu({
  user: initialUser,
}: {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const { execute: handleLogout, isExecuting: isLoggingOut } = useAction(logoutAction);
  const { data: session } = authClient.useSession();

  const user = initialUser ?? (session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || "",
      }
    : {
        name: "User",
        email: "",
        avatar: "",
      });

  const fallback = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full cursor-pointer outline-none flex items-center justify-center size-8 hover:opacity-80 transition-opacity">
        <Avatar className="size-8 border border-border">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-xs font-semibold">{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56"
        side="bottom"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <BadgeCheckIcon className="size-5" />
            Account & Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <SettingsIcon className="size-5" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={() => handleLogout()}
          variant="destructive"
        >
          <LogOutIcon className="size-5" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
