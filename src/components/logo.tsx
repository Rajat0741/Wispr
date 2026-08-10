import type * as React from "react";
import { SiLivechat } from "react-icons/si";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, iconClassName, size = "md", ...props }: LogoProps) {
  const sizeClasses = {
    sm: "size-7",
    md: "size-9",
    lg: "size-12",
  };

  const iconSizes = {
    sm: "size-4",
    md: "size-5",
    lg: "size-7",
  };

  return (
    <div
      className={cn(
        "flex aspect-square items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm transition-transform hover:scale-105",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <SiLivechat className={cn(iconSizes[size], iconClassName)} />
    </div>
  );
}
