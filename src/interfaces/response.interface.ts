export interface Response {
  readonly statusCode: number;
  readonly message: string | string[];
  readonly data?: any;
  readonly error?: string;
}
