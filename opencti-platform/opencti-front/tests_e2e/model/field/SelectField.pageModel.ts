import { Locator, Page } from '@playwright/test';

interface SelectFieldPageModelOptions {
  page: Page
  multiple?: boolean
}

export default class SelectFieldPageModel {
  private page: Page;

  private multiple: boolean;

  private inputLocator: Locator;

  private parentLocator: Locator;

  constructor(private label: string, { page, multiple = true }: SelectFieldPageModelOptions) {
    this.page = page;
    this.multiple = multiple;
    this.inputLocator = this.page.getByRole('combobox', { name: label });
    this.parentLocator = this.inputLocator.locator('..');
  }

  async selectOption(option: string) {
    await this.inputLocator.click();
    await this.inputLocator.fill(option);
    const list = this.page.getByRole('listbox', { name: this.label });
    return list.getByText(option).click();
  }

  getOption(option: string) {
    return this.multiple
      ? this.parentLocator.getByRole('button', { name: option, exact: true })
      : this.inputLocator;
  }
}
