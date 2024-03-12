import { IDay, IUser } from './interfaces/models.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    requestTime?: string;
    Day?: IDay;
  }
}
