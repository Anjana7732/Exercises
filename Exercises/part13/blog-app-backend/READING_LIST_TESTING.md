# Reading List Testing Instructions
## Exercises 13.19-13.23

## Prerequisites

1. **Run the migration first:**
   ```bash
   npm run migrate
   ```
   This creates the `readinglists` table.

2. **Start your server:**
   ```bash
   node index.js
   ```

3. **Have at least:**
   - 2 users created
   - 2-3 blogs created
   - A valid authentication token

---

## Step 1: Setup (Create Users and Blogs)

### 1.1 Create User 1
```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "Test User 1",
  "username": "user1@test.com",
  "password": "password123"
}
```
**Save the response** - note the `id` (e.g., `id: 1`)

### 1.2 Create User 2
```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "Test User 2",
  "username": "user2@test.com",
  "password": "password123"
}
```
**Save the response** - note the `id` (e.g., `id: 2`)

### 1.3 Login as User 1 to Get Token
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "user1@test.com",
  "password": "password123"
}
```
**Save the token** from the response (e.g., `token: "eyJhbGci..."`)

### 1.4 Create Blog 1
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxQHRlc3QuY29tIiwiaWQiOjIsImlhdCI6MTc2MzM5MTY2MywiZXhwIjoxNzYzMzk1MjYzfQ.9PicS5zlN0EZB2AIoIbzjPZcQGDfOBIe2RSSyllC2Bs
Content-Type: application/json

{
  "title": "Test Blog 1",
  "author": "Author One",
  "url": "https://example.com/blog1",
  "likes": 5,
  "year": 2023
}
```
**Save the blog `id`** (e.g., `id: 1`)

### 1.5 Create Blog 2
```http
POST http://localhost:3001/api/blogs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxQHRlc3QuY29tIiwiaWQiOjIsImlhdCI6MTc2MzM5MTY2MywiZXhwIjoxNzYzMzk1MjYzfQ.9PicS5zlN0EZB2AIoIbzjPZcQGDfOBIe2RSSyllC2Bs
Content-Type: application/json

{
  "title": "Test Blog 2",
  "author": "Author Two",
  "url": "https://example.com/blog2",
  "likes": 10,
  "year": 2024
}
```
**Save the blog `id`** (e.g., `id: 2`)

---

## Step 2: Exercise 13.20 - Add Blogs to Reading List

### 2.1 Add Blog 1 to User 1's Reading List
```http
POST http://localhost:3001/api/readinglists
Content-Type: application/json

{
  "blogId": 1,
  "userId": 2
}
```

**Expected:** ✅ Status 201
**Expected Response:**
```json
{
  "id": 1,
  "userId": 1,
  "blogId": 1,
  "read": false,
  "created_at": "...",
  "updated_at": "..."
}
```

### 2.2 Add Blog 2 to User 1's Reading List
```http
POST http://localhost:3001/api/readinglists
Content-Type: application/json

{
  "blogId": 2,
  "userId": 2
}
```

**Expected:** ✅ Status 201

### 2.3 Try Adding Same Blog Again (Should Fail)
```http
POST http://localhost:3001/api/readinglists
Content-Type: application/json

{
  "blogId": 1,
  "userId": 2
}
```

**Expected:** ❌ Status 400
**Expected Error:** `"blog already in reading list"`

### 2.4 Try Adding Non-Existent Blog (Should Fail)
```http
POST http://localhost:3001/api/readinglists
Content-Type: application/json

{
  "blogId": 999,
  "userId": 1
}
```

**Expected:** ❌ Status 404
**Expected Error:** `"blog not found"`

### 2.5 Try Adding Blog to Non-Existent User (Should Fail)
```http
POST http://localhost:3001/api/readinglists
Content-Type: application/json

{
  "blogId": 1,
  "userId": 999
}
```

**Expected:** ❌ Status 404
**Expected Error:** `"user not found"`

---

## Step 3: Exercise 13.20 - Get User with Reading List

### 3.1 Get User 1 with Reading List
```http
GET http://localhost:3001/api/users/1
```

**Expected:** ✅ Status 200
**Expected Response Format:**
```json
{
  "name": "Test User 1",
  "username": "user1@test.com",
  "readings": [
    {
      "id": 1,
      "url": "https://example.com/blog1",
      "title": "Test Blog 1",
      "author": "Author One",
      "likes": 5,
      "year": 2023
    },
    {
      "id": 2,
      "url": "https://example.com/blog2",
      "title": "Test Blog 2",
      "author": "Author Two",
      "likes": 10,
      "year": 2024
    }
  ]
}
```

**Verify:**
- ✅ `readings` array contains both blogs
- ✅ Each blog has: `id`, `url`, `title`, `author`, `likes`, `year`
- ✅ No `readinglists` field yet (that's exercise 13.21)

### 3.2 Get User 2 (No Reading List)
```http
GET http://localhost:3001/api/users/2
```

**Expected:** ✅ Status 200
**Expected Response:**
```json
{
  "name": "Test User 2",
  "username": "user2@test.com",
  "readings": []
}
```

**Verify:** ✅ `readings` is an empty array

---

## Step 4: Exercise 13.21 - Reading List with Read Status

### 4.1 Get User 1 Again (Should Now Show readinglists)
```http
GET http://localhost:3001/api/users/1
```

**Expected:** ✅ Status 200
**Expected Response Format:**
```json
{
  "name": "Test User 1",
  "username": "user1@test.com",
  "readings": [
    {
      "id": 1,
      "url": "https://example.com/blog1",
      "title": "Test Blog 1",
      "author": "Author One",
      "likes": 5,
      "year": 2023,
      "readinglists": [
        {
          "read": false,
          "id": 1
        }
      ]
    },
    {
      "id": 2,
      "url": "https://example.com/blog2",
      "title": "Test Blog 2",
      "author": "Author Two",
      "likes": 10,
      "year": 2024,
      "readinglists": [
        {
          "read": false,
          "id": 2
        }
      ]
    }
  ]
}
```

**Verify:**
- ✅ Each blog has a `readinglists` array
- ✅ Each `readinglists` array contains exactly **one object**
- ✅ Each object has `read: false` and an `id` (the reading list entry id)

---

## Step 5: Exercise 13.22 - Mark Blog as Read

### 5.1 Mark First Reading List Entry as Read
```http
PUT http://localhost:3001/api/readinglists/1
Authorization: Bearer [YOUR_TOKEN_FROM_1.3]
Content-Type: application/json

{
  "read": true
}
```

**Expected:** ✅ Status 200
**Expected Response:**
```json
{
  "id": 1,
  "userId": 1,
  "blogId": 1,
  "read": true,
  "created_at": "...",
  "updated_at": "..."
}
```

**Verify:** ✅ `read` is now `true`

### 5.2 Try to Mark Someone Else's Reading List (Should Fail)
First, get User 2's token:
```http
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "username": "user2@test.com",
  "password": "password123"
}
```
**Save User 2's token**

Then try to mark User 1's reading list entry:
```http
PUT http://localhost:3001/api/readinglists/1
Authorization: Bearer [USER_2_TOKEN]
Content-Type: application/json

{
  "read": true
}
```

**Expected:** ❌ Status 403
**Expected Error:** `"can only mark own reading list entries as read"`

### 5.3 Try Without Token (Should Fail)
```http
PUT http://localhost:3001/api/readinglists/1
Content-Type: application/json

{
  "read": true
}
```

**Expected:** ❌ Status 401
**Expected Error:** `"token missing or invalid"`

### 5.4 Mark as Unread
```http
PUT http://localhost:3001/api/readinglists/1
Authorization: Bearer [USER_1_TOKEN]
Content-Type: application/json

{
  "read": false
}
```

**Expected:** ✅ Status 200
**Verify:** ✅ `read` is now `false`

### 5.5 Verify Updated Status in User Response
```http
GET http://localhost:3001/api/users/1
```

**Expected:** ✅ The first blog's `readinglists[0].read` should match what you set

---

## Step 6: Exercise 13.23 - Filter by Read Status

### 6.1 Mark Blog 1 as Read (if not already)
```http
PUT http://localhost:3001/api/readinglists/1
Authorization: Bearer [USER_1_TOKEN]
Content-Type: application/json

{
  "read": true
}
```

### 6.2 Get All Reading List Items (No Filter)
```http
GET http://localhost:3001/api/users/1
```

**Expected:** ✅ Status 200
**Expected:** Should return **both** blogs (read and unread)

### 6.3 Get Only Read Items
```http
GET http://localhost:3001/api/users/1?read=true
```

**Expected:** ✅ Status 200
**Expected Response:**
```json
{
  "name": "Test User 1",
  "username": "user1@test.com",
  "readings": [
    {
      "id": 1,
      "url": "https://example.com/blog1",
      "title": "Test Blog 1",
      "author": "Author One",
      "likes": 5,
      "year": 2023,
      "readinglists": [
        {
          "read": true,
          "id": 1
        }
      ]
    }
  ]
}
```

**Verify:**
- ✅ Only returns blogs where `read: true`
- ✅ Should only show Blog 1

### 6.4 Get Only Unread Items
```http
GET http://localhost:3001/api/users/1?read=false
```

**Expected:** ✅ Status 200
**Expected:** Should only return Blog 2 (unread)

**Verify:**
- ✅ Only returns blogs where `read: false`
- ✅ Should only show Blog 2

### 6.5 Test Invalid Read Parameter
```http
GET http://localhost:3001/api/users/1?read=maybe
```

**Expected:** ✅ Status 200 (should treat as undefined and return all)

---

## Step 7: Edge Cases and Additional Tests

### 7.1 Add Blog to User 2's Reading List
```http
POST http://localhost:3001/api/readinglists
Content-Type: application/json

{
  "blogId": 1,
  "userId": 2
}
```

**Expected:** ✅ Status 201
**Note:** Same blog can be in multiple users' reading lists

### 7.2 Get User 2's Reading List
```http
GET http://localhost:3001/api/users/2
```

**Expected:** ✅ Should show Blog 1 in User 2's reading list

### 7.3 Verify Each User Has Independent Reading Lists
- User 1 should have Blog 1 (read) and Blog 2 (unread)
- User 2 should have Blog 1 (unread)
- Marking User 1's Blog 1 as read should NOT affect User 2's Blog 1

### 7.4 Test Missing Required Fields
```http
POST http://localhost:3001/api/readinglists
Content-Type: application/json

{
  "blogId": 1
}
```

**Expected:** ❌ Status 400
**Expected Error:** `"blogId and userId are required"`

### 7.5 Test Invalid Read Value
```http
PUT http://localhost:3001/api/readinglists/1
Authorization: Bearer [USER_1_TOKEN]
Content-Type: application/json

{
  "read": "yes"
}
```

**Expected:** ❌ Status 400
**Expected Error:** `"read must be a boolean"`

---

## Checklist Summary

### Exercise 13.19 ✅
- [ ] Migration runs successfully
- [ ] `readinglists` table created with correct columns
- [ ] Unique constraint prevents duplicate entries

### Exercise 13.20 ✅
- [ ] POST /api/readinglists creates reading list entry
- [ ] GET /api/users/:id returns reading list
- [ ] Reading list shows blog information correctly
- [ ] Prevents duplicate entries
- [ ] Validates blog and user exist

### Exercise 13.21 ✅
- [ ] GET /api/users/:id shows `readinglists` array
- [ ] Each blog has exactly one `readinglists` entry
- [ ] Shows `read` status and `id` correctly

### Exercise 13.22 ✅
- [ ] PUT /api/readinglists/:id marks blog as read
- [ ] Only user can mark their own reading list entries
- [ ] Returns 403 for other users' entries
- [ ] Returns 401 without token

### Exercise 13.23 ✅
- [ ] GET /api/users/:id returns all items
- [ ] GET /api/users/:id?read=true returns only read items
- [ ] GET /api/users/:id?read=false returns only unread items

---

## Troubleshooting

**If migration fails:**
- Make sure previous migrations ran successfully
- Check database connection

**If reading list doesn't show:**
- Verify blogs were added to reading list
- Check user ID matches
- Verify relationships are set up correctly in app.js

**If filtering doesn't work:**
- Check query parameter is `read` (not `readStatus` or similar)
- Verify boolean conversion (`read === 'true'`)

**If marking as read fails:**
- Verify token is valid
- Check user owns the reading list entry
- Ensure `read` is a boolean, not a string

