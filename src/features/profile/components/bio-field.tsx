"use client";

import {
  CheckIcon,
  FileTextIcon,
  LoaderCircleIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/features/profile/actions/update-profile";
import { ProfileRow } from "@/features/profile/components/profile-row";
import { bioSchema } from "@/features/profile/schema";

interface BioFieldProps {
  currentBio?: string | null;
  onSaved: (newBio: string) => void;
}

export function BioField({ currentBio, onSaved }: BioFieldProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentBio ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { execute, isExecuting, result } = useAction(updateProfile, {
    onSuccess: ({ data }) => {
      if (data?.bio !== undefined) {
        onSaved(data.bio);
        setEditing(false);
      }
    },
  });

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const handleEdit = () => {
    setValue(currentBio ?? "");
    setValidationError(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setValue(currentBio ?? "");
    setValidationError(null);
  };

  const handleSave = () => {
    const parsed = bioSchema.safeParse(value);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }
    if (parsed.data === (currentBio ?? "").trim()) {
      setEditing(false);
      return;
    }
    setValidationError(null);
    execute({ bio: parsed.data });
  };

  const errorMessage =
    validationError ||
    result.serverError ||
    result.validationErrors?.bio?._errors?.[0];

  return (
    <ProfileRow icon={FileTextIcon} label="Bio">
      {editing ? (
        <FieldGroup className="gap-2">
          <Field data-invalid={!!errorMessage}>
            <div className="flex items-start gap-2">
              <Textarea
                ref={textareaRef}
                id="profile-bio"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setValidationError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleCancel();
                }}
                placeholder="Tell us a little about yourself..."
                maxLength={200}
                rows={3}
                disabled={isExecuting}
                aria-invalid={!!errorMessage}
                className="flex-1 resize-none text-sm"
              />
              <div className="flex flex-col gap-1 pt-0.5">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={handleSave}
                  disabled={isExecuting}
                  aria-label="Save bio"
                >
                  {isExecuting ? (
                    <LoaderCircleIcon className="size-4 animate-spin" />
                  ) : (
                    <CheckIcon className="size-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={handleCancel}
                  disabled={isExecuting}
                  aria-label="Cancel"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-start justify-between gap-2">
              {errorMessage ? (
                <FieldError errors={[{ message: errorMessage }]} />
              ) : (
                <FieldDescription>Max 200 characters.</FieldDescription>
              )}
              <span className="text-xs text-muted-foreground shrink-0">
                {value.length}/200
              </span>
            </div>
          </Field>
        </FieldGroup>
      ) : (
        <div className="flex min-w-0 items-start gap-2">
          <span className="min-w-0 flex-1 font-medium wrap-break-word">
            {currentBio && currentBio.trim().length > 0 ? (
              <p className="line-clamp-4">{currentBio}</p>
            ) : (
              <span className="font-normal text-muted-foreground">
                No bio added yet
              </span>
            )}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={handleEdit}
            aria-label="Edit bio"
          >
            <PencilIcon className="size-3.5" />
          </Button>
        </div>
      )}
    </ProfileRow>
  );
}
