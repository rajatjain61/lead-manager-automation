import { APIRequestContext } from "@playwright/test";

const BASE_URL = "https://v0-lead-manager-app.vercel.app/api";

export class LeadManagerAPI {
  private request: APIRequestContext;
  private token: string | null = null;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(email: string, password: string) {
    const response = await this.request.post(`${BASE_URL}/login`, {
      data: {
        email,
        password
      }
    });

    if (response.status() === 200) {
      const body = await response.json();
      this.token = body.token;
    }

    return response;
  }


  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }


  private getAuthHeaders(): { Authorization: string } | {} {
    if (!this.token) {
      return {};
    }
    return {
      Authorization: `Bearer ${this.token}`
    };
  }


  async getLeads(page: number = 1, limit: number = 10) {
    return await this.request.get(`${BASE_URL}/leads?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders()
    });
  }


  async createLead(leadData: {
    name: string;
    email: string;
    priority: string;
    status: string;
    isQualified?: boolean;
    emailOptIn?: boolean;
    notes?: string;
  }) {
    return await this.request.post(`${BASE_URL}/leads`, {
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json"
      },
      data: leadData
    });
  }

  async getLeadsUnauthorized() {
    return await this.request.get(`${BASE_URL}/leads`);
  }


  async getLeadsWithInvalidToken(invalidToken: string) {
    return await this.request.get(`${BASE_URL}/leads`, {
      headers: {
        Authorization: `Bearer ${invalidToken}`
      }
    });
  }


  async createLeadUnauthorized(leadData: object) {
    return await this.request.post(`${BASE_URL}/leads`, {
      data: leadData
    });
  }

  async createLeadWithCustomHeaders(leadData: object, headers: object) {
    return await this.request.post(`${BASE_URL}/leads`, {
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      data: leadData
    });
  }
}

export const testCredentials = {
  valid: {
    email: "admin@company.com",
    password: "Admin@123"
  },
  invalid: {
    email: "invalid@company.com",
    password: "InvalidPassword123"
  }
};

export const testLeadData = {
  valid: {
    name: "John Doe",
    email: "john.doe@gmail.com",
    priority: "Medium",
    status: "New",
    isQualified: false,
    emailOptIn: false,
    notes: "Test lead"
  },
  validHigh: {
    name: "Jane Smith",
    email: "jane.smith@gmail.com",
    priority: "High",
    status: "In Progress",
    isQualified: true,
    emailOptIn: true,
    notes: "VIP customer"
  },
  invalidEmail: {
    name: "Test User",
    email: "invalid-email-format",
    priority: "Low",
    status: "New",
    isQualified: false,
    emailOptIn: false,
    notes: ""
  },
  missingName: {
    email: "test@gmail.com",
    priority: "Medium",
    status: "New",
    isQualified: false,
    emailOptIn: false,
    notes: ""
  },
  missingEmail: {
    name: "Test User",
    priority: "Medium",
    status: "New",
    isQualified: false,
    emailOptIn: false,
    notes: ""
  }
};

export const validPriorities = ["Low", "Medium", "High"];
export const validStatuses = ["New", "In Progress", "Qualified", "Unqualified", "Closed"];

