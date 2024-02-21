import { NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import { RequestWithIUser } from '../interfaces/middleware.interface';

import { catchAsync, error } from '../utils/error-handling.utils';
import User from '../models/user.model';

interface MiddlewareOptions {
  model: string;
  key: 'params' | 'body';
  idField: string;
}

/**
 * Checks if user has permission over this document based on FK from document
 * @param options setup where compaing id is and what is its key name
 * @obs assume `user` is populated in the request by previous middleware
 * @returns function middleware and document in req[model]
 */
export function checkOwnership(options: MiddlewareOptions) {
  return catchAsync(async (req: Request, res, next) => {
    const { model, key, idField } = options;
    const ChildModel = mongoose.model(model);
    const docId = req[key][idField];
    const childDoc = await ChildModel.findById(docId);
    if (!childDoc) return res.status(404).json({ status: 'fail', message: `'${model}' does not exist` });

    const parentId = req.user?._id.toString();
    const ownerId = childDoc.userFK.toString();
    if (parentId !== ownerId) return res.status(403).json({ status: 'fail', message: 'Unauthorized access' });

    req[model] = childDoc;
    next();
  });
}

/**
 * Middleware: Grants access if token is valid for user (checks token from Bearer and then from Cookies)
 * @return add to request "user"
 */
export function protect() {
  return catchAsync(async (req: RequestWithIUser, _res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    let token: string | undefined = undefined;

    if (authorization && authorization?.startsWith('Bearer')) token = authorization.split(' ')[1];
    else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token) return error('You are not logged in! Please log in to get access.', 401, next);

    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check user for this token
    const currentUser = await User.findById(decodedToken.id);
    if (!currentUser) return error('Token not valid.', 401, next);

    // Check if password changed after this token
    if (currentUser.checkPasswordChangedAfter(decodedToken.iat)) {
      return error('Token not valid anymore! Please log in again.', 401, next);
    }

    req.user = currentUser;
    next();
  });
}

/**
 * Middleware: Grants access only to user with specified roles
 */
export function restrict(...roles) {
  return (req, _res, next) => {
    // roles ['admin', 'user']. role='user'
    if (!roles.includes(req.user.role)) return error('You do not have permission to perform this action.', 403, next);
    next();
  };
}
