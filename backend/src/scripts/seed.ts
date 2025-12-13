import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Report } from '../models/Report';
import { Worker } from '../models/Worker';
import { EmergencyAlert } from '../models/EmergencyAlert';
import { config } from '../config';

const seedDatabase = async () => {
    try {
        console.log('🌱 Connecting to database...');
        // Use the URI from config, but we need to ensure it's not production if we're wiping
        if (config.nodeEnv === 'production' && !process.argv.includes('--force')) {
            console.error('❌ Cannot seed production database without --force flag');
            process.exit(1);
        }

        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to database');

        console.log('🧹 Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Report.deleteMany({}),
            Worker.deleteMany({}),
            EmergencyAlert.deleteMany({}),
        ]);
        console.log('✅ Data cleared');

        console.log('👥 Creating users...');

        // We pass plain text passwords because the User model pre-save hook handles hashing
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                phone: '1234567890',
                isVerified: true,
            },
            {
                name: 'Worker One',
                email: 'worker1@example.com',
                password: 'password123',
                role: 'worker',
                phone: '1234567891',
                isVerified: true,
            },
            {
                name: 'Worker Two',
                email: 'worker2@example.com',
                password: 'password123',
                role: 'worker',
                phone: '1234567892',
                isVerified: true,
            },
            {
                name: 'John Citizen',
                email: 'citizen@example.com',
                password: 'password123',
                role: 'citizen',
                phone: '1234567893',
                isVerified: true,
            },
        ]);

        const admin = users[0];
        const worker1 = users[1];
        const worker2 = users[2];
        const citizen = users[3];

        console.log('👷 Creating worker profiles...');
        await Worker.create([
            {
                userId: worker1._id,
                zone: 'North',
                status: 'available',
                rating: 4.5,
                completedReports: 10,
            },
            {
                userId: worker2._id,
                zone: 'South',
                status: 'busy',
                rating: 4.8,
                completedReports: 15,
            },
        ]);

        console.log('📝 Creating reports...');
        await Report.create([
            {
                title: 'Overflowing Bin',
                description: 'Trash bin at central park is overflowing.',
                category: 'garbage_overflow',
                location: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.730610],
                    address: 'Central Park, NY',
                },
                status: 'pending',
                priority: 'high',
                userId: citizen._id,
                isAnonymous: false,
            },
            {
                title: 'Broken Street Light',
                description: 'Street light not working on 5th Ave.',
                category: 'other',
                location: {
                    type: 'Point',
                    coordinates: [-73.985130, 40.758896],
                    address: '5th Ave, NY',
                },
                status: 'assigned',
                priority: 'medium',
                userId: citizen._id,
                assignedWorker: worker2._id,
                isAnonymous: false,
            },
            {
                title: 'Anonymous Report',
                description: 'Messy alleyway.',
                category: 'illegal_dumping',
                location: {
                    type: 'Point',
                    coordinates: [-73.957648, 40.723725],
                    address: 'Alleyway, NY',
                },
                status: 'pending',
                priority: 'low',
                isAnonymous: true,
            },
        ]);

        console.log('🚨 Creating emergency alerts...');
        await EmergencyAlert.create([
            {
                message: 'Flooding near downtown!',
                location: {
                    type: 'Point',
                    coordinates: [-74.0060, 40.7128],
                    address: 'Downtown, NY',
                },
                severity: 'critical',
                status: 'active',
                userId: citizen._id,
            },
        ]);

        console.log('✨ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
