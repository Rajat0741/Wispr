"use client";

import { LoaderCircleIcon, PencilIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateUsername } from "@/features/profile/actions/update-username";
import { usernameSchema } from "@/features/profile/schema";

interface ChangeUsernameDialogProps {
  currentUsername?: string | null;
  onUsernameUpdated: (newUsername: string) => void;
}

interface ChangeUsernameFormProps {
  currentUsername?: string | null;
  onSuccess: (newUsername: string) => void;
  onCancel: () => void;
}

export function ChangeUsernameForm({
  currentUsername,
  onSuccess,
  onCancel,
}: ChangeUsernameFormProps) {
  const [username, setUsername] = useState(currentUsername ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { execute, isExecuting, result } = useAction(updateUsername, {
    onSuccess: ({ data }) => {
      if (data?.username) {
        onSuccess(data.username);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = usernameSchema.safeParse(username);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }
    const nextUsername = parsed.data;

    if (nextUsername === (currentUsername ?? "").toLowerCase()) {
      onCancel();
      return;
    }

    setValidationError(null);
    execute({ username: nextUsername });
  };

  const errorMessage =
    validationError ||
    result.serverError ||
    result.validationErrors?.username?._errors?.[0];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        <Field data-invalid={!!errorMessage}>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
              @
            </span>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setValidationError(null);
              }}
              autoComplete="username"
              autoFocus
              maxLength={30}
              disabled={isExecuting}
              aria-invalid={!!errorMessage}
              aria-describedby="username-description"
              className="h-10 pl-7"
            />
          </div>
          <FieldDescription id="username-description">
            3-30 characters. Letters, numbers, underscores, and dots are
            supported.
          </FieldDescription>
          {errorMessage ? <FieldError errors={[{ message: errorMessage }]} /> : null}
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          disabled={isExecuting}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? (
            <LoaderCircleIcon
              data-icon="inline-start"
              className="animate-spin"
            />
          ) : null}
          {isExecuting ? "Saving" : "Save username"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ChangeUsernameDialog({
  currentUsername,
  onUsernameUpdated,
}: ChangeUsernameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={<Button variant="outline" className="w-full sm:w-auto" />}
      >
        <PencilIcon data-icon="inline-start" />
        Change username
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your username</DialogTitle>
          <DialogDescription>
            Your username is how people find you in Convo.
          </DialogDescription>
        </DialogHeader>

        {isOpen ? (
          <ChangeUsernameForm
            currentUsername={currentUsername}
            onSuccess={(newUsername) => {
              onUsernameUpdated(newUsername);
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
