import { Locator, Page } from '@playwright/test';

export default class ConfidenceFieldPageModel {
  private alertLocator: Locator;

  constructor(private label: string, private page: Page) {
    this.alertLocator = this.page.getByRole('alert', { name: label });
  }

  getInput() {
    return this.alertLocator.getByLabel(this.label);
  }

  getSelect() {
    return this.alertLocator.getByRole('combobox');
  }

  fillInput(value: string) {
    return this.getInput().fill(value);
  }

  async selectOption(option: string) {
    await this.getSelect().click();
    const list = this.page.getByRole('listbox', { name: this.label });
    return list.getByRole('option', { name: option }).click();
  }
}
