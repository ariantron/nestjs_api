import { HttpStatusCode } from 'axios';
import { Response } from '../interfaces/response.interface';

export function errorResponse(
  httpStatusCode: number,
  message: string | string[],
): Response {
  return {
    statusCode: httpStatusCode,
    error: httpStatusText(httpStatusCode),
    message: message,
  };
}

export function successResponse(
  message: string | string[],
  data: any,
): Response {
  return {
    statusCode: HttpStatusCode.Ok,
    message: message,
    data: data,
  };
}

function httpStatusText(httpStatusCode: number) {
  return HttpStatusCode[httpStatusCode].replace(/([A-Z])/g, ' $1').trim();
}
