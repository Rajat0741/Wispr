/**
 * Application-level error that carries an HTTP status code.
 * Throw this instead of a generic Error anywhere in route handlers or services
 * so that withErrorHandler can return the correct HTTP status to the client.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}
