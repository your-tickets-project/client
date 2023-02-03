import { INTERNAL_SERVER_ERROR_STATUS } from 'server/constants/http.status';

export class InternalServerErrorException {
  message?: string = undefined;
  error: string = 'Internal Server Error';
  statusCode = INTERNAL_SERVER_ERROR_STATUS;

  constructor(message?: string) {
    this.message = message;
  }
}
