import mongoose, { Schema } from 'mongoose';
import { IWorker } from '../types';

const workerSchema = new Schema<IWorker>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
      unique: true,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    activeReports: {
      type: [String],
      ref: 'Report',
      default: [],
    },
    completedReports: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
workerSchema.index({ status: 1, zone: 1 });
workerSchema.index({ userId: 1 });

export const Worker = mongoose.model<IWorker>('Worker', workerSchema);
