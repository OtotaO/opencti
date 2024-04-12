import { Page } from '@playwright/test';
import SelectInputUtils from '../utils/selectInput.utils';

export default class ReportFormPage {
  private reportTypesSelect = new SelectInputUtils('Report types', {
    page: this.page,
  });

  private reliabilitySelect = new SelectInputUtils('Reliability', {
    page: this.page,
    multiple: false,
  });

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

  async clearPublicationDateInput() {
    await this.getPublicationDateInput().click();
    await this.page.keyboard.press('Control+A');
    return this.page.keyboard.press('Backspace');
  }

  async fillPublicationDateInput(input: string) {
    await this.getPublicationDateInput().click();
    return this.page.keyboard.type(input);
  }

  async selectReportTypeOption(input: string) {
    return this.reportTypesSelect.selectOption(input);
  }

  getReportTypeOption(input: string) {
    return this.reportTypesSelect.getOption(input);
  }

  async selectReliabilityOption(input: string) {
    return this.reliabilitySelect.selectOption(input);
  }

  getReliabilityOption(input: string) {
    return this.reliabilitySelect.getOption(input);
  }

  getCloseButton() {
    return this.page.getByRole('button', { name: 'Close' });
  }
}
