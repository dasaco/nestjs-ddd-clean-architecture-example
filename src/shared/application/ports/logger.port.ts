export interface Logger {
  info(message: string, options?: unknown): void;
  error(message: string, options?: unknown): void;
  warn(message: string, options?: unknown): void;
  debug(message: string, options?: unknown): void;
}
