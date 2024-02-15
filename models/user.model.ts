import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { IUser } from '../interfaces/models.interface';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    tags: {
      type: [
        {
          title: { type: String, required: true },
          color: { type: String, required: true },
        },
      ],
      default: () => [
        { title: 'love', color: '#FF0000' },
        { title: 'work', color: '#00FF00' },
        { title: 'family', color: '#0000FF' },
        { title: 'health', color: '#FFA500' },
        { title: 'hobby', color: '#800080' },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// * Middleware

// Save Password (for new or existing user)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  // Register time stamp of change
  // if (this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

// * Methods

async function correctPassword(candidatePassword, userPassword): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.correctPassword = correctPassword;

/**
 * Checks if JWTTimestamp is older than current password change time stamp
 * @param this
 * @param JWTTimestamp time stamp of token
 * @returns false if password not changed after this token
 */
function checkPasswordChangedAfter(this: IUser, JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
}
userSchema.methods.checkPasswordChangedAfter = checkPasswordChangedAfter;

// * Export

const User = mongoose.model<IUser>('User', userSchema);
export default User;
