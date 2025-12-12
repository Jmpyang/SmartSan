import mongoose, { Schema } from 'mongoose';
import { IReport } from '../types';

const reportSchema = new Schema<IReport>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ['garbage_overflow', 'broken_equipment', 'illegal_dumping', 'blocked_drain', 'other'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords: number[]) {
            return coords.length === 2 && 
                   coords[0] >= -180 && coords[0] <= 180 && // longitude
                   coords[1] >= -90 && coords[1] <= 90;     // latitude
          },
          message: 'Invalid coordinates',
        },
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'completed', 'rejected'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium',
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 5; // Max 5 images per report
        },
        message: 'Maximum 5 images allowed per report',
      },
    },
    userId: {
      type: String,
      ref: 'User',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    assignedWorker: {
      type: String,
      ref: 'Worker',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location-based queries
reportSchema.index({ location: '2dsphere' });

// Index for efficient queries
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ assignedWorker: 1, status: 1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);
