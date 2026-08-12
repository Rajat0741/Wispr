"use client";

import {
  AtSignIcon,
  CheckIcon,
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
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/features/profile/actions/update-profile";
import { ItemActions } from "@/components/ui/item";
import { ProfileItem } from "@/features/profile/components/profile-item";
import { usernameSchema } from "@/features/profile/schema";

interface UsernameFieldProps {
  currentUsername?: string | null;
  onSaved: (newUsername: string) => void;
}

export function UsernameField({
  currentUsername,
  onSaved,
}: UsernameFieldProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentUsername ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { execute, isExecuting, result } = useAction(updateProfile, {
    onSuccess: ({ data }) => {
      if (data?.username !== undefined) {
        onSaved(data.username);
        setEditing(false);
      }
    },
  });

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleEdit = () => {
    setValue(currentUsername ?? "");
    setValidationError(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setValue(currentUsername ?? "");
    setValidationError(null);
  };

  const handleSave = () => {
    const parsed = usernameSchema.safeParse(value);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }
    if (parsed.data === (currentUsername ?? "").toLowerCase()) {
      setEditing(false);
      return;
    }
    setValidationError(null);
    execute({ username: parsed.data });
  };

  const errorMessage =
    validationError ||
    result.serverError ||
    result.validationErrors?.username?._errors?.[0];

  return (
    <ProfileItem icon={AtSignIcon} label="Username">
      {editing ? (
        <FieldGroup className="gap-2">
          <Field data-invalid={!!errorMessage}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  ref={inputRef}
                  id="profile-username"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                  maxLength={30}
                  disabled={isExecuting}
                  aria-invalid={!!errorMessage}
                  className="h-8 pl-7 text-sm"
                />
              </div>
              <ItemActions>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={handleSave}
                  disabled={isExecuting}
                  aria-label="Save username"
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
              </ItemActions>
            </div>
            {errorMessage ? (
              <FieldError errors={[{ message: errorMessage }]} />
            ) : (
              <FieldDescription>
                3–30 characters. Letters, numbers and underscores only.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      ) : (
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate font-medium">
            {currentUsername ? (
              `@${currentUsername}`
            ) : (
              <span className="font-normal text-muted-foreground">
                No username set
              </span>
            )}
          </span>
          <ItemActions>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={handleEdit}
              aria-label="Edit username"
            >
              <PencilIcon className="size-3.5" />
            </Button>
          </ItemActions>
        </div>
      )}
    </ProfileItem>
  );
}
