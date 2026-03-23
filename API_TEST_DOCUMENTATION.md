# API Test Documentation

## Overview

This document describes the API test cases for the Lead Manager application. Tests cover authentication, lead management, authorization, and security scenarios.

## API Base URL

```
https://v0-lead-manager-app.vercel.app/api
```

## Test Files

- **api.spec.ts** - Comprehensive API test cases (40+ tests)
- **api.simplified.spec.ts** - Simplified test cases using utility class (20+ tests)
- **api.utils.ts** - Reusable API utilities and test data

## Endpoints Tested

### 1. Login API

**Endpoint:** `POST /api/login`

**Purpose:** Authenticate user and receive JWT token

**Test Cases:**
- ✓ Successful login with valid credentials
- ✓ Login fails with invalid email
- ✓ Login fails with incorrect password
- ✓ Login fails with missing email
- ✓ Login fails with missing password
- ✓ Login fails with empty credentials
- ✓ Login fails with invalid email format
- ✓ Proper error response format validation
- ✓ SQL injection attempt handling
- ✓ XSS attempt handling

**Request Example:**
```json
{
  "email": "admin@company.com",
  "password": "Admin@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "token_1768298330279_px698b",
  "email": "admin@company.com"
}
```

---

### 2. Get Leads API

**Endpoint:** `GET /api/leads`

**Purpose:** Fetch paginated list of leads

**Authorization:** Required (Bearer token)

**Test Cases:**
- ✓ Get leads with valid token
- ✓ Get leads without authorization fails
- ✓ Get leads with invalid token fails
- ✓ Get leads with malformed auth header fails
- ✓ Pagination parameters handling
- ✓ Invalid pagination parameters handling
- ✓ Bearer token format validation
- ✓ Missing Authorization header fails

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Request Example:**
```
GET /api/leads?page=1&limit=10
Headers: Authorization: Bearer token_1768298330279_px698b
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "lead_123",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "priority": "Medium",
      "status": "New",
      "isQualified": false,
      "emailOptIn": false,
      "createdAt": "2026-03-23T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

### 3. Create Lead API

**Endpoint:** `POST /api/leads`

**Purpose:** Create a new lead

**Authorization:** Required (Bearer token)

**Test Cases:**
- ✓ Create lead with valid data
- ✓ Create lead without authorization fails
- ✓ Create lead with invalid token fails
- ✓ Create lead with missing name fails
- ✓ Create lead with missing email fails
- ✓ Create lead with invalid email fails
- ✓ Create lead with invalid priority fails
- ✓ Create lead with invalid status fails
- ✓ Create lead with all valid priorities
- ✓ Create lead with optional fields
- ✓ Handle duplicate email creation
- ✓ Security: SQL injection handling
- ✓ Security: XSS payload handling

**Request Example:**
```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com",
  "priority": "Medium",
  "status": "New",
  "isQualified": false,
  "emailOptIn": false,
  "notes": "Test lead"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "lead_123",
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "priority": "Medium",
    "status": "New",
    "isQualified": false,
    "emailOptIn": false,
    "notes": "Test lead",
    "createdAt": "2026-03-23T10:30:00Z"
  }
}
```

**Field Descriptions:**
- `name` (string, required) - Lead name
- `email` (string, required) - Email address (must be valid format)
- `priority` (string, required) - One of: Low, Medium, High
- `status` (string, required) - Lead status
- `isQualified` (boolean, optional) - Whether lead is qualified
- `emailOptIn` (boolean, optional) - Whether lead opted in to emails
- `notes` (string, optional) - Additional notes

---

## Authorization

All protected endpoints require JWT authentication.

**Header Format:**
```
Authorization: Bearer {token}
```

**Example:**
```
Authorization: Bearer token_1768298330279_px698b
```

**Failure Response (401):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## Error Responses

### 400 Bad Request
Missing or invalid required fields

```json
{
  "success": false,
  "error": "Missing required field: name"
}
```

### 401 Unauthorized
Missing or invalid authentication token

```json
{
  "success": false,
  "error": "Invalid or missing authorization token"
}
```

### 404 Not Found
Endpoint does not exist

```json
{
  "success": false,
  "error": "Not found"
}
```

---

## Valid Values

### Priorities
- `Low`
- `Medium`
- `High`

### Statuses
- `New`
- `In Progress`
- `Qualified`
- `Unqualified`
- `Closed`

---

## Running API Tests

### Run all API tests:
```bash
npm test -- api
```

### Run comprehensive API tests only:
```bash
npm test -- api.spec.ts
```

### Run simplified API tests only:
```bash
npm test -- api.simplified.spec.ts
```

### Run specific test suite:
```bash
npm test -- -g "Login API"
```

---

## Test Coverage Summary

**Total Test Cases:** 60+

**Breakdown:**
- Login tests: 10
- Get Leads tests: 8
- Create Lead tests: 18
- Authorization tests: 4
- Error Handling tests: 8
- Security tests: 3
- Simplified test suite: 20+

**Coverage Areas:**
- ✓ Successful requests
- ✓ Invalid inputs
- ✓ Authorization failures
- ✓ Error handling
- ✓ Input validation
- ✓ Security (SQL Injection, XSS)
- ✓ Pagination
- ✓ Edge cases

---

## Test Data

### Valid Credentials
```
Email: admin@company.com
Password: Admin@123
```

### Valid Lead
```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com",
  "priority": "Medium",
  "status": "New",
  "isQualified": false,
  "emailOptIn": false,
  "notes": "Test lead"
}
```

---

## Best Practices

1. **Always login before testing protected endpoints**
2. **Use unique email addresses** (add timestamp) to avoid duplicates
3. **Test both happy paths and error cases**
4. **Validate response structure and data types**
5. **Clean up test data** if persistence is required
6. **Use utility classes** for common operations
7. **Document test failures** with clear messages

---

## Troubleshooting

### Login fails
- Verify credentials are correct
- Check if server is running
- Ensure network connectivity

### Token expires
- Login again to get new token
- Tokens have an expiration time
- Implement token refresh if needed

### Authorization failures
- Verify Bearer token format
- Check token hasn't expired
- Ensure token is correct format

---

## Example Usage with Utilities

```typescript
import { test, expect } from "@playwright/test";
import { LeadManagerAPI, testCredentials, testLeadData } from "./api.utils";

test("example API test", async ({ request }) => {
  const api = new LeadManagerAPI(request);

  // Login
  await api.login(testCredentials.valid.email, testCredentials.valid.password);

  // Create lead
  const createResponse = await api.createLead(testLeadData.valid);
  expect(createResponse.status()).toBe(201);

  // Get leads
  const getResponse = await api.getLeads(1, 10);
  expect(getResponse.status()).toBe(200);
});
```

---

## Future Enhancements

- [ ] Update Lead API tests
- [ ] Delete Lead API tests
- [ ] Lead filtering tests
- [ ] Sorting tests
- [ ] Performance tests
- [ ] Load tests
- [ ] Integration tests with UI
- [ ] API contract testing

---

For more information, refer to the test files: `api.spec.ts` and `api.simplified.spec.ts`

