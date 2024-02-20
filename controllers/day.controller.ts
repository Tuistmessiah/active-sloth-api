import { parseISO, startOfDay, startOfMonth, endOfMonth, parse } from 'date-fns';
import { Request, Response } from 'express';
import { CreateDay, GetDaysInCurrentMonth, UpdateDay } from '../interfaces/api.interface';

import { catchAsync, error } from '../utils/error-handling.utils';
import { transformDayToDTO } from '../utils/parser.utils';
import { success } from '../utils/controller.utils';
import { filterObj } from '../utils/data.utils';
import Day from '../models/day.model';

/**
 * @otherParams "user._id"
 */
const getDaysInCurrentMonth = catchAsync(async (req: Request, res: Response): GetDaysInCurrentMonth => {
  const userId = req.user._id;
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const days = await Day.find({
    userFK: userId,
    date: { $gte: start, $lte: end },
  });
  const dayDTOs = days.map(transformDayToDTO);

  return await success(res, 200, dayDTOs);
});

/**
 * @queryParams "start=YYYY-MM", "end=YYYY-MM"
 * @otherParams "user._id"
 */
const getDaysInMonths = catchAsync(async (req: Request, res: Response, next) => {
  const userId = req.user._id;
  const startDate = startOfMonth(parse(req.query.start as string, 'yyyy-MM', new Date()));
  const endDate = endOfMonth(parse(req.query.end as string, 'yyyy-MM', new Date()));

  if (startDate > endDate) return error('Start date must be before end date.', 400, next);

  const days = await Day.find({
    userFK: userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  res.status(200).json({ status: 'success', data: days });
});

/**
 * Create Day as a user
 * @otherParams "user._id"
 */
const createDay = catchAsync(async (req: Request, res: Response): CreateDay => {
  const newDay = await Day.create({ ...req.body, userFK: req.user._id });
  const newDayDTO = transformDayToDTO(newDay);
  return await success(res, 201, newDayDTO);
});

/**
 * Update Day as a user
 * @body "Day"
 * @params "dayId"
 * @otherParams "user._id"
 */
const updateDay = catchAsync(async (req: Request, res: Response): UpdateDay => {
  const filteredBody = filterObj(req.body, 'title', 'entries');
  const updatedDay = await Day.findOneAndUpdate({ _id: req.params.dayId, userFK: req.user._id }, filteredBody, {
    new: true,
    runValidators: true,
  });
  const updatedDayDTO = transformDayToDTO(updatedDay);
  return await success(res, 200, updatedDayDTO);
});

/**
 * Delete Day as a user
 * @params "dayId"
 * @otherParams "user._id"
 */
const deleteDay = catchAsync(async (req: Request, res: Response) => {
  await Day.findByIdAndDelete({ _id: req.params.dayId, userFK: req.user._id });

  res.status(204).json({ status: 'success', data: null });
});

/**
 * Update Entry to Day as a user
 * @body "entries"
 * @otherParams "Day"
 */
const updateEntries = async (req: Request, res: Response) => {
  const currentDay = req.Day;
  currentDay.entries = req.body.entries;
  await currentDay.save();

  res.status(200).json({ status: 'success', data: currentDay });
};

export default {
  getDaysInCurrentMonth,
  getDaysInMonths,
  createDay,
  updateDay,
  deleteDay,
  updateEntries,
};
