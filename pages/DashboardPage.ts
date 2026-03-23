import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly createLeadButton: Locator;
  readonly leadsTable: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createLeadButton = page.getByRole('button', { name: 'Create Lead' });
    this.leadsTable = page.locator('table');
    this.successMessage = page.locator('text=Lead created successfully');
  }

  async goto() {
    await this.page.goto('https://v0-lead-manager-app.vercel.app/dashboard');
  }

  async clickCreateLeadButton() {
    await this.createLeadButton.click();
  }

  async isLeadsTableVisible(): Promise<boolean> {
    return await this.leadsTable.isVisible();
  }

  async verifyLeadInList(leadName: string): Promise<boolean> {
    const leadInList = this.page.locator(`text=${leadName}`);
    return await leadInList.isVisible();
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }
}


