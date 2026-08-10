"use client";

import { LoaderCircleIcon } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { updateGroupDescription } from "@/features/common/actions/update-group-description";

interface EditGroupDescriptionDialogProps {
  roomId: string;
  currentDescription?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newDescription: string | null) => void;
}

export function EditGroupDescriptionDialog({
  roomId,
  currentDescription,
  open,
  onOpenChange,
  onSuccess,
}: EditGroupDescriptionDialogProps) {
  const [description, setDescription] = useState(currentDescription ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { execute, isExecuting, result } = useAction(updateGroupDescription, {
    onSuccess: ({ data }) => {
      toast.add({
        title: "Group description updated",
        type: "success",
      });
      if (onSuccess && data?.description !== undefined) {
        onSuccess(data.description);
      }
      onOpenChange(false);
    },
    onError: ({ error }) => {
      toast.add({
        title: "Error",
        description: error.serverError ?? "Could not update group description.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (description.length > 300) {
      setValidationError("Description cannot exceed 300 characters.");
      return;
    }

    if (description.trim() === (currentDescription ?? "").trim()) {
      onOpenChange(false);
      return;
    }

    setValidationError(null);
    execute({ roomId, description: description.trim() });
  };

  const errorMessage =
    validationError ||
    result.serverError ||
    result.validationErrors?.description?._errors?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group Description</DialogTitle>
          <DialogDescription>
            Update the description for this group conversation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FieldGroup>
            <Field data-invalid={!!errorMessage}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="group-description">Description</FieldLabel>
                <span className="text-xs text-muted-foreground">
                  {description.length}/300
                </span>
              </div>
              <Textarea
                id="group-description"
                name="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setValidationError(null);
                }}
                placeholder="Add a description for this group..."
                autoFocus
                maxLength={300}
                rows={4}
                disabled={isExecuting}
                aria-invalid={!!errorMessage}
                aria-describedby="group-description-hint"
              />
              <FieldDescription id="group-description-hint">
                Briefly describe the purpose of this group (max 300 characters).
              </FieldDescription>
              {errorMessage ? (
                <FieldError errors={[{ message: errorMessage }]} />
              ) : null}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isExecuting}
              onClick={() => onOpenChange(false)}
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
              {isExecuting ? "Saving" : "Save description"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
