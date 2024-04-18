import { Page } from '@playwright/test';
import SelectFieldPageModel from './field/SelectField.pageModel';
import ConfidenceFieldPageModel from './field/ConfidenceField.pageModel';

export default class ReportFormPage {
  reportTypesSelect = new SelectFieldPageModel('Report types', {
    page: this.page,
  });

  reliabilitySelect = new SelectFieldPageModel('Reliability', {
    page: this.page,
    multiple: false,
  });

  assigneesSelect = new SelectFieldPageModel('Assignee(s)', {
    page: this.page,
    multiple: true,
  });

  participantsSelect = new SelectFieldPageModel('Participant(s)', {
    page: this.page,
    multiple: true,
  });

  authorSelect = new SelectFieldPageModel('Author', {
    page: this.page,
    multiple: false,
  });

  labelsSelect = new SelectFieldPageModel('Labels', {
    page: this.page,
    multiple: true,
  });

  markingsSelect = new SelectFieldPageModel('Markings', {
    page: this.page,
    multiple: true,
  });

  externalReferencesSelect = new SelectFieldPageModel('External references', {
    page: this.page,
    multiple: true,
  });

  confidenceLevelField = new ConfidenceFieldPageModel('Confidence level', this.page);

  constructor(private page: Page) {}

  getNameInput() {
    return this.page.getByLabel('Name');
  }

  getPublicationDateInput() {
    return this.page.getByLabel('Publication date');
  }

  getDescriptionInput() {
    return this.page.getByTestId('text-area');
  }

  getContentInput() {
    return this.page.getByLabel('Editor editing area: main');
  }

  async fillNameInput(input: string) {
    await this.getNameInput().click();
    return this.getNameInput().fill(input);
  }

  async clearPublicationDateInput() {
    await this.getPublicationDateInput().click();
    await this.page.keyboard.press('Control+A');
    return this.page.keyboard.press('Backspace');
  }

  async fillPublicationDateInput(input: string) {
    await this.getPublicationDateInput().click();
    return this.page.keyboard.type(input);
  }

  async fillDescriptionInput(input: string) {
    await this.getDescriptionInput().click();
    return this.getDescriptionInput().fill(input);
  }

  async fillContentInput(input: string) {
    await this.getContentInput().click();
    await this.getContentInput().clear();
    return this.getContentInput().fill(input);
  }

  getCloseButton() {
    return this.page.getByRole('button', { name: 'Close' });
  }
}
