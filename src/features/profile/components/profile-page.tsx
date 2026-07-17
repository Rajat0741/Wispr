"use client";

import {
  AtSignIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  LoaderCircleIcon,
  type LucideIcon,
  MailIcon,
  PencilIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

interface ProfilePageProps {
  user: {
    name: string;
    image?: string | null;
    username?: string | null;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Use 3-30 letters, numbers, underscores, or dots.")
  .regex(
    /^[a-zA-Z0-9_.]+$/,
    "Use 3-30 letters, numbers, underscores, or dots.",
  );

export function ProfilePage({ user }: ProfilePageProps) {
  const [username, setUsername] = useState(user.username ?? "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const initial = user.name.trim().charAt(0).toUpperCase() || "U";
  const displayHandle = username ? `@${username}` : "No username set";

  const handleUsernameSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const parsed = usernameSchema.safeParse(username);
    if (!parsed.success) {
      setFeedback({ type: "error", message: parsed.error.issues[0].message });
      return;
    }
    const nextUsername = parsed.data;

    if (nextUsername.toLowerCase() === (user.username ?? "").toLowerCase()) {
      setIsDialogOpen(false);
      setFeedback(null);
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const availability = await authClient.isUsernameAvailable({
      username: nextUsername,
    });

    if (availability.error || !availability.data?.available) {
      setIsSaving(false);
      setFeedback({
        type: "error",
        message: availability.error
          ? (availability.error.message ??
            "Could not check username availability.")
          : "That username is already taken.",
      });
      return;
    }

    const result = await authClient.updateUser({ username: nextUsername });
    setIsSaving(false);

    if (result.error) {
      setFeedback({
        type: "error",
        message: result.error.message ?? "Could not update your username.",
      });
      return;
    }

    setUsername(nextUsername.toLowerCase());
    setIsDialogOpen(false);
    setFeedback({ type: "success", message: "Username updated." });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-1 border-b border-dashed border-border pb-5">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and profile information.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.4fr)]">
          <Card className="py-8">
            <CardContent className="flex flex-col items-center gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  {user.name}
                </h2>
                <Badge variant={user.emailVerified ? "default" : "secondary"}>
                  {user.emailVerified ? "Verified member" : "Convo member"}
                </Badge>
              </div>

              <Avatar
                size="lg"
                className="size-32 ring-2 ring-border ring-offset-2 ring-offset-background"
              >
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="bg-muted text-4xl font-semibold text-muted-foreground">
                  {initial}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center gap-1">
                <p className="font-medium">{displayHandle}</p>
                <p className="text-xs text-muted-foreground">
                  Member since {user.createdAt}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-xl">Account details</CardTitle>
                <CardDescription>
                  Your name, email, username, and when you joined.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 p-6 sm:p-8">
              <ProfileDetail icon={UserRoundIcon} label="Name">
                {user.name}
              </ProfileDetail>

              <Separator />

              <ProfileDetail icon={MailIcon} label="Email address">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="break-all">{user.email}</span>
                  <Badge variant={user.emailVerified ? "default" : "outline"}>
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </Badge>
                </div>
              </ProfileDetail>

              <Separator />

              <ProfileDetail icon={ShieldCheckIcon} label="Member since">
                {user.createdAt}
              </ProfileDetail>

              <Separator />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <ProfileDetail icon={AtSignIcon} label="Username">
                  <span>{displayHandle}</span>
                </ProfileDetail>

                <Dialog
                  open={isDialogOpen}
                  onOpenChange={(open) => {
                    if (!open && isSaving) return;
                    setIsDialogOpen(open);
                    if (open) {
                      setUsername(username);
                      setFeedback(null);
                    }
                  }}
                >
                  <DialogTrigger
                    render={
                      <Button variant="outline" className="w-full sm:w-auto" />
                    }
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

                    <form
                      className="flex flex-col gap-5"
                      onSubmit={handleUsernameSubmit}
                    >
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                            @
                          </span>
                          <Input
                            id="username"
                            name="username"
                            value={username}
                            onChange={(event) =>
                              setUsername(event.target.value)
                            }
                            autoComplete="username"
                            autoFocus
                            maxLength={30}
                            disabled={isSaving}
                            aria-invalid={feedback?.type === "error"}
                            aria-describedby="username-help"
                            className="h-10 pl-7"
                          />
                        </div>
                        <p
                          id="username-help"
                          className="text-xs text-muted-foreground"
                        >
                          3-30 characters. Letters, numbers, underscores, and
                          dots are supported.
                        </p>
                      </div>

                      {feedback?.type === "error" ? (
                        <output
                          className="flex items-center gap-1.5 text-xs text-destructive"
                          aria-live="polite"
                        >
                          <CircleAlertIcon className="size-4 shrink-0" />
                          {feedback.message}
                        </output>
                      ) : null}

                      <DialogFooter>
                        <DialogClose
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              disabled={isSaving}
                            />
                          }
                        >
                          Cancel
                        </DialogClose>
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <LoaderCircleIcon
                              data-icon="inline-start"
                              className="animate-spin"
                            />
                          ) : null}
                          {isSaving ? "Saving" : "Save username"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {feedback?.type === "success" ? (
                <output
                  className="flex items-center gap-1.5 text-xs text-primary"
                  aria-live="polite"
                >
                  <CheckCircle2Icon className="size-4 shrink-0" />
                  {feedback.message}
                </output>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="flex min-w-0 flex-col gap-1 text-sm">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="wrap-break-word font-medium">{children}</div>
      </div>
    </div>
  );
}
