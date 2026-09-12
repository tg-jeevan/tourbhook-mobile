export class ApiException extends Error {
  statusCode: number | null;

  constructor(message: string, statusCode: number | null = null) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
  }

  toString(): string {
    return `ApiException(${this.statusCode}): ${this.message}`;
  }
}

export class BadRequestException extends ApiException {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BadRequestException';
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: string) {
    super(message, 403);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends ApiException {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundException';
  }
}

export class ServerException extends ApiException {
  constructor(message: string) {
    super(message, 500);
    this.name = 'ServerException';
  }
}

export class NetworkException extends ApiException {
  constructor(message: string) {
    super(message, null);
    this.name = 'NetworkException';
  }
}

export class ApiTimeoutException extends ApiException {
  constructor(message: string) {
    super(message, null);
    this.name = 'ApiTimeoutException';
  }
}