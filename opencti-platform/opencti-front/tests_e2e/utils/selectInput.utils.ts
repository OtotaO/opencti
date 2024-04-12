import { Locator, Page } from '@playwright/test';

export default class SelectInputUtils {
  private inputLocator : Locator;

  private parentLocator : Locator;

  constructor(private label: string, private page: Page) {
    this.inputLocator = page.getByRole('combobox', { name: label });
    this.parentLocator = page.locator('div').filter({ has: this.inputLocator });
  }

  async selectOption(option: string) {
    await this.inputLocator.click();
    await this.inputLocator.fill(option);
    const list = this.page.getByRole('listbox', { name: this.label });
    return list.getByText(option).click();
  }

  getOption(option: string) {
    return this.parentLocator.getByRole('button', { name: option });
  }
}
