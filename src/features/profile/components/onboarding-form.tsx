"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/features/profile/actions/update-profile";
import { usernameSchema } from "@/features/profile/schema";

export function OnboardingForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { execute, isExecuting, result } = useAction(updateProfile, {
    onSuccess: () => router.replace("/chat"),
  });

  const errorMessage =
    validationError ||
    result.serverError ||
    result.validationErrors?.username?._errors?.[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = usernameSchema.safeParse(username);

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }

    setValidationError(null);
    execute({ username: parsed.data });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <Logo size="md" className="mb-2" />
        <CardTitle className="text-2xl">Choose your username</CardTitle>
        <CardDescription>
          Pick a username so people can find and connect with you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldGroup>
            <Field data-invalid={!!errorMessage}>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="onboarding-username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setValidationError(null);
                  }}
                  maxLength={30}
                  disabled={isExecuting}
                  aria-invalid={!!errorMessage}
                  placeholder="username"
                  className="pl-7"
                  autoComplete="username"
                  autoFocus
                />
              </div>
              {errorMessage ? (
                <FieldError errors={[{ message: errorMessage }]} />
              ) : (
                <FieldDescription>
                  3-30 characters. Letters, numbers, and underscores only.
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={isExecuting}>
            {isExecuting && (
              <LoaderCircleIcon className="size-4 animate-spin" />
            )}
            {isExecuting ? "Saving..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
