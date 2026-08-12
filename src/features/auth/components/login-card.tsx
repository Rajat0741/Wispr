"use client";

import { ArrowRight } from "lucide-react";
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
        callbackURL: "/onboarding",
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
    <Card className="w-full max-w-md border-border/70 bg-card/90 py-7 shadow-xl shadow-black/5 backdrop-blur-sm">
      <CardHeader className="flex flex-col items-center gap-2 text-center">
        <Logo size="md" className="mb-3" />
        <CardTitle className="text-3xl font-semibold tracking-tight">
          Welcome to wispr
        </CardTitle>
        <CardDescription>
          A quieter place for better conversations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-3">
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          variant="outline"
          className="h-12 w-full gap-3 rounded-xl border-border px-4 hover:bg-muted"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <FcGoogle aria-hidden="true" className="size-5" />
          )}
          <span className="text-foreground">
            {isLoading ? "Signing in..." : "Continue with Google"}
          </span>
          {!isLoading && (
            <ArrowRight className="ml-auto size-4 text-muted-foreground" />
          )}
        </Button>
        <p className="text-center text-xs leading-5 text-muted-foreground">
          By continuing, you agree to keep wispr a thoughtful space for
          everyone.
        </p>
      </CardContent>
    </Card>
  );
}
