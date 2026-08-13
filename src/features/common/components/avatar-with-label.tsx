import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

type TitleElement = "h1" | "h2" | "h3" | "p" | "span";

interface AvatarWithLabelProps {
  name?: string | null;
  image?: string | null;
  title?: string | null;
  subtitle?: string | null;
  side?: "right" | "bottom";
  titleAs?: TitleElement;
  className?: string;
  avatarClassName?: string;
  titleClassName?: string;
}

export function AvatarWithLabel({
  name,
  image,
  title,
  subtitle,
  side = "right",
  titleAs: Title = "p",
  className,
  avatarClassName,
  titleClassName,
}: AvatarWithLabelProps) {
  const hasLabel = title;

  return (
    <div
      className={cn(
        "flex gap-3",
        side === "bottom" ? "flex-col items-center" : "flex-row items-center",
        className,
      )}
    >
      <UserAvatar name={name} image={image} className={avatarClassName} />

      {hasLabel && (
        <div
          className={cn(
            side === "right" && "min-w-0",
            side === "bottom" && "text-center",
          )}
        >
          {title && (
            <Title className={cn("font-semibold", titleClassName)}>
              {title}
            </Title>
          )}
          {subtitle && (
            <p
              className={cn(
                "text-xs text-muted-foreground",
                side === "right" && "truncate",
                side === "bottom" && "mt-0.5",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
