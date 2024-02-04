import { startOfMonth, endOfMonth, parse } from 'date-fns';

import { catchAsync, error } from '../utils/error-handling.utils';
import { filterObj } from '../utils/data.utils';
import Day from '../models/day.model';

/**
 * @otherParams "user._id"
 */
const getDaysInCurrentMonth = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const days = await Day.find({
    userFK: userId,
    date: { $gte: start, $lte: end },
  });

  res.status(200).json({ status: 'success', data: days });
});

/**
 * @queryParams "start=YYYY-MM", "end=YYYY-MM"
 * @otherParams "user._id"
 */
const getDaysInMonths = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const startDate = startOfMonth(parse(req.query.start, 'yyyy-MM', new Date()));
  const endDate = endOfMonth(parse(req.query.end, 'yyyy-MM', new Date()));

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
const createDay = catchAsync(async (req, res) => {
  const newDay = await Day.create({ ...req.body, userFK: req.user._id });

  res.status(201).json({ status: 'success', data: { data: newDay } });
});

/**
 * Update Day as a user
 * @body "Day"
 * @params "dayId"
 * @otherParams "user._id"
 */
const updateDay = catchAsync(async (req, res) => {
  const filteredBody = filterObj(req.body, 'title');
  const updatedDay = await Day.findOneAndUpdate({ _id: req.params.dayId, userFK: req.user._id }, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', data: updatedDay });
});

/**
 * Delete Day as a user
 * @params "dayId"
 * @otherParams "user._id"
 */
const deleteDay = catchAsync(async (req, res) => {
  await Day.findByIdAndDelete({ _id: req.params.dayId, userFK: req.user._id });

  res.status(204).json({ status: 'success', data: null });
});

/**
 * Update Entry to Day as a user
 * @body "entries"
 * @otherParams "Day"
 */
const updateEntries = async (req, res) => {
  console.log({ req });
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
