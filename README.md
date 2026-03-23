# Lead Manager Test Automation
Complete test automation for the Lead Manager application using Playwright and TypeScript.
Includes both UI tests and comprehensive API tests.
## Overview
This project automates:
### UI Tests
- User login flow
- Lead creation workflow  
- Lead list verification
### API Tests
- Authentication (Login)
- Get Leads (Paginated)
- Create Lead
- Authorization validation
- Error handling and security
## Requirements
- Node.js 14+
- npm 6+
## Installation
```bash
npm install
```
## Running Tests
### All Tests
```bash
npm test
```
### UI Tests Only
```bash
npm test -- lead-flow.spec.ts
```
### API Tests Only
```bash
npm test -- api
```
### Specific API Test Suite
```bash
npm test -- api.spec.ts
npm test -- api.simplified.spec.ts
```
### View Test Report
```bash
npx playwright show-report
```
## Project Structure
```
pages/
+-- LoginPage.ts
+-- DashboardPage.ts
+-- CreateLeadPage.ts
tests/
+-- lead-flow.spec.ts           # UI tests
+-- api.spec.ts                 # Comprehensive API tests (40+ tests)
+-- api.simplified.spec.ts      # Simplified API tests (20+ tests)
+-- api.utils.ts                # API utilities and test data
playwright.config.ts
tsconfig.json
package.json
API_TEST_DOCUMENTATION.md
```
## Test Coverage
### UI Tests
- Login with valid credentials
- Invalid credentials handling
- Lead creation workflow
- Lead verification in list
### API Tests (60+ Test Cases)
**Login Endpoint (10 tests)**
- Valid credentials
- Invalid credentials
- Missing fields
- Invalid email format
- Security (SQL injection, XSS)
**Get Leads Endpoint (8 tests)**
- Authorized access
- Unauthorized access
- Invalid token handling
- Pagination support
- Bearer token format validation
**Create Lead Endpoint (18 tests)**
- Valid lead creation
- Authorization validation
- Field validation
- Priority and status validation
- Duplicate handling
- Security scenarios
**Other Coverage**
- Authorization tests
- Error handling
- Security tests
## Test Credentials
Default credentials:
```
Email: admin@company.com
Password: Admin@123
```
## API Documentation
For detailed API test documentation, see API_TEST_DOCUMENTATION.md
## Browsers Supported
- Chromium
- Firefox
- WebKit
## Features
? Page Object Model for UI tests
? Comprehensive API testing
? Reusable utilities and test data
? Error handling and security testing
? Pagination support
? Authorization validation
? HTML test reports
? Screenshot and video on failure
## Repository
GitHub: https://github.com/rajatjain61/lead-manager-automation
