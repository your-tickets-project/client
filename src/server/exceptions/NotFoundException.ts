import { NOT_FOUND_STATUS } from 'server/constants/http.status';

export class NotFoundException {
  error: string = 'Not Found';
  statusCode = NOT_FOUND_STATUS;
  message?: string = undefined;
  errors?: string[] = undefined;

  constructor(message?: string, errors?: string[]) {
    this.message = message;
    this.errors = errors;
  }
}
