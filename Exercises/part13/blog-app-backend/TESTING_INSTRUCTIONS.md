# Manual Testing Instructions

## Prerequisites
1. Make sure your backend server is **NOT running**
2. Make sure your database is accessible (check `DATABASE_URL` in `.env`)

---

## Step 1: Delete Existing Tables (Clean Slate)

**Option A: Using SQL directly**
Connect to your PostgreSQL database and run:
```sql
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS "SequelizeMeta" CASCADE;
```

**Option B: Using psql command line**
```bash
psql $DATABASE_URL -c "DROP TABLE IF EXISTS blogs CASCADE; DROP TABLE IF EXISTS users CASCADE; DROP TABLE IF EXISTS \"SequelizeMeta\" CASCADE;"
```

---

## Step 2: Run Migrations

```bash
npm run migrate
```

**Expected output:**
- Should show migration files being executed
- Should create `users` and `blogs` tables
- Should create `SequelizeMeta` table to track migrations

**Verify in database:**
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'blogs', 'SequelizeMeta');

-- Check users table has timestamps
\d users
-- Should show: created_at, updated_at columns

-- Check blogs table has timestamps and year
\d blogs
-- Should show: created_at, updated_at, year columns
```

---

## Step 3: Start Your Backend Server

```bash
npm start
# or
node index.js
```

**Expected:** Server should start without errors, connect to database successfully.

---

## Step 4: Test Exercise 13.17 (Timestamps)

### 4.1 Create a User (to get a token)

**Request:**
```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "Test User",
  "username": "test@example.com",
  "password": "password123"
}
```

**Expected:** User created with `id`, `name`, `username`, `created_at`, `updated_at` fields

**Verify:** Check `created_at` and `updated_at` are present and have current timestamp

### 4.2 Login to Get Token

**Request:**
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "test@example.com",
  "password": "password123"
}
```

**Expected:** Returns token - **save this token for next steps**

### 4.3 Create a Blog (Check Timestamps)

**Request:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [YOUR_TOKEN_FROM_STEP_4.2]
Content-Type: application/json

{
  "title": "Test Blog",
  "author": "Test Author",
  "url": "https://example.com",
  "likes": 5
}
```

**Expected Response:**
- Blog created successfully
- Response includes `created_at` and `updated_at` fields
- Both timestamps should be current time

**Verify in database:**
```sql
SELECT id, title, created_at, updated_at FROM blogs;
-- Both timestamps should be set to current time
```

### 4.4 Update Blog (Check updated_at Changes)

**Request:**
```http
PUT http://localhost:3001/api/blogs/1
Content-Type: application/json

{
  "likes": 10
}
```

**Wait 2-3 seconds, then check:**

**Verify in database:**
```sql
SELECT id, title, created_at, updated_at FROM blogs WHERE id = 1;
-- created_at should be OLD timestamp
-- updated_at should be NEW timestamp (more recent)
```

**Expected:** `updated_at` should be newer than `created_at`

---

## Step 5: Test Exercise 13.18 (Year Field Validation)

### 5.1 Create Blog with Valid Year

**Request:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [YOUR_TOKEN]
Content-Type: application/json

{
  "title": "Valid Year Blog",
  "author": "Author Name",
  "url": "https://example.com",
  "likes": 3,
  "year": 2023
}
```

**Expected:** ✅ Blog created successfully with `year: 2023`

### 5.2 Create Blog with Year = 1991 (Minimum Valid)

**Request:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [YOUR_TOKEN]
Content-Type: application/json

{
  "title": "Old Blog",
  "author": "Author",
  "url": "https://example.com",
  "year": 1991
}
```

**Expected:** ✅ Blog created successfully

### 5.3 Create Blog with Current Year (Maximum Valid)

**Request:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [YOUR_TOKEN]
Content-Type: application/json

{
  "title": "Current Year Blog",
  "author": "Author",
  "url": "https://example.com",
  "year": 2024
}
```
*(Replace 2024 with current year if different)*

**Expected:** ✅ Blog created successfully

### 5.4 Test Invalid Year: Less Than 1991

**Request:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [YOUR_TOKEN]
Content-Type: application/json

{
  "title": "Invalid Year Blog",
  "author": "Author",
  "url": "https://example.com",
  "year": 1990
}
```

**Expected:** ❌ Status 400
**Expected Error Message:** `"Year must be at least 1991"`

### 5.5 Test Invalid Year: Greater Than Current Year

**Request:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [YOUR_TOKEN]
Content-Type: application/json

{
  "title": "Future Blog",
  "author": "Author",
  "url": "https://example.com",
  "year": 2030
}
```

**Expected:** ❌ Status 400
**Expected Error Message:** `"Year cannot be greater than 2024"` *(or current year)*

### 5.6 Test Invalid Year: Non-Integer

**Request:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [YOUR_TOKEN]
Content-Type: application/json

{
  "title": "Decimal Year",
  "author": "Author",
  "url": "https://example.com",
  "year": 2023.5
}
```

**Expected:** ❌ Status 400
**Expected Error Message:** Should indicate year must be an integer

### 5.7 Test Valid: Year is Optional (Null)

**Request:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [YOUR_TOKEN]
Content-Type: application/json

{
  "title": "No Year Blog",
  "author": "Author",
  "url": "https://example.com",
  "likes": 5
}
```
*(No year field included)*

**Expected:** ✅ Blog created successfully, `year` should be `null`

### 5.8 Update Blog with Valid Year

**Request:**
```http
PUT http://localhost:3001/api/blogs/1
Content-Type: application/json

{
  "year": 2022
}
```

**Expected:** ✅ Blog updated successfully with `year: 2022`

### 5.9 Update Blog with Invalid Year

**Request:**
```http
PUT http://localhost:3001/api/blogs/1
Content-Type: application/json

{
  "year": 1980
}
```

**Expected:** ❌ Status 400
**Expected Error Message:** `"Year must be at least 1991"`

---

## Step 6: Verify Database Schema

Run these SQL queries to verify everything is correct:

```sql
-- Check users table structure
\d users
-- Should show: id, name, username, passwordHash, created_at, updated_at

-- Check blogs table structure  
\d blogs
-- Should show: id, title, author, url, likes, year, userId, created_at, updated_at

-- Check that timestamps are being set
SELECT id, title, created_at, updated_at FROM blogs;
-- All should have non-null timestamps

-- Check year field exists and can be null
SELECT id, title, year FROM blogs;
-- Some may have year, some may be null (both should work)
```

---

## Step 7: Test Edge Cases

### 7.1 Year = 1991 (Boundary Test)
- Should work ✅

### 7.2 Year = Current Year (Boundary Test)
- Should work ✅

### 7.3 Year = 1990 (Just Below Minimum)
- Should fail ❌

### 7.4 Year = Current Year + 1 (Just Above Maximum)
- Should fail ❌

### 7.5 Year = null (Explicit)
```json
{
  "title": "Explicit Null Year",
  "author": "Author",
  "url": "https://example.com",
  "year": null
}
```
- Should work ✅

---

## Checklist Summary

- [ ] Migrations run successfully
- [ ] `users` table has `created_at` and `updated_at`
- [ ] `blogs` table has `created_at`, `updated_at`, and `year`
- [ ] Creating blog sets `created_at` and `updated_at`
- [ ] Updating blog updates `updated_at` but not `created_at`
- [ ] Year = 2023 works ✅
- [ ] Year = 1991 works ✅
- [ ] Year = current year works ✅
- [ ] Year = 1990 fails with error ❌
- [ ] Year = future year fails with error ❌
- [ ] Year = null works ✅
- [ ] Year validation works in PUT requests ❌

---

## Troubleshooting

**If migrations fail:**
- Check `DATABASE_URL` in `.env`
- Make sure all tables are dropped first
- Check database connection

**If year validation doesn't work:**
- Check that migration ran successfully
- Verify `year` column exists in database
- Check server logs for validation errors

**If timestamps don't appear:**
- Verify migration created the columns
- Check model has `timestamps: true` and `underscored: true`
- Restart server after migration

