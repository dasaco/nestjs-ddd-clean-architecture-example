interface LogMetafields {
  orderId?: string;
  extra?: { [key: string]: unknown };
}

// Implement your logging solution

export class AppLogger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, options?: LogMetafields) {
    console.log(message, options);
  }

  warn(message: string, options?: LogMetafields) {
    console.log(message, options);
  }

  error(message: string, options?: LogMetafields) {
    console.log(message, options);
  }

  debug(message: string, options?: LogMetafields) {
    console.log(message, options);
  }
}
