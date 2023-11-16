export enum ErrorCodes {
  INVALID_OR_EXPIRED_TOKEN = 1,
  FAILED_EMAIL_SEND = 2,
}

export class CustomError extends Error {
  code: ErrorCodes;
  meta: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCodes,
    meta?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.meta = meta || {};
  }
}

class PaymentError extends Error {
  notificationUrl: string;
  constructor(message: string, notificationUrl: string) {
    super(message);
    this.name = 'CustomError';
    this.notificationUrl = notificationUrl;
  }
}

export const throwPaymentError = (
  message: string,
  notificationUrl?: string
) => {
  throw new PaymentError(message, notificationUrl ?? '');
};
