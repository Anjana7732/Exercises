# Manual Testing Guide for Exercise 13.24 - Server-Side Sessions

This guide will help you manually test the server-side session implementation that allows token revocation and user disabling.

---

## Prerequisites

1. **Run the new migrations** to add the `disabled` column and `sessions` table:
   ```bash
   npm run migrate
   ```

2. **Verify migrations ran successfully:**
   ```sql
   -- Check users table has disabled column
   \d users
   -- Should show: disabled (boolean, default false)
   
   -- Check sessions table exists
   \d sessions
   -- Should show: id, user_id, token, created_at, updated_at
   ```

3. **Start your backend server:**
   ```bash
   npm start
   # or
   node index.js
   ```

---

## Test 1: Basic Login Creates Session

### Step 1.1: Create a User
```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "Test User",
  "username": "test@example.com",
  "password": "password123"
}
```

**Expected:** User created successfully

### Step 1.2: Login to Get Token
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "test@example.com",
  "name": "Test User"
}
```

**Save this token** - you'll need it for the next steps!

### Step 1.3: Verify Session Was Created in Database
```sql
SELECT * FROM sessions;
```

**Expected:** 
- ✅ One row should exist
- ✅ `user_id` should match your user's ID
- ✅ `token` should match the token you received
- ✅ `created_at` should be current timestamp

---

## Test 2: Protected Routes Work with Valid Session

### Step 2.1: Create a Blog (Using the token from Test 1.2)
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "My First Blog",
  "author": "Test Author",
  "url": "https://example.com",
  "likes": 5
}
```

**Expected:** ✅ Blog created successfully (Status 201)

### Step 2.2: Try Another Protected Route
```http
GET http://localhost:3001/api/blogs
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected:** ✅ Should return list of blogs

---

## Test 3: Logout Invalidates Token

### Step 3.1: Logout (Delete Session)
```http
DELETE http://localhost:3001/api/logout
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected:** ✅ Status 204 (No Content) - Session deleted

### Step 3.2: Verify Session Was Deleted
```sql
SELECT * FROM sessions WHERE token = 'YOUR_TOKEN_HERE';
```

**Expected:** ✅ No rows returned (session deleted)

### Step 3.3: Try Protected Route After Logout
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Should Fail",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ❌ Status 401 or 403 - Request should fail because session doesn't exist

**Note:** The JWT token is still valid, but the server-side session check fails, so access is denied.

---

## Test 4: Login Again Creates New Session

### Step 4.1: Login Again
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "test@example.com",
  "password": "password123"
}
```

**Expected:** ✅ New token returned

**Save this NEW token**

### Step 4.2: Verify New Session Created
```sql
SELECT * FROM sessions;
```

**Expected:** ✅ New session row with new token

### Step 4.3: Use New Token
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer NEW_TOKEN_HERE
Content-Type: application/json

{
  "title": "Blog with New Token",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ✅ Should work - new session is valid

---

## Test 5: User Disabling Blocks Access

### Step 5.1: Disable User in Database
```sql
UPDATE users SET disabled = true WHERE username = 'test@example.com';
```

**Verify:**
```sql
SELECT id, username, disabled FROM users WHERE username = 'test@example.com';
-- disabled should be true
```

### Step 5.2: Try Protected Route with Existing Token
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer NEW_TOKEN_HERE
Content-Type: application/json

{
  "title": "Should Fail - User Disabled",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ❌ Status 401 or 403 - Access denied because user is disabled

**Note:** The session still exists in the database, but the middleware checks `user.disabled` and blocks access.

### Step 5.3: Try to Login While Disabled
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "test@example.com",
  "password": "password123"
}
```

**Expected:** ❌ Status 401 - Error: "account disabled"

### Step 5.4: Re-enable User
```sql
UPDATE users SET disabled = false WHERE username = 'test@example.com';
```

### Step 5.5: Login Should Work Again
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "test@example.com",
  "password": "password123"
}
```

**Expected:** ✅ New token returned - user can login again

---

## Test 6: Multiple Sessions (Multiple Devices)

### Step 6.1: Login from "Device 1"
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "test@example.com",
  "password": "password123"
}
```

**Save Token 1**

### Step 6.2: Login from "Device 2" (Same User)
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "test@example.com",
  "password": "password123"
}
```

**Save Token 2**

### Step 6.3: Verify Both Sessions Exist
```sql
SELECT id, user_id, token, created_at FROM sessions ORDER BY created_at;
```

**Expected:** ✅ Two sessions for the same user_id with different tokens

### Step 6.4: Both Tokens Should Work
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer TOKEN_1_HERE
Content-Type: application/json

{
  "title": "From Device 1",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ✅ Works

```http
POST http://localhost:3001/api/blogs
Authorization: Bearer TOKEN_2_HERE
Content-Type: application/json

{
  "title": "From Device 2",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ✅ Works

### Step 6.5: Logout from Device 1 Only
```http
DELETE http://localhost:3001/api/logout
Authorization: Bearer TOKEN_1_HERE
```

**Expected:** ✅ Status 204

### Step 6.6: Verify Only One Session Remains
```sql
SELECT * FROM sessions;
```

**Expected:** ✅ Only Token 2's session should exist

### Step 6.7: Token 1 Should Fail, Token 2 Should Work
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer TOKEN_1_HERE
Content-Type: application/json

{
  "title": "Should Fail",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ❌ Status 401/403 - Token 1 invalidated

```http
POST http://localhost:3001/api/blogs
Authorization: Bearer TOKEN_2_HERE
Content-Type: application/json

{
  "title": "Should Work",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ✅ Works - Token 2 still valid

---

## Test 7: Invalid Token Scenarios

### Step 7.1: Request Without Token
```http
POST http://localhost:3001/api/blogs
Content-Type: application/json

{
  "title": "No Token",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ❌ Status 401 or 403 - No token provided

### Step 7.2: Request with Invalid Token
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer invalid_token_here
Content-Type: application/json

{
  "title": "Invalid Token",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ❌ Status 401 - Invalid token

### Step 7.3: Request with Expired Token
If you have an expired token (older than 1 hour), try:
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer EXPIRED_TOKEN_HERE
Content-Type: application/json

{
  "title": "Expired Token",
  "author": "Test",
  "url": "https://example.com"
}
```

**Expected:** ❌ Status 401 - Token expired

---

## Test 8: Logout Edge Cases

### Step 8.1: Logout Without Token
```http
DELETE http://localhost:3001/api/logout
```

**Expected:** ❌ Status 401 - "token missing"

### Step 8.2: Logout with Invalid Token
```http
DELETE http://localhost:3001/api/logout
Authorization: Bearer invalid_token
```

**Expected:** ❌ Status 401 - "token missing or invalid"

### Step 8.3: Logout Twice (Same Token)
```http
DELETE http://localhost:3001/api/logout
Authorization: Bearer VALID_TOKEN_HERE
```

**Expected:** ✅ Status 204 (first time)

```http
DELETE http://localhost:3001/api/logout
Authorization: Bearer SAME_TOKEN_HERE
```

**Expected:** ❌ Status 404 - "session not found" (already deleted)

---

## Test 9: Database Verification

### Step 9.1: Check Sessions Table Structure
```sql
\d sessions
```

**Expected Columns:**
- `id` (integer, primary key)
- `user_id` (integer, foreign key to users)
- `token` (text, unique)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Step 9.2: Check Users Table Has Disabled Column
```sql
\d users
```

**Expected:** ✅ `disabled` column (boolean, default false)

### Step 9.3: Check Indexes
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'sessions';
```

**Expected:** ✅ Indexes on `token` (unique) and `user_id`

---

## Test 10: Complete Flow Test

### Step 10.1: Create User
```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "Flow Test User",
  "username": "flow@example.com",
  "password": "password123"
}
```

### Step 10.2: Login
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "flow@example.com",
  "password": "password123"
}
```

**Save token**

### Step 10.3: Create Blog (Should Work)
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer TOKEN_HERE
Content-Type: application/json

{
  "title": "Flow Test Blog",
  "author": "Author",
  "url": "https://example.com"
}
```

**Expected:** ✅ Works

### Step 10.4: Logout
```http
DELETE http://localhost:3001/api/logout
Authorization: Bearer TOKEN_HERE
```

**Expected:** ✅ Status 204

### Step 10.5: Try Same Token Again (Should Fail)
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer SAME_TOKEN_HERE
Content-Type: application/json

{
  "title": "Should Fail",
  "author": "Author",
  "url": "https://example.com"
}
```

**Expected:** ❌ Status 401/403

### Step 10.6: Login Again (New Token)
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "flow@example.com",
  "password": "password123"
}
```

**Save new token**

### Step 10.7: New Token Should Work
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer NEW_TOKEN_HERE
Content-Type: application/json

{
  "title": "New Token Works",
  "author": "Author",
  "url": "https://example.com"
}
```

**Expected:** ✅ Works

---

## Checklist Summary

### Database Setup
- [ ] Migration `20240101000003-add-disabled-to-users.js` ran successfully
- [ ] Migration `20240101000004-create-sessions.js` ran successfully
- [ ] `users` table has `disabled` column (boolean, default false)
- [ ] `sessions` table exists with correct structure
- [ ] Indexes created on `sessions.token` and `sessions.user_id`

### Login Functionality
- [ ] Login creates a session in database
- [ ] Login returns JWT token
- [ ] Disabled users cannot login
- [ ] Multiple logins create multiple sessions

### Session Validation
- [ ] Valid session allows access to protected routes
- [ ] Invalid/missing token denies access
- [ ] Expired token denies access
- [ ] Logged out token denies access (even if JWT is valid)

### Logout Functionality
- [ ] DELETE `/api/logout` removes session from database
- [ ] Logout invalidates token immediately
- [ ] Logout without token returns error
- [ ] Logout with invalid token returns error
- [ ] Logging out twice returns appropriate error

### User Disabling
- [ ] Disabled users cannot access protected routes
- [ ] Disabled users cannot login
- [ ] Re-enabled users can login again
- [ ] Disabling user doesn't delete sessions (but blocks access)

### Multiple Sessions
- [ ] User can have multiple active sessions
- [ ] Logging out from one device doesn't affect other devices
- [ ] Each session has unique token

---

## Troubleshooting

### Issue: "Session not found" when trying to use token
**Solution:** 
- Check if you logged out (session was deleted)
- Verify session exists: `SELECT * FROM sessions WHERE token = 'YOUR_TOKEN';`
- Try logging in again to get a new token

### Issue: "Account disabled" error
**Solution:**
- Check user status: `SELECT id, username, disabled FROM users;`
- Re-enable user: `UPDATE users SET disabled = false WHERE id = USER_ID;`

### Issue: Protected routes return 401 even with valid token
**Solution:**
- Verify session exists in database
- Check if user is disabled
- Verify token format is correct (Bearer token)
- Check server logs for errors

### Issue: Migration fails
**Solution:**
- Make sure database is accessible
- Check `DATABASE_URL` in `.env`
- Verify no conflicting tables exist
- Try running migrations one at a time

---

## SQL Queries for Verification

### View All Sessions
```sql
SELECT s.id, s.user_id, u.username, s.token, s.created_at 
FROM sessions s
JOIN users u ON s.user_id = u.id
ORDER BY s.created_at DESC;
```

### View Disabled Users
```sql
SELECT id, username, disabled, created_at 
FROM users 
WHERE disabled = true;
```

### Count Sessions Per User
```sql
SELECT u.username, COUNT(s.id) as session_count
FROM users u
LEFT JOIN sessions s ON u.id = s.user_id
GROUP BY u.id, u.username;
```

### Find Orphaned Sessions (user deleted but session exists)
```sql
SELECT s.* 
FROM sessions s
LEFT JOIN users u ON s.user_id = u.id
WHERE u.id IS NULL;
```

---

## Notes

- **Token Expiration:** JWT tokens expire after 1 hour (60 * 60 seconds). After expiration, even valid sessions won't work because JWT verification fails first.

- **Session Cleanup:** This implementation doesn't automatically clean up expired sessions. You may want to add a cleanup job in production.

- **User Disabling:** When a user is disabled, existing sessions remain in the database but are blocked by middleware. This allows you to see who was logged in when the user was disabled.

- **Multiple Devices:** Users can be logged in from multiple devices simultaneously. Each login creates a new session with a unique token.

---

**Happy Testing! 🚀**

