"use client";

import {
  BadgeCheckIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useState } from "react";
import { FaCircleHalfStroke } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/actions/logout";
import { NewGroupDialog } from "@/features/chat-list/components/dialogs/new-group-dialog";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { authClient } from "@/lib/auth-client";

export function UserMenu() {
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { execute: handleLogout, isExecuting: isLoggingOut } = useAction(logoutAction);
  const { data: session, isPending } = authClient.useSession();
  const { resolvedTheme, setTheme } = useTheme();

  const user = session?.user;

  if (isPending || !user) {
    return <div className="size-8 rounded-full bg-muted animate-pulse" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full cursor-pointer outline-none flex items-center justify-center size-8 hover:opacity-80 transition-opacity">
          <UserAvatar
            name={user?.name}
            image={user?.image}
            className="size-8 border border-border"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56" side="bottom" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setNewGroupOpen(true)}>
              <UsersIcon className="size-5" />
              New Group
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>
              <BadgeCheckIcon className="size-5" />
              Account &amp; Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <FaCircleHalfStroke className="size-4" />
              {isDark ? "Light Mode" : "Dark Mode"}
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

      <NewGroupDialog open={newGroupOpen} onOpenChange={setNewGroupOpen} />

      {user && (
        <ProfileDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          user={{
            name: user.name,
            image: user.image,
            username: (user as { username?: string | null }).username ?? null,
            bio: (user as { bio?: string | null }).bio ?? null,
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(new Date(user.createdAt)),
          }}
        />
      )}
    </>
  );
}
