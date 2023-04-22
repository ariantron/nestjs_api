export interface Response {
  statusCode: number;
  message: string | string[];
  readonly data?: any;
  readonly error?: string;
}
