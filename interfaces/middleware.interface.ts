import { Request } from 'express';
import { IUser } from './models.interface';

export interface RequestWithIUser extends Request {
  user?: IUser;
}
