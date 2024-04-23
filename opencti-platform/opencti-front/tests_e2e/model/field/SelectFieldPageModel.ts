import { Locator, Page } from '@playwright/test';

export default class SelectFieldPageModel {
  private readonly inputLocator: Locator;
  private readonly parentLocator: Locator;

  constructor(
    private readonly page: Page | Locator,
    private readonly label: string,
    private readonly multiple = true,
  ) {
    this.inputLocator = this.page.getByRole('combobox', { name: label });
    this.parentLocator = this.inputLocator.locator('../..');
  }

  async selectOption(option: string) {
    await this.inputLocator.click();
    await this.inputLocator.fill(option);
    const list = this.page.getByRole('listbox', { name: this.label });
    return list.getByText(option, { exact: true }).click();
  }

  getOption(option: string) {
    return this.multiple
      ? this.parentLocator.getByRole('button', { name: option, exact: true })
      : this.inputLocator;
  }

  getByText(input: string) {
    return this.parentLocator.getByText(input);
  }
}
