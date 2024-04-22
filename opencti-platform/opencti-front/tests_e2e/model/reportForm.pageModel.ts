import { Page } from '@playwright/test';
import SelectFieldPageModel from './field/SelectField.pageModel';
import ConfidenceFieldPageModel from './field/ConfidenceField.pageModel';
import DateFieldPageModel from './field/DateField.pageModel';
import TextFieldPageModel from './field/TextField.pageModel';

export default class ReportFormPage {
  nameField = new TextFieldPageModel(this.page, 'Name');
  contentField = new TextFieldPageModel(this.page, 'Content', 'rich-content');
  descriptionField = new TextFieldPageModel(this.page, 'Description', 'text-area');

  confidenceLevelField = new ConfidenceFieldPageModel(this.page, 'Confidence level');

  publicationDateField = new DateFieldPageModel(this.page, 'Publication date');

  labelsSelect = new SelectFieldPageModel(this.page, 'Labels');
  markingsSelect = new SelectFieldPageModel(this.page, 'Markings');
  statusSelect = new SelectFieldPageModel(this.page, 'Status', false);
  authorSelect = new SelectFieldPageModel(this.page, 'Author', false);
  assigneesSelect = new SelectFieldPageModel(this.page, 'Assignee(s)');
  reportTypesSelect = new SelectFieldPageModel(this.page, 'Report types');
  participantsSelect = new SelectFieldPageModel(this.page, 'Participant(s)');
  reliabilitySelect = new SelectFieldPageModel(this.page, 'Reliability', false);

  constructor(private page: Page) {}

  getTitle() {
    return this.page.getByRole('heading', { name: 'Create a report' });
  }

  getCreateButton() {
    return this.page.getByRole('button', { name: 'Create', exact: true });
  }

  getCloseButton() {
    return this.page.getByRole('button', { name: 'Close' });
  }

  getCancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }
}
