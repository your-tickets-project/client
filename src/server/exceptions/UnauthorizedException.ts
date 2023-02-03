import { UNAUTHORIZED_STATUS } from 'server/constants/http.status';

export class UnauthorizedException {
  error: string = 'Unauthorized';
  statusCode = UNAUTHORIZED_STATUS;
  message?: string = undefined;
  errors?: string[] = undefined;

  constructor(message?: string, errors?: string[]) {
    this.message = message;
    this.errors = errors;
  }
}
