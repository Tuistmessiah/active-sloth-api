import { CookieOptions, Request, Response, NextFunction } from 'express';

import { IUser } from './models.interface';

export interface CustomError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
}

export interface AuthResponse {
  status: 'success';
  message: string;
  token?: string;
  data: {
    user: IUser;
  };
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

/**
 * Signup
 */
export type SignupEndpointReq = Request<{}, {}, IUserInputDTO>;
export type SignupRequest = SignupEndpointReq;
export type SignupResponse = Response<AuthResponse>;
export type SignupEndpointRes = SignupResponse | CustomError;
