"use client";

import { ShieldCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { toast } from "@/components/ui/toast";
import { BioField } from "@/features/profile/components/bio-field";
import { ProfileItem } from "@/features/profile/components/profile-item";
import { UsernameField } from "@/features/profile/components/username-field";
import { UserAvatar } from "@/features/common/components/user-avatar";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    name: string;
    image?: string | null;
    username?: string | null;
    bio?: string | null;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

export function ProfileDialog({
  open,
  onOpenChange,
  user,
}: ProfileDialogProps) {
  const router = useRouter();
  const [username, setUsername] = useState(user.username ?? null);
  const [bio, setBio] = useState(user.bio ?? null);

  const handleUsernameSaved = (newUsername: string) => {
    setUsername(newUsername);
    toast.add({ title: "Username updated", type: "success" });
    router.refresh();
  };

  const handleBioSaved = (newBio: string) => {
    setBio(newBio);
    toast.add({ title: "Bio updated", type: "success" });
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] flex flex-col p-0 pr-6 gap-0 ">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Profile</DialogTitle>
        </DialogHeader>

        <ItemGroup className="px-6 py-2 gap-0">
          <Item>
            <ItemMedia>
              <UserAvatar
                name={user.name}
                image={user.image}
                className="size-16 ring-4 ring-background"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{user.name}</ItemTitle>
              <ItemDescription>{user.email}</ItemDescription>
            </ItemContent>
          </Item>

          <ItemSeparator className="mx-4" />

          <ProfileItem icon={ShieldCheckIcon} label="Member since">
            <span className="font-medium text-foreground">
              {user.createdAt}
            </span>
          </ProfileItem>

          <ItemSeparator className="mx-4" />

          <UsernameField
            currentUsername={username}
            onSaved={handleUsernameSaved}
          />

          <ItemSeparator className="mx-4" />

          <BioField currentBio={bio} onSaved={handleBioSaved} />
        </ItemGroup>

      </DialogContent>
    </Dialog>
  );
}
