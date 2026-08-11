import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "@/features/common/components/user-avatar";

interface ProfileHeaderProps {
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
}

export function ProfileHeader({ name, email, image, emailVerified }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 bg-muted/30 px-6 py-6 text-center border-b">
      <DialogHeader className="sr-only">
        <DialogTitle>Profile</DialogTitle>
      </DialogHeader>
      <UserAvatar
        name={name}
        image={image}
        className="size-16 ring-4 ring-background"
      />
      <div className="flex flex-col items-center gap-1">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <h2 className="text-lg font-semibold leading-tight">{name}</h2>
          <Badge variant={emailVerified ? "default" : "secondary"}>
            {emailVerified ? "Verified" : "Member"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
