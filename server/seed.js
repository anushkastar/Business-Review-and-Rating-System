import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Business from './models/Business.js';
import Review from './models/Review.js';

await connectDB();

await User.deleteMany({});
await Business.deleteMany({});
await Review.deleteMany({});


const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' });
const businessUser = await User.create({ name: 'Business Owner', email: 'business@example.com', password: 'business123', role: 'business' });
const user1 = await User.create({ name: 'Alice', email: 'user@example.com', password: 'user123', role: 'user' });

const [b1, b2] = await Business.insertMany([
  { name: 'Golden Fork Restaurant', location: 'Downtown', category: 'Restaurant', description: 'Fine dining.', owner: businessUser._id, approved: true, avgRating: 4.5 },
  { name: 'Quick Bites Cafe', location: 'Midtown', category: 'Cafe', description: 'Coffee and snacks.', owner: businessUser._id, approved: true, avgRating: 4 }
]);

await Review.insertMany([
  { user: user1._id, business: b1._id, rating: 5, comment: 'Amazing food!', approved: true },
  { user: user1._id, business: b2._id, rating: 4, comment: 'Great coffee.', approved: true }
]);

console.log('Seed done. Login: admin@example.com / admin123, business@example.com / business123, user@example.com / user123');
process.exit(0);
