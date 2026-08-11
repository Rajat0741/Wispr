import type { ElementType, ReactNode } from "react";

interface ProfileRowProps {
  icon: ElementType;
  label: string;
  children: ReactNode;
}

export function ProfileRow({ icon: Icon, label, children }: ProfileRowProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted mt-0.5">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
