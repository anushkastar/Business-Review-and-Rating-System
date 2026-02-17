# Postman flow to test each role (User, Business, Admin)

**Base URL:** `http://localhost:3001/api`

**Auth header (when needed):**  
`Authorization` → `Bearer <paste_token_here>`

**Content-Type:** `application/json` for JSON bodies.

---

## Setup once

1. Start server: `npm run server` (from project root).
2. Seed DB (creates admin + sample data): `npm run seed`.
3. In Postman, set **Base URL** as an environment variable `baseUrl` = `http://localhost:3001/api`, or use full URLs below.

---

## 1. Test USER role

### Step 1 — Register as user (or skip if already have one)
- **Method:** POST  
- **URL:** `http://localhost:3001/api/auth/register`  
- **Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "user123",
  "role": "user"
}
```
- **Expected:** 201, response has `user` and `token`. **Copy the `token`** for next requests.

### Step 2 — Login (if you didn’t register)
- **Method:** POST  
- **URL:** `http://localhost:3001/api/auth/login`  
- **Body (raw JSON):**
```json
{
  "email": "testuser@example.com",
  "password": "user123"
}
```
- **Expected:** 200 with `user` and `token`. Copy `token`.

### Step 3 — Get current user (needs token)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/auth/me`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, your user object (no password).

### Step 4 — List businesses (no token)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/businesses`  
- Optional query: `?category=Restaurant&location=Downtown&sort=rating` or `sort=reviews`.  
- **Expected:** 200, array of approved businesses.

### Step 5 — Get one business (no token)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/businesses/<business_id>`  
- Use an `_id` from Step 4 response.  
- **Expected:** 200, single business + `reviewCount`.

### Step 6 — Submit a review (needs user token)
- **Method:** POST  
- **URL:** `http://localhost:3001/api/reviews`  
- **Headers:** `Authorization: Bearer <token>`  
- **Body (raw JSON):**
```json
{
  "businessId": "<business_id_from_step_4>",
  "rating": 5,
  "comment": "Great place!"
}
```
- **Expected:** 201, created/updated review.

### Step 7 — My reviews (needs user token)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/reviews/my`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, array of your reviews (with business info).

### Step 8 — List reviews for a business (no token)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/reviews/business/<business_id>`  
- **Expected:** 200, array of reviews (approved + your own if logged in).

---

## 2. Test BUSINESS role

### Step 1 — Register as business
- **Method:** POST  
- **URL:** `http://localhost:3001/api/auth/register`  
- **Body (raw JSON):**
```json
{
  "name": "Test Business Owner",
  "email": "businessowner@example.com",
  "password": "business123",
  "role": "business"
}
```
- **Expected:** 201, copy `token`.

### Step 2 — Login (alternative)
- **Method:** POST  
- **URL:** `http://localhost:3001/api/auth/login`  
- **Body:** `{ "email": "businessowner@example.com", "password": "business123" }`  
- Or use seeded: `business@example.com` / `business123`. Copy `token`.

### Step 3 — Get current user
- **Method:** GET  
- **URL:** `http://localhost:3001/api/auth/me`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, user with `role: "business"`.

### Step 4 — Create a business (needs business token)
- **Method:** POST  
- **URL:** `http://localhost:3001/api/businesses`  
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`  
- **Body (raw JSON):**
```json
{
  "name": "My New Restaurant",
  "location": "Downtown",
  "category": "Restaurant",
  "description": "Best food in town."
}
```
- (Optional: send as form-data with a `photo` file instead of JSON if you want image upload.)  
- **Expected:** 201, created business with `approved: false`. Copy `_id` of the business.

### Step 5 — My businesses list (needs business token)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/businesses/my/list`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, array of businesses you own (including unapproved).

### Step 6 — Public list (should not include your unapproved one yet)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/businesses`  
- **Expected:** 200, only approved businesses (your new one appears after admin approves).

---

## 3. Test ADMIN role

Admin cannot register via API. Use the **seed** account.

### Step 1 — Login as admin
- **Method:** POST  
- **URL:** `http://localhost:3001/api/auth/login`  
- **Body (raw JSON):**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
- **Expected:** 200, copy `token`. User role should be `admin`.

### Step 2 — Dashboard (needs admin token)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/admin/dashboard`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, counts: `businesses`, `approvedBusinesses`, `pendingBusinesses`, `reviews`, `pendingReviews`, `users`.

### Step 3 — List all businesses (admin)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/admin/businesses`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, all businesses (approved + pending) with owner.

### Step 4 — Approve a business (admin)
- **Method:** PATCH  
- **URL:** `http://localhost:3001/api/admin/businesses/<business_id>/approve`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, updated business with `approved: true`.

### Step 5 — Reject a business (admin)
- **Method:** PATCH  
- **URL:** `http://localhost:3001/api/admin/businesses/<business_id>/reject`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, business with `approved: false`.

### Step 6 — Pending reviews (admin)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/admin/reviews/pending`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, list of reviews with `approved: false`.

### Step 7 — Approve a review (admin)
- **Method:** PATCH  
- **URL:** `http://localhost:3001/api/admin/reviews/<review_id>/approve`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, review with `approved: true` (and business avgRating updated).

### Step 8 — Reject a review (admin)
- **Method:** PATCH  
- **URL:** `http://localhost:3001/api/admin/reviews/<review_id>/reject`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, review with `approved: false`.

### Step 9 — All reviews for a business (admin)
- **Method:** GET  
- **URL:** `http://localhost:3001/api/admin/businesses/<business_id>/reviews`  
- **Headers:** `Authorization: Bearer <token>`  
- **Expected:** 200, all reviews for that business (approved + pending).

---

## Quick checklist

| Role    | Must do first              | Then test |
|---------|----------------------------|-----------|
| **User**    | Register (role: user) or login → get token | GET /auth/me, GET /businesses, GET /businesses/:id, POST /reviews, GET /reviews/my, GET /reviews/business/:id |
| **Business**| Register (role: business) or login → get token | GET /auth/me, POST /businesses, GET /businesses/my/list, GET /businesses |
| **Admin**   | Login with admin@example.com / admin123 (after seed) → get token | GET /admin/dashboard, GET /admin/businesses, PATCH approve/reject business & review, GET /admin/reviews/pending, GET /admin/businesses/:id/reviews |

---

## Optional: Health check (no auth)

- **Method:** GET  
- **URL:** `http://localhost:3001/api/health`  
- **Expected:** 200, `{ "ok": true }`.
