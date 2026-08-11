"use client";

import { MailIcon, ShieldCheckIcon, UserRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { BioField } from "@/features/profile/components/bio-field";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { ProfileRow } from "@/features/profile/components/profile-row";
import { UsernameField } from "@/features/profile/components/username-field";

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

export function ProfileDialog({ open, onOpenChange, user }: ProfileDialogProps) {
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
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <ProfileHeader
          name={user.name}
          email={user.email}
          image={user.image}
          emailVerified={user.emailVerified}
        />

        <div className="flex flex-col gap-0 py-2">
          <ProfileRow icon={UserRoundIcon} label="Name">
            <span className="font-medium">{user.name}</span>
          </ProfileRow>

          <Separator className="mx-4 w-auto" />

          <ProfileRow icon={MailIcon} label="Email">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium truncate">{user.email}</span>
              <Badge
                variant={user.emailVerified ? "default" : "outline"}
                className="text-xs"
              >
                {user.emailVerified ? "Verified" : "Not verified"}
              </Badge>
            </div>
          </ProfileRow>

          <Separator className="mx-4 w-auto" />

          <ProfileRow icon={ShieldCheckIcon} label="Member since">
            <span className="font-medium">{user.createdAt}</span>
          </ProfileRow>

          <Separator className="mx-4 w-auto" />

          <UsernameField currentUsername={username} onSaved={handleUsernameSaved} />

          <Separator className="mx-4 w-auto" />

          <BioField currentBio={bio} onSaved={handleBioSaved} />
        </div>

        <div className="border-t px-6 py-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
