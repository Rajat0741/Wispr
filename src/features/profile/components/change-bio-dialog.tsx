"use client";

import { LoaderCircleIcon, PencilIcon, PlusIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { updateBio } from "@/features/profile/actions/update-bio";
import { bioSchema } from "@/features/profile/schema";

interface ChangeBioDialogProps {
  currentBio?: string | null;
  onBioUpdated: (newBio: string) => void;
}

interface ChangeBioFormProps {
  currentBio?: string | null;
  onSuccess: (newBio: string) => void;
  onCancel: () => void;
}

export function ChangeBioForm({
  currentBio,
  onSuccess,
  onCancel,
}: ChangeBioFormProps) {
  const [bio, setBio] = useState(currentBio ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { execute, isExecuting, result } = useAction(updateBio, {
    onSuccess: ({ data }) => {
      if (data?.bio !== undefined) {
        onSuccess(data.bio);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = bioSchema.safeParse(bio);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }
    const nextBio = parsed.data;

    if (nextBio === (currentBio ?? "").trim()) {
      onCancel();
      return;
    }

    setValidationError(null);
    execute({ bio: nextBio });
  };

  const errorMessage =
    validationError ||
    result.serverError ||
    result.validationErrors?.bio?._errors?.[0];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        <Field data-invalid={!!errorMessage}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <span className="text-xs text-muted-foreground">
              {bio.length}/200
            </span>
          </div>
          <Textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              setValidationError(null);
            }}
            placeholder="Tell us a little about yourself..."
            autoFocus
            maxLength={200}
            rows={3}
            disabled={isExecuting}
            aria-invalid={!!errorMessage}
            aria-describedby="bio-description"
          />
          <FieldDescription id="bio-description">
            Write a short bio to introduce yourself on Convo (max 200 characters).
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
          {isExecuting ? "Saving" : "Save bio"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ChangeBioDialog({
  currentBio,
  onBioUpdated,
}: ChangeBioDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasBio = Boolean(currentBio && currentBio.trim().length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={<Button variant="outline" className="w-full sm:w-auto" />}
      >
        {hasBio ? (
          <PencilIcon data-icon="inline-start" />
        ) : (
          <PlusIcon data-icon="inline-start" />
        )}
        {hasBio ? "Edit bio" : "Add bio"}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hasBio ? "Edit your bio" : "Add a bio"}</DialogTitle>
          <DialogDescription>
            Share a brief description about yourself with other members on Convo.
          </DialogDescription>
        </DialogHeader>

        {isOpen ? (
          <ChangeBioForm
            currentBio={currentBio}
            onSuccess={(newBio) => {
              onBioUpdated(newBio);
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
