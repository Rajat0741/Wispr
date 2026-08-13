import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/utils/app-error";

/**
 * Standard error response handler for API route handlers.
 * Extracts appropriate HTTP status codes and error messages for AppError and ZodError,
 * logs unexpected internal errors with optional context, and returns consistent JSON responses.
 */
export function handleRouteError(
  error: unknown,
  context?: string,
): NextResponse<{ error: string }> {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    const message = firstIssue?.message ?? "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (context) {
    console.error(context, error);
  } else {
    console.error("Unhandled route error:", error);
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export const handleError = handleRouteError;
