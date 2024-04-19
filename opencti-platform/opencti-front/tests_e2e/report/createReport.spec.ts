import * as path from 'path';
import { expect, test } from '../fixtures/baseFixtures';
import ReportPage from '../model/report.pageModel';
import ReportDetailsPage from '../model/reportDetails.pageModel';
import ReportFormPage from '../model/reportForm.pageModel';

test('Create a new report', async ({ page }) => {
  const reportPage = new ReportPage(page);
  const reportDetailsPage = new ReportDetailsPage(page);
  const reportForm = new ReportFormPage(page);

  await page.goto('/dashboard/analyses/reports');
  await reportPage.addNewReport();

  // region Check default values in the form
  // ---------------------------------------

  // Publication date
  const dateNow = new Date().toISOString().substring(0, 10);
  const publicationDateInputValue = await reportForm.getPublicationDateInput().inputValue();
  expect(publicationDateInputValue.startsWith(dateNow)).toBeTruthy();

  // Confidence level
  await expect(reportForm.confidenceLevelField.getInput()).toHaveValue('100');

  // ---------
  // endregion

  // region Check fields validation
  // ------------------------------

  // Name
  await reportForm.fillNameInput('');
  await reportForm.getPublicationDateInput().click();
  await expect(page.getByText('This field is required')).toBeVisible();
  await reportForm.fillNameInput('t');
  await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
  await reportForm.fillNameInput('Test e2e');
  await expect(page.getByText('Name must be at least 2 characters')).toBeHidden();

  // Publication date
  await reportForm.clearPublicationDateInput();
  await expect(page.getByText('This field is required')).toBeVisible();
  await reportForm.fillPublicationDateInput('2023-12-05');
  await expect(page.getByText('The value must be a datetime (yyyy-MM-dd hh:mm (a|p)m)')).toBeVisible();
  await reportForm.fillPublicationDateInput('2023-12-05 12:00 AM');
  await expect(page.getByText('The value must be a datetime (yyyy-MM-dd hh:mm (a|p)m)')).toBeHidden();

  // Report type
  await reportForm.reportTypesSelect.selectOption('malware');
  await expect(reportForm.reportTypesSelect.getOption('malware')).toBeVisible();
  await reportForm.reportTypesSelect.selectOption('threat-report');
  await expect(reportForm.reportTypesSelect.getOption('threat-report')).toBeVisible();

  // Reliability
  await reportForm.reliabilitySelect.selectOption('C - Fairly reliable');
  await expect(reportForm.reliabilitySelect.getOption('C - Fairly reliable')).toBeVisible();

  // Confidence level
  await reportForm.confidenceLevelField.fillInput('75');
  await expect(reportForm.confidenceLevelField.getSelect().getByText('2 - Probably True')).toBeVisible();
  // await reportForm.confidenceLevelField.selectOption('- Possibly True');
  // await expect(reportForm.confidenceLevelField.getInput().getByText('40')).toBeVisible();

  // Description
  await reportForm.fillDescriptionInput('Test e2e Description');
  await expect(reportForm.getDescriptionInput()).toHaveValue('Test e2e Description');

  // Content
  await reportForm.fillContentInput('This is a Test e2e content');
  await expect(page.getByText('This is a Test e2e content')).toBeVisible();

  // Assignees
  await reportForm.assigneesSelect.selectOption('admin');
  await expect(reportForm.assigneesSelect.getOption('admin')).toBeVisible();

  // Participants
  await reportForm.participantsSelect.selectOption('admin');
  await expect(reportForm.participantsSelect.getOption('admin')).toBeVisible();

  // Author
  await reportForm.authorSelect.selectOption('Allied Universal');
  await expect(reportForm.authorSelect.getOption('Allied Universal')).toBeVisible();

  // Labels
  await reportForm.labelsSelect.selectOption('campaign');
  await expect(reportForm.labelsSelect.getOption('campaign')).toBeVisible();
  await reportForm.labelsSelect.selectOption('report');
  await expect(reportForm.labelsSelect.getOption('report')).toBeVisible();

  // Markings
  await reportForm.markingsSelect.selectOption('PAP:CLEAR');
  await expect(reportForm.markingsSelect.getOption('PAP:CLEAR')).toBeVisible();
  await reportForm.markingsSelect.selectOption('TLP:GREEN');
  await expect(reportForm.markingsSelect.getOption('TLP:GREEN')).toBeVisible();

  // ---------
  // endregion

/*  await reportPage.getCreateReportButton().click();
  await reportPage.getItemFromList('Test e2e').click();
  await expect(reportDetailsPage.getReportDetailsPage()).toBeVisible(); */
});

test('Create a new report with associated file', async ({ page }) => {
  const reportPage = new ReportPage(page);
  const reportDetailsPage = new ReportDetailsPage(page);
  const reportForm = new ReportFormPage(page);
  await page.goto('/dashboard/analyses/reports');
  await reportPage.addNewReport();
  await reportForm.fillNameInput('Test e2e with file');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Select your file', exact: true }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, 'createReport.spec.ts'));
  await reportPage.getCreateReportButton().click();
  await reportPage.getItemFromList('Test e2e with file').click();
  await expect(reportDetailsPage.getReportDetailsPage()).toBeVisible();
  await page.getByRole('tab', { name: 'Data' }).click();
  await expect(page.getByRole('button', { name: 'createReport.spec.ts Launch' })).toBeVisible();
});
