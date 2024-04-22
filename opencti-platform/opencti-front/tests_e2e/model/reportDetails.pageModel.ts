import { Page } from '@playwright/test';
import path from 'path';
import SelectFieldPageModel from './field/SelectField.pageModel';

export default class ReportDetailsPage {
  labelsSelect = new SelectFieldPageModel(this.page, 'Labels');

  constructor(private page: Page) {}

  getReportDetailsPage() {
    return this.page.getByTestId('report-details-page');
  }

  getTitle(name: string) {
    return this.page.getByRole('heading', { name });
  }

  getEditButton() {
    return this.page.getByLabel('Edit');
  }

  goToOverviewTab() {
    return this.page.getByRole('tab', { name: 'Overview' }).click();
  }

  goToContentTab() {
    return this.page.getByRole('tab', { name: 'Content' }).click();
  }

  async uploadContentFile(file: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.page.getByRole('button', { name: 'Select your file', exact: true }).click();
    const fileChooser = await fileChooserPromise;
    return fileChooser.setFiles(path.join(__dirname, file));
  }

  getContentFile(fileName: string) {
    return this.page.getByLabel(fileName);
  }

  goToObservablesTab() {
    return this.page.getByRole('tab', { name: 'Observables' }).click();
  }

  getTextForHeading(heading: string, text: string) {
    return this.page
      .getByRole('heading', { name: heading })
      .locator('..')
      .getByText(text);
  }

  openLabelsSelect() {
    return this.page.getByLabel('Add new labels').click();
  }

  addLabels() {
    return this.page.getByRole('button', { name: 'Add' }).click();
  }
}
