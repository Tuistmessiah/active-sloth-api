import User from '../models/user.model';
import { catchAsync, error } from '../utils/error-handling.utils';

/**
 * Get only allowedFields from object
 * @param obj object to be filtered
 * @param allowedFields fields to be included in the filter
 */
const filterObj = (obj: { [i: string]: string }, ...allowedFields: string[]) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

/**
 * Update User properties (not email nor password)
 * @body "name", "tags"
 * @params "dayId"
 * @otherParams "user._id"
 */
export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return error('This route is not for password updates. Please use /updateMyPassword.', 400, next);
  }
  const filteredBody = filterObj(req.body, 'name', 'tags');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
