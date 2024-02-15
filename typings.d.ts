import { IDay, IUser } from './interfaces/models.interface';
import { Request } from 'express';

// declare namespace Express {
//   export interface Request {
//     user?: IUser;
//   }
// }

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    requestTime?: string;
    Day?: IDay;
  }
}
