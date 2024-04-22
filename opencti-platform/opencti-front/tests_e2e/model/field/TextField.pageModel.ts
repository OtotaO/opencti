import { Locator, Page } from '@playwright/test';

type TextFieldPageModelType = 'text' | 'text-area' | 'rich-content';

export default class TextFieldPageModel {
  private readonly inputLocator: Locator;

  constructor(
    private readonly page: Page,
    label: string,
    type: TextFieldPageModelType = 'text',
  ) {
    if (type === 'text-area') {
      const parent = this.page.getByText(label).locator('..');
      this.inputLocator = parent.getByTestId('text-area');
    } else if (type === 'rich-content') {
      const parent = this.page.getByText(label).locator('..');
      this.inputLocator = parent.getByLabel('Editor editing area: main');
    } else {
      this.inputLocator = this.page.getByLabel(label);
    }
  }

  get() {
    return this.inputLocator;
  }

  value() {
    return this.inputLocator.inputValue();
  }

  async clear() {
    await this.inputLocator.clear();
  }

  async fill(input: string, clear = true) {
    await this.inputLocator.click();
    if (clear) await this.clear();
    return this.inputLocator.fill(input);
  }
}
