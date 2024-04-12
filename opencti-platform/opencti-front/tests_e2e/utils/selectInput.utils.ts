import { Locator, Page } from '@playwright/test';

interface SelectInputUtilsOptions {
  page: Page
  multiple?: boolean
}

export default class SelectInputUtils {
  private page: Page;

  private multiple: boolean;

  private inputLocator: Locator;

  private parentLocator: Locator;

  constructor(private label: string, { page, multiple = true }: SelectInputUtilsOptions) {
    this.page = page;
    this.multiple = multiple;
    this.inputLocator = this.page.getByRole('combobox', { name: label });
    this.parentLocator = this.page.locator('div').filter({ has: this.inputLocator });
  }

  async selectOption(option: string) {
    await this.inputLocator.click();
    await this.inputLocator.fill(option);
    const list = this.page.getByRole('listbox', { name: this.label });
    return list.getByText(option).click();
  }

  getOption(option: string) {
    return this.multiple
      ? this.parentLocator.getByRole('button', { name: option })
      : this.inputLocator;
  }
}
