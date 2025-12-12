import mongoose, { Schema } from 'mongoose';
import { ISession } from '../types';

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries and auto-deletion
sessionSchema.index({ userId: 1 });
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

export const Session = mongoose.model<ISession>('Session', sessionSchema);
