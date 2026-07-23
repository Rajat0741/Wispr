import { UserAvatar } from "@/features/common/components/user-avatar";

export function ChatHeader({
  title,
  image,
  subtitle,
}: {
  title: string;
  image?: string | null;
  subtitle?: string | null;
}) {
  return (
    <header className="flex items-center gap-3 border-b px-4 py-3">
      <UserAvatar name={title} image={image} className="size-9" />
      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold">{title}</h1>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
