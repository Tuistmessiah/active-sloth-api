import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active: boolean;
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
  checkPasswordChangedAfter: (JWTTimestamp: number) => boolean;
}

export interface IEntry {
  text: string;
  tag?: string;
}

export interface IDay extends Document {
  userFK: Types.ObjectId | string;
  date: Date;
  title?: string;
  entries: IEntry[];
}
