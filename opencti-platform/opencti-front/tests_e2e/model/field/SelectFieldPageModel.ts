import { Locator, Page } from '@playwright/test';

export default class SelectFieldPageModel {
  private readonly inputLocator: Locator;
  private readonly parentLocator: Locator;

  constructor(
    private readonly page: Page | Locator,
    private readonly label: string,
    private readonly multiple = true,
  ) {
    this.inputLocator = this.page.getByLabel('', { exact: true }); // TODO fix ugly locator
    this.parentLocator = this.inputLocator.locator('../..');
  }

  async selectOption(option: string) {
    await this.inputLocator.click();
    const list = this.page.getByRole('listbox', { name: this.label });
    return list.getByText(option, { exact: true }).click();
  }

  getOption(option: string) {
    return this.multiple
      ? this.parentLocator.getByRole('option', { name: option })
      : this.inputLocator;
  }

  getByText(input: string) {
    return this.parentLocator.getByText(input);
  }
}
