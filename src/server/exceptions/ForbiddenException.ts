import { FORBIDDEN_STATUS } from 'server/constants/http.status';

export class ForbiddenException {
  error: string = 'Forbidden';
  statusCode = FORBIDDEN_STATUS;
  message?: string = undefined;
  errors?: string[] = undefined;

  constructor(message?: string, errors?: string[]) {
    this.message = message;
    this.errors = errors;
  }
}
