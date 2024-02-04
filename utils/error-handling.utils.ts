import { NextFunction } from 'express';
import mongoose from 'mongoose';

export function catchAsync(fn: (req, res, next) => Promise<void>) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

/**
 * Calls next(...) which automatically goes to error middleware
 * @param message error message
 * @param statusCode error status code
 * @returns
 */
export function error(message: string, statusCode: number, next: NextFunction) {
  return next(new AppError(message, statusCode));
}

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

export const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

export const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => (el as any).message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

export const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

export const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

export const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

export const sendErrorProd = (err, res) => {
  // Operational, error: catched purposedly
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export function isValidId(paramId: string) {
  return mongoose.Types.ObjectId.isValid(paramId);
}
