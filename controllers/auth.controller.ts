import jwt from 'jsonwebtoken';
import { CookieOptions, Request, Response, NextFunction } from 'express';

import { IUser } from '../interfaces/models.interface';

import User from '../models/user.model';
import { AppError, catchAsync, error } from '../utils/error-handling.utils';
import { AuthResponse, IUserInputDTO, SignupRequest, SignupResponse } from '../interfaces/controllers.interface';
import { success } from '../utils/controller.utils';

const DAY_TO_MS = 24 * 60 * 60 * 1000;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Stores jwt in cookie.
 */
const createSendToken = (user: IUser, res) => {
  const outputUser = user;
  const token = signToken(user._id);
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * DAY_TO_MS),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);
  outputUser.password = undefined;

  return { outputUser, token };
};

const signup = catchAsync(async function (req: SignupRequest, res: SignupResponse) {
  const newUser: IUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const { outputUser, token } = createSendToken(newUser, res);

  res.status(201).json({
    status: 'success',
    message: 'Signup',
    token,
    data: {
      user: outputUser,
    },
  });
});

const login = catchAsync(async (req: Request<{}, {}, IUserInputDTO>, res: Response<AuthResponse>, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide email and password!', 400));

  const user = await User.findOne({ email }).select('+password'); // default 'password' is not selected
  if (!user || !(await user.correctPassword(password, user.password))) {
    return error('Incorrect email or password', 401, next);
  }

  const { outputUser, token } = createSendToken(user, res);

  res.status(200).json({
    status: 'success',
    message: 'Login',
    token,
    data: {
      user: outputUser,
    },
  });
});

/** Protected */
const checkSession = catchAsync(async (req: Request<{}, {}, IUserInputDTO>, res: Response<AuthResponse>, next: NextFunction) => {
  return await success(res, 200, { user: req.user });
});

export default {
  signup,
  login,
  checkSession,
};
