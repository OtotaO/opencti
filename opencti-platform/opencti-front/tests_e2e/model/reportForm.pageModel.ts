import { Page } from '@playwright/test';

export default class ReportFormPage {
  constructor(private page: Page) {}

  getNameInput() {
    return this.page.getByLabel('Name');
  }

  getPublicationDateInput() {
    return this.page.getByLabel('Publication date');
  }

  async fillNameInput(input: string) {
    await this.getNameInput().click();
    return this.getNameInput().fill(input);
  }

  getCloseButton() {
    return this.page.getByRole('button', { name: 'Close' });
  }
}
