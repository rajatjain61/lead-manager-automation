import { Page, Locator } from '@playwright/test';

export class CreateLeadPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly companyInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.companyInput = page.locator('input[name="company"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.successMessage = page.locator('text=Lead created successfully');
    this.errorMessage = page.locator('text=/error|Error/i');
  }

  async goto() {
    await this.page.goto('https://v0-lead-manager-app.vercel.app/create-lead');
  }

  async fillLeadForm(leadData: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
  }) {
    await this.firstNameInput.fill(leadData.firstName);
    await this.lastNameInput.fill(leadData.lastName);
    await this.emailInput.fill(leadData.email);

    if (leadData.company) {
      await this.companyInput.fill(leadData.company);
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async cancelForm() {
    await this.cancelButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async createLead(leadData: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
  }) {
    await this.fillLeadForm(leadData);
    await this.submitForm();
  }
}


