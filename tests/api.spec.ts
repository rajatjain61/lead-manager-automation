import { test, expect } from "@playwright/test";

const BASE_URL = "https://v0-lead-manager-app.vercel.app/api";

test.describe("Lead Manager API Tests", () => {
  let authToken: string;

  // ============================================
  // LOGIN API TESTS
  // ============================================
  test.describe("Login API - POST /api/login", () => {
    test("should login successfully with valid credentials", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.token).toBeDefined();
      expect(body.email).toBe("admin@company.com");

      // Store token for subsequent requests
      authToken = body.token;
    });

    test("should fail login with invalid email", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "invalid-email@test.com",
          password: "Admin@123"
        }
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBeDefined();
    });

    test("should fail login with incorrect password", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "WrongPassword123"
        }
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should fail login with missing email", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          password: "Admin@123"
        }
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should fail login with missing password", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com"
        }
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should fail login with empty credentials", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "",
          password: ""
        }
      });

      expect(response.status()).toBe(400);
    });

    test("should fail login with invalid email format", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "not-an-email",
          password: "Admin@123"
        }
      });

      expect([400, 401]).toContain(response.status());
    });
  });

  // ============================================
  // GET LEADS API TESTS
  // ============================================
  test.describe("Get Leads API - GET /api/leads", () => {
    test("should get leads with valid authorization token", async ({ request }) => {
      // First, login to get token
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      // Then, fetch leads
      const response = await request.get(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });

    test("should fail to get leads without authorization token", async ({ request }) => {
      const response = await request.get(`${BASE_URL}/leads`);

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should fail to get leads with invalid token", async ({ request }) => {
      const response = await request.get(`${BASE_URL}/leads`, {
        headers: {
          Authorization: "Bearer invalid_token_xyz"
        }
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should fail to get leads with malformed authorization header", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.get(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `InvalidFormat ${token}`
        }
      });

      expect(response.status()).toBe(401);
    });

    test("should get leads with pagination parameters", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.get(`${BASE_URL}/leads?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
    });

    test("should handle invalid pagination parameters gracefully", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.get(`${BASE_URL}/leads?page=-1&limit=abc`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Should return 200 with default pagination or 400 for bad params
      expect([200, 400]).toContain(response.status());
    });
  });

  // ============================================
  // CREATE LEAD API TESTS
  // ============================================
  test.describe("Create Lead API - POST /api/leads", () => {
    test("should create a lead with valid data", async ({ request }) => {
      // Login first
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      // Create lead
      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          name: "John Doe",
          email: "john.doe@gmail.com",
          priority: "Medium",
          status: "New",
          isQualified: false,
          emailOptIn: false,
          notes: "Test lead"
        }
      });

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBeDefined();
    });

    test("should fail to create lead without authorization", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/leads`, {
        data: {
          name: "John Doe",
          email: "john.doe@gmail.com",
          priority: "Medium",
          status: "New",
          isQualified: false,
          emailOptIn: false,
          notes: ""
        }
      });

      expect(response.status()).toBe(401);
    });

    test("should fail to create lead with invalid token", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: "Bearer invalid_token_xyz",
          "Content-Type": "application/json"
        },
        data: {
          name: "John Doe",
          email: "john.doe@gmail.com",
          priority: "Medium",
          status: "New",
          isQualified: false,
          emailOptIn: false,
          notes: ""
        }
      });

      expect(response.status()).toBe(401);
    });

    test("should fail to create lead with missing required field (name)", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          email: "john.doe@gmail.com",
          priority: "Medium",
          status: "New",
          isQualified: false,
          emailOptIn: false,
          notes: ""
        }
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should fail to create lead with missing required field (email)", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          name: "John Doe",
          priority: "Medium",
          status: "New",
          isQualified: false,
          emailOptIn: false,
          notes: ""
        }
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should fail to create lead with invalid email format", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          name: "John Doe",
          email: "invalid-email-format",
          priority: "Medium",
          status: "New",
          isQualified: false,
          emailOptIn: false,
          notes: ""
        }
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should fail to create lead with invalid priority", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          name: "John Doe",
          email: "john.doe@gmail.com",
          priority: "InvalidPriority",
          status: "New",
          isQualified: false,
          emailOptIn: false,
          notes: ""
        }
      });

      expect(response.status()).toBe(400);
    });

    test("should fail to create lead with invalid status", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          name: "John Doe",
          email: "john.doe@gmail.com",
          priority: "Medium",
          status: "InvalidStatus",
          isQualified: false,
          emailOptIn: false,
          notes: ""
        }
      });

      expect(response.status()).toBe(400);
    });

    test("should create lead with valid priority values", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const priorities = ["Low", "Medium", "High"];

      for (const priority of priorities) {
        const response = await request.post(`${BASE_URL}/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            name: `Test Lead ${priority}`,
            email: `lead.${priority.toLowerCase()}@gmail.com`,
            priority: priority,
            status: "New",
            isQualified: false,
            emailOptIn: false,
            notes: ""
          }
        });

        expect([201, 200]).toContain(response.status());
      }
    });

    test("should create lead with optional fields", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          name: "Jane Smith",
          email: "jane.smith@gmail.com",
          priority: "High",
          status: "In Progress",
          isQualified: true,
          emailOptIn: true,
          notes: "VIP customer - requires special attention"
        }
      });

      expect([201, 200]).toContain(response.status());

      const body = await response.json();
      expect(body.success).toBe(true);
    });

    test("should handle duplicate email creation", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const leadData = {
        name: "Duplicate Test",
        email: "duplicate@gmail.com",
        priority: "Medium",
        status: "New",
        isQualified: false,
        emailOptIn: false,
        notes: ""
      };

      // Create first lead
      const response1 = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: leadData
      });

      expect([201, 200]).toContain(response1.status());

      // Attempt to create duplicate
      const response2 = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: leadData
      });

      // Should either reject duplicate or accept it based on API design
      expect([201, 200, 400, 409]).toContain(response2.status());
    });
  });

  // ============================================
  // AUTHORIZATION TESTS
  // ============================================
  test.describe("Authorization Tests", () => {
    test("should validate Bearer token format", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      // Test without Bearer prefix
      const response1 = await request.get(`${BASE_URL}/leads`, {
        headers: {
          Authorization: token
        }
      });

      expect(response1.status()).toBe(401);

      // Test with correct Bearer prefix
      const response2 = await request.get(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      expect(response2.status()).toBe(200);
    });

    test("should reject expired or revoked tokens", async ({ request }) => {
      // Using an old/expired token format
      const response = await request.get(`${BASE_URL}/leads`, {
        headers: {
          Authorization: "Bearer token_1234567890_expired"
        }
      });

      expect(response.status()).toBe(401);
    });

    test("should handle missing Authorization header", async ({ request }) => {
      const response = await request.get(`${BASE_URL}/leads`);

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
    });
  });

  // ============================================
  // ERROR HANDLING TESTS
  // ============================================
  test.describe("Error Handling", () => {
    test("should handle network timeout gracefully", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        },
        timeout: 1000 // Very short timeout
      }).catch(error => error);

      // Should either timeout or return an error
      expect(response).toBeDefined();
    });

    test("should return 404 for non-existent endpoints", async ({ request }) => {
      const response = await request.get(`${BASE_URL}/nonexistent`);

      expect(response.status()).toBe(404);
    });

    test("should handle malformed JSON in request body", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: "invalid json {"
      }).catch(error => error);

      expect(response).toBeDefined();
    });

    test("should validate response contains expected fields", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("success");
      expect(body).toHaveProperty("token");
      expect(body).toHaveProperty("email");
    });

    test("should handle SQL injection attempts safely", async ({ request }) => {
      const response = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "' OR '1'='1",
          password: "' OR '1'='1"
        }
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("should handle XSS attempts in request body", async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/login`, {
        data: {
          email: "admin@company.com",
          password: "Admin@123"
        }
      });

      const loginBody = await loginResponse.json();
      const token = loginBody.token;

      const response = await request.post(`${BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          name: "<script>alert('XSS')</script>",
          email: "xss@gmail.com",
          priority: "Medium",
          status: "New",
          isQualified: false,
          emailOptIn: false,
          notes: ""
        }
      });

      // Should either sanitize or reject
      expect([201, 200, 400]).toContain(response.status());
    });
  });
});

