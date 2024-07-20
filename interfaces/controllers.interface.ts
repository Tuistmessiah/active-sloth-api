import { Request, Response } from 'express';

import { IUser } from './models.interface';
import { CustomError } from './errors.interface';

export interface AuthResponse extends Response {
  responseStatus: string;
  message: string;
  token?: string;
  data: {
    user: IUser;
  };
}

export interface AuthRequest extends Request{
  body: IUserInputDTO;
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
export type SignupEndpointReq = Request<IUserInputDTO>;
export type SignupRequest = SignupEndpointReq;
export type SignupResponse = Response<AuthResponse>;
export type SignupEndpointRes = SignupResponse | CustomError;
