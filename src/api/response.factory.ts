import { StatusCodes } from "http-status-codes";
import { Response } from 'express';

interface ApiResponse<T = any> {
  ok(data: T): void;
  created(data: T): void;
  badRequest(message: string, details?: object): void;
  conflict(message: string): void;
  serverError(error: Error): void;
}

const responseFactory = (res: Response): ApiResponse => {
  return {
    ok: (data) => res.status(StatusCodes.OK).json(data),
    created: (data) => res.status(StatusCodes.CREATED).json(data),
    badRequest: (message, details) => res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      error: "Bad Request",
      message,
      details
    }),
    conflict: (message) => res.status(StatusCodes.CONFLICT).json({
      code: StatusCodes.CONFLICT,
      error: "Conflict",
      message
    }),
    serverError: (error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: error.message
    })
  };
}

export {
    responseFactory
}