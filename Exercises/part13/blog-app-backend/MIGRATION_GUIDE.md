# Migration Guide - Exercises 13.17 & 13.18

## Summary of Changes

This document explains the changes made to complete exercises 13.17 and 13.18.

## Exercise 13.17: Database Migrations with Timestamps

### What Was Done:

1. **Removed `sequelize.sync()` from `app.js`**
   - Previously, the app used `sequelize.sync({ alter: true })` to automatically synchronize the database schema
   - This was removed as per exercise requirements
   - Migrations now handle all database schema changes

2. **Created `.sequelizerc` configuration file**
   - This file tells Sequelize CLI where to find migrations, models, seeders, and config files
   - Located at the root of the backend directory

3. **Created initial migration (`20240101000000-initial-migration.js`)**
   - Creates `users` table with:
     - `id` (primary key, auto-increment)
     - `name` (TEXT, not null)
     - `username` (TEXT, not null, unique)
     - `passwordHash` (TEXT, not null)
     - `created_at` (TIMESTAMP, not null, default: CURRENT_TIMESTAMP)
     - `updated_at` (TIMESTAMP, not null, default: CURRENT_TIMESTAMP)
   
   - Creates `blogs` table with:
     - `id` (primary key, auto-increment)
     - `title` (TEXT, not null)
     - `author` (TEXT, nullable)
     - `url` (TEXT, not null)
     - `likes` (INTEGER, default: 0)
     - `userId` (INTEGER, foreign key to users.id)
     - `created_at` (TIMESTAMP, not null, default: CURRENT_TIMESTAMP)
     - `updated_at` (TIMESTAMP, not null, default: CURRENT_TIMESTAMP)

4. **Updated Model Files**
   - `models/user.js`: Added `underscored: true` to match migration column naming (snake_case)
   - `models/blog.js`: Changed `timestamps: false` to `timestamps: true` and added `underscored: true`

### How to Use:

**Before running migrations, delete existing tables:**
```sql
-- Connect to your database and run:
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;
-- If you manually deleted tables, also delete migration records:
DELETE FROM SequelizeMeta;
```

**Run migrations:**
```bash
npm run migrate
```

**Undo last migration (if needed):**
```bash
npm run migrate:undo
```

## Exercise 13.18: Add Year Field to Blogs

### What Was Done:

1. **Created migration (`20240101000001-add-year-to-blogs.js`)**
   - Adds `year` column to `blogs` table
   - Type: INTEGER, nullable (allows existing blogs to not have a year)

2. **Updated Blog Model (`models/blog.js`)**
   - Added `year` field with validation:
     - Must be an integer
     - Must be >= 1991
     - Must be <= current year (dynamically calculated)
     - Can be null (optional field)
   - Validation provides clear error messages:
     - "Year must be an integer"
     - "Year must be at least 1991"
     - "Year cannot be greater than [current year]"

3. **Updated Blogs Controller (`controllers/blogs.js`)**
   - POST endpoint: Now accepts `year` field when creating new blogs
   - PUT endpoint: Now accepts `year` field when updating blogs
   - Validation errors are automatically handled by the error middleware

### How to Use:

**Run the migration:**
```bash
npm run migrate
```

**Example API requests:**

**Create blog with year:**
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer [your-token]
Content-Type: application/json

{
  "title": "Learning Node.js",
  "author": "Jami Kousa",
  "url": "https://example.com",
  "likes": 3,
  "year": 2023
}
```

**Update blog year:**
```http
PUT http://localhost:3001/api/blogs/1
Content-Type: application/json

{
  "year": 2024
}
```

**Invalid year examples (will return 400 error):**
- Year < 1991: `"year": 1990` → Error: "Year must be at least 1991"
- Year > current year: `"year": 2030` → Error: "Year cannot be greater than 2024"
- Non-integer: `"year": 2023.5` → Error: "Year must be an integer"

## File Structure

```
blog-app-backend/
├── .sequelizerc          # Sequelize CLI configuration
├── migrations/
│   ├── 20240101000000-initial-migration.js    # Exercise 13.17
│   └── 20240101000001-add-year-to-blogs.js    # Exercise 13.18
├── models/
│   ├── blog.js           # Updated with timestamps and year field
│   └── user.js           # Updated with underscored timestamps
├── controllers/
│   └── blogs.js          # Updated to handle year field
└── app.js                # Removed sequelize.sync()
```

## Important Notes

1. **Never use `sequelize.sync()` again** - All schema changes must be done via migrations
2. **Timestamps are now snake_case** (`created_at`, `updated_at`) due to `underscored: true`
3. **Year validation is dynamic** - It automatically uses the current year, so it will always be up-to-date
4. **Error handling** - Validation errors are automatically caught and returned as 400 status with appropriate error messages

## Troubleshooting

**If migrations fail:**
- Make sure all tables are dropped first
- Check that `DATABASE_URL` is set correctly in your `.env` file
- Verify database connection is working

**If you see "migration already executed" errors:**
- Delete the `SequelizeMeta` table: `DELETE FROM SequelizeMeta;`
- Or manually delete migration records for specific migrations

