# Review Platform (MERN)

Crowdsourced review platform with **3 roles**: User, Business, Admin.

- **User**: Review and rate businesses, upload photos, view own reviews and business avg ratings.
- **Business**: Add business (name, photo, location), list my businesses with avg rating.
- **Admin**: Approve businesses and approve/reject user reviews.

## Stack

- **Frontend**: React, Tailwind CSS, React Router, Vite
- **Backend**: Node, Express, JWT, bcrypt, multer, Cloudinary
- **Database**: MongoDB (Mongoose)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Set `MONGO_URI` (default: `mongodb://127.0.0.1:27017/review-platform`)
   - Set `JWT_SECRET`
   - For photo uploads, set Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

3. **Seed (optional)**
   ```bash
   npm run seed
   ```
   Creates: admin@example.com / admin123, business@example.com / business123, user@example.com / user123.

4. **Run**
   ```bash
   npm run dev
   ```
   - API: http://localhost:3001
   - Client: http://localhost:5173 (proxies /api to backend)

## Pages

- **Home**: Browse businesses with filters (category, location) and sort (rating, review count).
- **Business detail**: View business photo, location, avg rating, reviews; users can submit review + photos.
- **My Reviews** (user): List of reviewed businesses with rating and approval status.
- **My Businesses** (business): Add business (name, photo, location, category), list with avg rating.
- **Admin**: Dashboard counts; approve/reject businesses; approve/reject reviews.
