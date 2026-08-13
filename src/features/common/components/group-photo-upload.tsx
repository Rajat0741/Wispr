"use client";

import { CameraIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { uploadToImageKit } from "@/lib/imagekit/upload";
import { cn } from "@/lib/utils";

interface GroupPhotoUploadProps {
  value?: string | null;
  onChange: (url: string | null, fileId: string | null) => void;
  fallbackText?: string | null;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-12 text-sm",
  md: "size-20 text-xl",
  lg: "size-24 text-2xl",
};

export function GroupPhotoUpload({
  value,
  onChange,
  fallbackText,
  disabled = false,
  className,
  size = "md",
}: GroupPhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    setIsUploading(true);
    setError(null);

    try {
      const { url, fileId } = await uploadToImageKit(file);
      if (!mountedRef.current) return;
      onChange(url, fileId);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(
        err instanceof Error ? err.message : "Failed to upload group photo.",
      );
    } finally {
      if (mountedRef.current) setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onChange(null, null);
  };

  const isBusy = isUploading || disabled;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative group">
        <Tooltip>
          <TooltipTrigger
            type="button"
            disabled={isBusy}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload group photo"
            className={cn(
              "relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-transform active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed",
              sizeClasses[size],
            )}
          >
            <UserAvatar
              name={fallbackText}
              image={value}
              className="size-full border border-border shadow-xs"
            />

            {/* Hover / loading overlay */}
            <div
              className={cn(
                "absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/40 text-white transition-opacity",
                isUploading
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
              )}
            >
              {isUploading ? (
                <Loader2Icon className="size-5 animate-spin" />
              ) : (
                <CameraIcon className="size-5" />
              )}
            </div>
          </TooltipTrigger>
          {!isBusy && (
            <TooltipContent side="bottom">
              {value ? "Change group photo" : "Upload group photo"}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Remove button */}
        {value && !isBusy && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  onClick={handleRemove}
                  aria-label="Remove group photo"
                  className="absolute -top-1 -right-1 size-6 rounded-full shadow-xs"
                />
              }
            >
              <Trash2Icon className="size-3" />
            </TooltipTrigger>
            <TooltipContent side="top">Remove photo</TooltipContent>
          </Tooltip>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
        disabled={isBusy}
      />

      {error ? <FieldError errors={[{ message: error }]} /> : null}
    </div>
  );
}
