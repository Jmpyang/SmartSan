import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import { User } from '../models/User';

describe('Auth Endpoints', () => {
    const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'citizen',
        phone: '1234567890',
    };

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.body.data.user.email).toBe(userData.email);
        });

        it('should not register user with existing email', async () => {
            await User.create(userData); // Create first

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.status).toBe(409); // 400 or 409 depending on implementation, actually controller throws ConflictError which is 409 usually
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send(userData);
        });

        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userData.email,
                    password: userData.password,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toBeDefined();
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userData.email,
                    password: 'wrongpassword',
                });

            expect(res.status).toBe(401);
        });
    });
});
