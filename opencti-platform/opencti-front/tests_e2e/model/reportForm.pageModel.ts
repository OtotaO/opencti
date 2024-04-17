import { Page } from '@playwright/test';
import SelectInputUtils from '../utils/selectInput.utils';

export default class ReportFormPage {
  private reportTypesSelect = new SelectInputUtils('Report types', {
    page: this.page,
  });

  private reliabilitySelect = new SelectInputUtils('Reliability', {
    page: this.page,
    multiple: false,
  });

  private confidenceLevelSelect = new SelectInputUtils('select_Confidence level', {
    page: this.page,
    multiple: false,
  });

  private assigneesSelect = new SelectInputUtils('Assignee(s)', {
    page: this.page,
    multiple: true,
  });

  private participantsSelect = new SelectInputUtils('Participant(s)', {
    page: this.page,
    multiple: true,
  });

  private authorSelect = new SelectInputUtils('Author', {
    page: this.page,
    multiple: false,
  });

  private labelsSelect = new SelectInputUtils('Labels', {
    page: this.page,
    multiple: true,
  });

  private markingsSelect = new SelectInputUtils('Markings', {
    page: this.page,
    multiple: true,
  });

  private externalReferencesSelect = new SelectInputUtils('External references', {
    page: this.page,
    multiple: true,
  });

  constructor(private page: Page) {}

  getNameInput() {
    return this.page.getByLabel('Name');
  }

  getPublicationDateInput() {
    return this.page.getByLabel('Publication date');
  }

  getConfidenceLevelInput() {
    return this.page.getByLabel('Confidence level', { exact: true });
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

  async selectReportTypeOption(input: string) {
    return this.reportTypesSelect.selectOption(input);
  }

  getReportTypeOption(input: string) {
    return this.reportTypesSelect.getOption(input);
  }

  async selectReliabilityOption(input: string) {
    return this.reliabilitySelect.selectOption(input);
  }

  getReliabilityOption(input: string) {
    return this.reliabilitySelect.getOption(input);
  }

  getConfidenceLevelOption(input: string) {
    return this.confidenceLevelSelect.getOption(input);
  }

  async fillConfidenceLevelInput(input: string) {
    await this.getConfidenceLevelInput().click();
    return this.getConfidenceLevelInput().fill(input);
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

  async selectAssigneesOption(input: string) {
    return this.assigneesSelect.selectOption(input);
  }

  getAssigneesOption(input: string) {
    return this.assigneesSelect.getOption(input);
  }

  async selectParticipantsOption(input: string) {
    return this.participantsSelect.selectOption(input);
  }

  getParticipantsOption(input: string) {
    return this.participantsSelect.getOption(input);
  }

  async selectAuthorOption(input: string) {
    return this.authorSelect.selectOption(input);
  }

  getAuthorOption(input: string) {
    return this.authorSelect.getOption(input);
  }

  async selectLabelsOption(input: string) {
    return this.labelsSelect.selectOption(input);
  }

  getLabelsOption(input: string) {
    return this.labelsSelect.getOption(input);
  }

  async selectMarkingsOption(input: string) {
    return this.markingsSelect.selectOption(input);
  }

  getMarkingsOption(input: string) {
    return this.markingsSelect.getOption(input);
  }

  async selectExternalReferencesOption(input: string) {
    return this.externalReferencesSelect.selectOption(input);
  }

  getExternalReferencesOption(input: string) {
    return this.externalReferencesSelect.getOption(input);
  }

  getCloseButton() {
    return this.page.getByRole('button', { name: 'Close' });
  }
}
