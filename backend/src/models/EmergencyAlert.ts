import mongoose, { Schema } from 'mongoose';
import { IEmergencyAlert } from '../types';

const emergencyAlertSchema = new Schema<IEmergencyAlert>(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
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
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    severity: {
      type: String,
      required: true,
      enum: ['medium', 'high', 'critical'],
      default: 'high',
    },
    userId: {
      type: String,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },
    images: {
      type: [String],
      default: [],
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index
emergencyAlertSchema.index({ location: '2dsphere' });
emergencyAlertSchema.index({ status: 1, severity: -1, createdAt: -1 });

export const EmergencyAlert = mongoose.model<IEmergencyAlert>('EmergencyAlert', emergencyAlertSchema);
