import { Page } from '@playwright/test';

export default class ReportFormPage {
  constructor(private page: Page) {}

  getNameInput() {
    return this.page.getByLabel('Name');
  }

  getPublicationDateInput() {
    return this.page.getByLabel('Publication date');
  }

  getReportTypeInput() {
    return this.page.getByLabel('Report types');
  }

  async fillNameInput(input: string) {
    await this.getNameInput().click();
    return this.getNameInput().fill(input);
  }

  async clearPublicationDateInput() {
    await this.getPublicationDateInput().click();
    await this.page.keyboard.press('Control+A');
    return this.page.keyboard.press('Backspace');
  }

  async fillPublicationDateInput(input: string) {
    await this.getPublicationDateInput().click();
    return this.page.keyboard.type(input);
  }

  async selectReportTypeInput(input: string) {
    await this.getReportTypeInput().selectOption(input);
    /* const list = await this.page.locator('.MuiAutocomplete-popper');
    return list.selectOption(input);
    // return list.getByText(input).click(); */
  }

  getCloseButton() {
    return this.page.getByRole('button', { name: 'Close' });
  }
}
