export class ApiResponse {
  statusCode: number;
  message: string | string[];
  readonly data?: any;
  readonly error?: string;

  constructor(
    statusCode: number,
    message: string | string[],
    data?: any,
    error?: string,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
