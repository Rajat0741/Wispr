"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createGroup } from "@/features/chat-list/actions/create-group";
import type { SearchUser } from "@/features/chat-list/components/user-search/user-item";
import { UserSearch } from "@/features/chat-list/components/user-search/user-search";
import { CHAT_ROOMS_KEY } from "@/features/chat-list/queries/get-chat-rooms";
import { SelectedMemberBadges } from "@/features/common/components/selected-member-badges";

function toFieldErrors(errors: readonly unknown[]) {
  return errors.map((msg) => ({ message: String(msg) }));
}

interface NewGroupFormProps {
  onSuccess: (roomId: string) => void;
  onCancel: () => void;
}

export function NewGroupForm({ onSuccess, onCancel }: NewGroupFormProps) {
  const queryClient = useQueryClient();

  const { execute, isExecuting, result } = useAction(createGroup, {
    onSuccess: async ({ data }) => {
      if (!data?.roomId) return;
      await queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
      form.reset();
      onSuccess(data.roomId);
    },
  });

  const actionError = result.serverError;

  const form = useForm({
    defaultValues: {
      name: "",
      members: [] as SearchUser[],
    },
    onSubmit: async ({ value }) => {
      if (isExecuting) return;
      execute({
        name: value.name.trim(),
        memberIds: value.members.map((m) => m.id),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup className="gap-4">
        {/* Group Name Field */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              !value.trim() ? "Group name is required." : undefined,
            onSubmit: ({ value }) =>
              !value.trim() ? "Group name is required." : undefined,
          }}
        >
          {(field) => {
            const hasErrors = field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={hasErrors}>
                <FieldLabel htmlFor={field.name}>Group Name</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {hasErrors ? (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>

        {/* Selected Members Field & Search */}
        <form.Field
          name="members"
          validators={{
            onChange: ({ value }) =>
              value.length === 0 ? "Select at least 1 member." : undefined,
            onSubmit: ({ value }) =>
              value.length === 0 ? "Select at least 1 member." : undefined,
          }}
        >
          {(field) => {
            const members = field.state.value;
            const hasErrors = field.state.meta.errors.length > 0;
            const errorObjects = toFieldErrors(field.state.meta.errors);

            const toggleMember = (user: SearchUser) => {
              const exists = members.some((m) => m.id === user.id);
              if (exists) {
                field.handleChange(members.filter((m) => m.id !== user.id));
              } else {
                field.handleChange([...members, user]);
              }
            };

            const removeMember = (userId: string) => {
              field.handleChange(members.filter((m) => m.id !== userId));
            };

            return (
              <>
                <Field data-invalid={hasErrors}>
                  <FieldLabel>Selected Members ({members.length})</FieldLabel>
                  <SelectedMemberBadges
                    members={members}
                    onRemove={removeMember}
                    disabled={isExecuting}
                    emptyMessage="Select at least 1 member below."
                  />
                  {hasErrors ? <FieldError errors={errorObjects} /> : null}
                </Field>

                <Field>
                  <FieldLabel>Add Members</FieldLabel>
                  <UserSearch
                    onSelectUser={toggleMember}
                    selectedUserIds={members.map((m) => m.id)}
                    disabled={isExecuting}
                    placeholder="Search users to add to group..."
                    className="max-h-56 border border-border"
                  />
                </Field>
              </>
            );
          }}
        </form.Field>
      </FieldGroup>

      {/* Server / Action Error */}
      {actionError ? <FieldError errors={[{ message: actionError }]} /> : null}

      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isExecuting}
        >
          Cancel
        </Button>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button
              type="submit"
              disabled={!canSubmit || isExecuting}
              className="gap-2"
            >
              {isExecuting && (
                <LoaderCircleIcon className="size-4 animate-spin" />
              )}
              Create Group
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}

export function NewGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg gap-4">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Enter a group name and search to add members.
          </DialogDescription>
        </DialogHeader>

        <NewGroupForm
          onSuccess={(roomId) => {
            onOpenChange(false);
            router.push(`/chat/${roomId}`);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function NewGroup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="New group"
      >
        <UsersIcon className="size-5" />
        <span className="sr-only">New group</span>
      </Button>

      <NewGroupDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
