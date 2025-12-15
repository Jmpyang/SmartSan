import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'citizen' | 'worker' | 'admin';
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IReport extends Document {
  title: string;
  description: string;
  category: 'garbage_overflow' | 'broken_equipment' | 'illegal_dumping' | 'blocked_drain' | 'other';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
  };
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  images: string[];
  userId?: string; // Optional for anonymous reports
  isAnonymous: boolean;
  assignedWorker?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface IWorker extends Document {
  userId: string;
  zone: string;
  level: 'local' | 'state' | 'national';
  jurisdiction: string;
  activeReports: string[];
  completedReports: number;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmergencyAlert extends Document {
  message: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  severity: 'medium' | 'high' | 'critical';
  userId?: string;
  status: 'active' | 'resolved';
  images: string[];
  createdAt: Date;
  resolvedAt?: Date;
}

export interface ISession extends Document {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}
