"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { AppError } from "@/utils/app-error";

export function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  if (error) {
    throw error;
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/chat",
      });
    } catch (err) {
      setError(
        err instanceof AppError
          ? err
          : new AppError(
              err instanceof Error
                ? err.message
                : "An unexpected error occurred.",
              500,
            ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center flex flex-col items-center">
        <Logo size="md" className="mb-2" />
        <CardTitle className="text-2xl">Join Convo</CardTitle>
        <CardDescription>
          Sign in to continue to your conversations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          variant="outline"
          className="w-full gap-3 rounded-xl border-border px-4 py-2.5 hover:bg-muted"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <FcGoogle aria-hidden="true" className="size-5" />
          )}
          <span className="text-foreground">
            {isLoading ? "Signing in..." : "Continue with Google"}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
