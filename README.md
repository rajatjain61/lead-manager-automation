# Lead Manager Test Automation
Test automation for the Lead Manager application using Playwright and TypeScript.
## Overview
This project automates the core business flow:
- User login
- Lead creation 
- Lead list verification
## Requirements
- Node.js 14+
- npm 6+
## Installation
```bash
npm install
```
## Running Tests
```bash
npm test
```
View the HTML report:
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
+-- lead-flow.spec.ts
playwright.config.ts
tsconfig.json
package.json
```
## Test Flow
1. Navigate to login page
2. Fill email and password
3. Click sign-in
4. Verify login success
5. Click "Create Lead" button
6. Fill lead form (First Name, Last Name, Email, Company)
7. Submit form
8. Verify success message
9. Verify lead appears in list
## Test Credentials
Default test credentials:
- Email: test@example.com
- Password: Password123!
To run with custom credentials:
```bash
TEST_EMAIL=your@email.com TEST_PASSWORD=password npm test
```
## Page Objects
### LoginPage
- `login(email, password)` - Authenticate user
### DashboardPage
- `clickCreateLeadButton()` - Navigate to lead creation
- `verifyLeadInList(name)` - Check if lead exists
### CreateLeadPage
- `fillLeadForm(data)` - Complete lead form
- `submitForm()` - Submit the form
- `createLead(data)` - Fill and submit in one call
## Configuration
Key files:
- `playwright.config.ts` - Playwright settings
- `tsconfig.json` - TypeScript settings
- `package.json` - Dependencies and scripts
## Browsers
Supported browsers:
- Chromium
- Firefox
- WebKit
