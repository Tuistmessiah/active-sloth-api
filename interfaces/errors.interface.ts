// TODO - find better name
export interface CustomError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
}
export interface ValidationErrorDB extends Error {
  errors: {
    message: string;
  }[];
}

export interface DuplicateFieldsDB extends Error {
  errmsg: string;
}

export interface CastErrorDB extends Error {
  path: string;
  value: string | number; // ?
}

export interface OwnershipError {
  status: string;
  message: string;
}