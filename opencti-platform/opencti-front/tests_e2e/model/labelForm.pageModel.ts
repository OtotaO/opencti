import { Page } from '@playwright/test';
import TextFieldPageModel from './field/TextField.pageModel';

export default class LabelFormPageModel {
  private readonly formLocator = this.page.getByLabel('Create a label');
  valueField = new TextFieldPageModel(this.formLocator, 'Value');
  colorField = new TextFieldPageModel(this.formLocator, 'Color');

  constructor(private page: Page) {}

  getCreateButton() {
    return this.formLocator.getByText('Create', { exact: true });
  }

  getCancelButton() {
    return this.formLocator.getByRole('button', { name: 'Cancel' });
  }
}
