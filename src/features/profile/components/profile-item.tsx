"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface ProfileItemProps {
  session: {
    user: { name: string; email: string; image?: string | null };
  };
}

export function ProfileItem({ session: { user } }: ProfileItemProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
    setIsLoggingOut(false);
  };

  return (
    <Item className="w-full max-w-md" variant="outline">
      <ItemMedia
        variant={user.image ? "image" : "icon"}
        className="size-12 rounded-full bg-muted text-lg"
      >
        {user.image ? (
          <Image src={user.image} alt="" width={48} height={48} />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{user.name}</ItemTitle>
        <ItemDescription>{user.email}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="destructive"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </Button>
      </ItemActions>
    </Item>
  );
}
