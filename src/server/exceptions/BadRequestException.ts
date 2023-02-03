import { BAD_REQUEST_STATUS } from 'server/constants/http.status';

export class BadRequestException {
  error: string = 'Bad Request';
  statusCode = BAD_REQUEST_STATUS;
  message?: string = undefined;
  errors?: string[] = undefined;

  constructor(message?: string, errors?: string[]) {
    this.message = message;
    this.errors = errors;
  }
}
