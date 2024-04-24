import { Page } from '@playwright/test';
import TextFieldPageModel from './field/TextField.pageModel';
import AutocompleteFieldPageModel from './field/AutocompleteFieldPageModel';
import SelectFieldPageModel from './field/SelectFieldPageModel';

export default class AuthorFormPageModel { // TODO should we remove unused variables or use it?
  private readonly formLocator = this.page.getByLabel('Create an entity');
  nameField = new TextFieldPageModel(this.formLocator, 'Name');
  descriptionField = new TextFieldPageModel(this.formLocator, 'Description', 'text-area');
  entityTypeSelect = new SelectFieldPageModel(this.formLocator, 'Entity type');
  labelsAutocomplete = new AutocompleteFieldPageModel(this.formLocator, 'Labels');
  markingsAutocomplete = new AutocompleteFieldPageModel(this.formLocator, 'Markings');
  externalReferencesAutocomplete = new AutocompleteFieldPageModel(this.formLocator, 'External references');

  constructor(private page: Page) {}

  getCreateButton() {
    return this.formLocator.getByText('Create', { exact: true });
  }

  getCancelButton() {
    return this.formLocator.getByRole('button', { name: 'Cancel' });
  }
}
