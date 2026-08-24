import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ErrorHandlingService {
  handleError(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      error.message || 'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
