import { Response } from 'express';
import { AuthRequest, TokenPayload } from '../types';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { Worker } from '../models/Worker';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthenticationError, ConflictError, ValidationError } from '../utils/errors';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, name, phone, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Create user
  const user = await User.create({
    email,
    password,
    name,
    phone,
    role: role || 'citizen',
  });

  // If worker role, create worker profile
  if (user.role === 'worker') {
    await Worker.create({
      userId: user._id,
      zone: req.body.zone || 'unassigned',
      status: 'offline',
    });
  }

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt,
  });

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user,
      accessToken,
    },
  });
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, rememberMe } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token with extended expiry if rememberMe
  const expiresAt = new Date();
  const daysToExpire = rememberMe ? 30 : 7;
  expiresAt.setDate(expiresAt.getDate() + daysToExpire);

  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt,
  });

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: daysToExpire * 24 * 60 * 60 * 1000,
  });

  // Remove password from response
  const userResponse = user.toJSON();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      accessToken,
    },
  });
};

export const refreshAccessToken = async (req: AuthRequest, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new AuthenticationError('No refresh token provided');
  }

  // Verify refresh token
  let decoded: TokenPayload;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  // Check if session exists
  const session = await Session.findOne({ refreshToken, userId: decoded.userId });
  if (!session) {
    throw new AuthenticationError('Session not found');
  }

  // Check if session expired
  if (session.expiresAt < new Date()) {
    await Session.deleteOne({ _id: session._id });
    throw new AuthenticationError('Session expired');
  }

  // Generate new access token
  const tokenPayload: TokenPayload = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };

  const newAccessToken = generateAccessToken(tokenPayload);

  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
    },
  });
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (refreshToken) {
    await Session.deleteOne({ refreshToken });
  }

  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logout successful',
  });
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError('Not authenticated');
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  res.json({
    success: true,
    data: { user },
  });
};

export const verifyToken = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: { user: req.user },
  });
};
