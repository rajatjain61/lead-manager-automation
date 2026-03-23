import { test, expect } from "@playwright/test";
import { LeadManagerAPI, testCredentials, testLeadData, validPriorities } from "./api.utils";

test.describe("Lead Manager API Tests", () => {
  let api: LeadManagerAPI;

  test.beforeEach(async ({ request }) => {
    api = new LeadManagerAPI(request);
  });

  test.describe("Login", () => {
    test("successful login returns token", async () => {
      const response = await api.login(testCredentials.valid.email, testCredentials.valid.password);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.token).toBeTruthy();
      expect(body.email).toBe(testCredentials.valid.email);
    });

    test("login with invalid credentials fails", async () => {
      const response = await api.login(testCredentials.invalid.email, testCredentials.invalid.password);

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("login with missing password fails", async () => {
      const response = await api.login(testCredentials.valid.email, "");

      expect(response.status()).toBe(400);
    });

    test("login with missing email fails", async () => {
      const response = await api.login("", testCredentials.valid.password);

      expect(response.status()).toBe(400);
    });
  });

  test.describe("Get Leads Endpoint", () => {
    test("get leads with valid token succeeds", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      const response = await api.getLeads();

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      const leadsData = body.data || body;
      expect(Array.isArray(leadsData)).toBe(true);
    });

    test("get leads without token fails", async () => {
      const response = await api.getLeadsUnauthorized();

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("get leads with invalid token fails", async () => {
      const response = await api.getLeadsWithInvalidToken("invalid_token_xyz");

      expect(response.status()).toBe(401);
    });

    test("get leads with pagination", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      const response = await api.getLeads(1, 10);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      const leadsData = body.data || body;
      expect(Array.isArray(leadsData)).toBe(true);
    });
  });

  test.describe("Create Lead Endpoint", () => {
    test("create lead with valid data succeeds", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      const response = await api.createLead(testLeadData.valid);

      expect([200, 201]).toContain(response.status());

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data || body.id || body.name).toBeTruthy();
    });

    test("create lead without token fails", async () => {
      const response = await api.createLeadUnauthorized(testLeadData.valid);

      expect(response.status()).toBe(401);
    });

    test("create lead with invalid token fails", async () => {
      const response = await api.createLeadWithCustomHeaders(
        testLeadData.valid,
        { Authorization: "Bearer invalid_token" }
      );

      expect(response.status()).toBe(401);
    });

    test("create lead with missing name fails", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      const response = await api.createLead(testLeadData.missingName);

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("create lead with missing email fails", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      const response = await api.createLead(testLeadData.missingEmail);

      expect(response.status()).toBe(400);
    });

    test("create lead with invalid email fails", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      const response = await api.createLead(testLeadData.invalidEmail);

      expect(response.status()).toBe(400);
    });

    test("create lead with valid priority values succeeds", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      for (const priority of validPriorities) {
        const leadData = {
          ...testLeadData.valid,
          priority: priority,
          email: `lead.${priority.toLowerCase()}.${Date.now()}@gmail.com`
        };

        const response = await api.createLead(leadData);

        expect([200, 201]).toContain(response.status());
      }
    });

    test("create lead with high priority and optional fields succeeds", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      const response = await api.createLead(testLeadData.validHigh);

      expect([200, 201]).toContain(response.status());

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data || body.id || body.name).toBeTruthy();
    });
  });

  test.describe("Authorization", () => {
    test("bearer token format is enforced", async ({ request }) => {
      const apiTest = new LeadManagerAPI(request);
      await apiTest.login(testCredentials.valid.email, testCredentials.valid.password);

      const token = apiTest.getToken();

      // Test without Bearer prefix should fail
      const response = await request.get("https://v0-lead-manager-app.vercel.app/api/leads", {
        headers: {
          Authorization: token
        }
      });

      expect(response.status()).toBe(401);
    });

    test("token can be set manually", async () => {
      api.setToken("manual_token_value");

      expect(api.getToken()).toBe("manual_token_value");
    });
  });


  test.describe("Security", () => {
    test("SQL injection attempts are rejected", async () => {
      const response = await api.login("' OR '1'='1", "' OR '1'='1");

      expect(response.status()).toBe(401);
    });

    test("XSS payload in lead name is handled safely", async () => {
      await api.login(testCredentials.valid.email, testCredentials.valid.password);

      const xssPayload = {
        ...testLeadData.valid,
        name: "<script>alert('XSS')</script>",
        email: `xss.${Date.now()}@gmail.com`
      };

      const response = await api.createLead(xssPayload);

      expect([200, 201, 400]).toContain(response.status());
    });
  });
});

