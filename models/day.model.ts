import mongoose from 'mongoose';
import { isFuture, startOfDay } from 'date-fns';
import { IDay } from '../interfaces/models.interface';

const entrySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    tag: {
      type: String,
      lowercase: true,
    },
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    userFK: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Day requires a user'] },
    date: {
      type: Date,
      default: () => startOfDay(new Date()),
      validate: {
        validator: function (value: Date) {
          const dateValue = startOfDay(value);
          return !isFuture(dateValue);
        },
        message: 'Date cannot be in the future.',
      },
    },
    title: String,
    entries: [entrySchema],
  },
  {
    timestamps: true,
  }
);

daySchema.index({ userFK: 1, date: 1 }, { unique: true });

/**
 * On create: Check if same day already exists
 */
daySchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  const doc = this;
  doc.date = startOfDay(doc.date || new Date());

  try {
    const existingDoc = await Day.findOne({ userFK: doc.userFK, date: doc.date });
    if (existingDoc) throw new Error('A document for this user and date already exists.');

    next();
  } catch (error) {
    next(error);
  }
});

const Day = mongoose.model<IDay>('Day', daySchema);

export default Day;
