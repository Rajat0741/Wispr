"use client";

import {
  BadgeCheckIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
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
import { authClient } from "@/lib/auth-client";

export function UserMenu() {
  const router = useRouter();
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const { execute: handleLogout, isExecuting: isLoggingOut } = useAction(logoutAction);
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  if (!user && !isPending) {
    router.push("/login");
    return null;
  }

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

      <NewGroupDialog open={newGroupOpen} onOpenChange={setNewGroupOpen} />
    </>
  );
}
