import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  name,
  image,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const fallback = name?.trim() ? name.trim().charAt(0).toUpperCase() : "?";

  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarImage src={image ?? undefined} alt={name ?? "User avatar"} />
      <AvatarFallback className={cn("text-xs font-semibold", fallbackClassName)}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
