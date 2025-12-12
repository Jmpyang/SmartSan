import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Report } from '../models/Report';

describe('Report Endpoints', () => {
    let token: string;
    let userId: string;

    const reportData = {
        title: 'Test Report',
        description: 'This is a test description',
        category: 'garbage_overflow',
        location: {
            type: "Point",
            coordinates: [-73.935242, 40.730610],
            address: "Test Address"
        },
        priority: 'low',
        isAnonymous: false,
    };

    beforeAll(async () => {
        await User.deleteMany({});
        await Report.deleteMany({});

        // Register and login to get token
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Report Tester',
                email: 'report@example.com',
                password: 'password123',
                role: 'citizen',
                phone: '0987654321',
            });

        token = res.body.data.accessToken;
        userId = res.body.data.user._id;
    });

    afterEach(async () => {
        await Report.deleteMany({});
    });

    describe('POST /api/reports', () => {
        it('should create a new report when authenticated', async () => {
            const res = await request(app)
                .post('/api/reports')
                .set('Authorization', `Bearer ${token}`)
                .send(reportData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.report.title).toBe(reportData.title);
        });

        it('should create an anonymous report without auth', async () => {
            const anonData = { ...reportData, isAnonymous: true };
            const res = await request(app)
                .post('/api/reports')
                .send(anonData);

            expect(res.status).toBe(201);
            expect(res.body.data.report.isAnonymous).toBe(true);
        });
    });

    describe('GET /api/reports', () => {
        it('should get all reports', async () => {
            // Create a report first
            await request(app)
                .post('/api/reports')
                .set('Authorization', `Bearer ${token}`)
                .send(reportData);

            const res = await request(app)
                .get('/api/reports')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.reports.length).toBeGreaterThan(0);
        });
    });
});
