import * as path from 'path';
import { format } from 'date-fns';
import { expect, test } from '../fixtures/baseFixtures';
import ReportPage from '../model/report.pageModel';
import ReportDetailsPage from '../model/reportDetails.pageModel';
import ReportFormPage from '../model/reportForm.pageModel';
import fakeDate from '../utils';

test('Create a new report', async ({ page }) => {
  await fakeDate(page, 'April 1 2024 12:00:00');

  const reportPage = new ReportPage(page);
  const reportDetailsPage = new ReportDetailsPage(page);
  const reportForm = new ReportFormPage(page);

  await page.goto('/dashboard/analyses/reports');

  // region Check is displayed
  // -------------------------

  await reportPage.addNewReport();
  await expect(reportForm.getTitle()).toBeVisible();
  await reportForm.getCancelButton().click();
  await expect(reportForm.getTitle()).not.toBeVisible();
  await reportPage.addNewReport();
  await expect(reportForm.getTitle()).toBeVisible();

  // ---------
  // endregion

  // region Check default values in the form
  // ---------------------------------------

  await expect(reportForm.publicationDateField.getInput()).toHaveValue('2024-04-01 12:00 PM');
  await expect(reportForm.confidenceLevelField.getInput()).toHaveValue('100');

  // ---------
  // endregion

  // region Check fields validation
  // ------------------------------

  await reportForm.nameField.fill('');
  await reportForm.getCreateButton().click();
  await expect(page.getByText('This field is required')).toBeVisible();
  await reportForm.nameField.fill('t');
  await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
  await reportForm.nameField.fill('Test e2e');
  await expect(page.getByText('Name must be at least 2 characters')).toBeHidden();

  await reportForm.publicationDateField.clear();
  await expect(page.getByText('This field is required')).toBeVisible();
  await reportForm.publicationDateField.fill('2023-12-05');
  await expect(page.getByText('The value must be a datetime (yyyy-MM-dd hh:mm (a|p)m)')).toBeVisible();
  await reportForm.publicationDateField.fill('2023-12-05 12:00 AM');
  await expect(page.getByText('The value must be a datetime (yyyy-MM-dd hh:mm (a|p)m)')).toBeHidden();

  await reportForm.reportTypesSelect.selectOption('malware');
  await expect(reportForm.reportTypesSelect.getOption('malware')).toBeVisible();
  await reportForm.reportTypesSelect.selectOption('threat-report');
  await expect(reportForm.reportTypesSelect.getOption('threat-report')).toBeVisible();

  await reportForm.reliabilitySelect.selectOption('C - Fairly reliable');
  await expect(reportForm.reliabilitySelect.getOption('C - Fairly reliable')).toBeVisible();

  await reportForm.confidenceLevelField.fillInput('75');
  await expect(reportForm.confidenceLevelField.getSelect().getByText('2 - Probably True')).toBeVisible();
  // await reportForm.confidenceLevelField.selectOption('- Possibly True');
  // await expect(reportForm.confidenceLevelField.getInput().getByText('40')).toBeVisible();

  await reportForm.descriptionField.fill('Test e2e Description');
  await expect(reportForm.descriptionField.get()).toHaveValue('Test e2e Description');

  await reportForm.contentField.fill('This is a Test e2e content');
  await expect(page.getByText('This is a Test e2e content')).toBeVisible();

  await reportForm.assigneesSelect.selectOption('admin');
  await expect(reportForm.assigneesSelect.getOption('admin')).toBeVisible();

  await reportForm.participantsSelect.selectOption('admin');
  await expect(reportForm.participantsSelect.getOption('admin')).toBeVisible();

  await reportForm.authorSelect.selectOption('Allied Universal');
  await expect(reportForm.authorSelect.getOption('Allied Universal')).toBeVisible();

  await reportForm.labelsSelect.selectOption('campaign');
  await expect(reportForm.labelsSelect.getOption('campaign')).toBeVisible();
  await reportForm.labelsSelect.selectOption('report');
  await expect(reportForm.labelsSelect.getOption('report')).toBeVisible();

  await reportForm.markingsSelect.selectOption('PAP:CLEAR');
  await expect(reportForm.markingsSelect.getOption('PAP:CLEAR')).toBeVisible();
  await reportForm.markingsSelect.selectOption('TLP:GREEN');
  await expect(reportForm.markingsSelect.getOption('TLP:GREEN')).toBeVisible();

  await reportForm.getCreateButton().click();
  await reportPage.getItemFromList('Test e2e').click();
  await expect(reportDetailsPage.getReportDetailsPage()).toBeVisible();

  // ---------
  // endregion

  // region Control data on report details page
  // ------------------------------------------

  const description = reportDetailsPage.getTextForHeading('Description', 'Test e2e Description');
  await expect(description).toBeVisible();

  const publicationDate = reportDetailsPage.getTextForHeading('Publication date', 'December 5, 2023');
  await expect(publicationDate).toBeVisible();

  const reportTypeThreat = reportDetailsPage.getTextForHeading('Report types', 'THREAT-REPORT');
  await expect(reportTypeThreat).toBeVisible();
  const reportTypeMalware = reportDetailsPage.getTextForHeading('Report types', 'MALWARE');
  await expect(reportTypeMalware).toBeVisible();

  const markingClear = reportDetailsPage.getTextForHeading('Marking', 'PAP:CLEAR');
  await expect(markingClear).toBeVisible();
  const markingGreen = reportDetailsPage.getTextForHeading('Marking', 'TLP:GREEN');
  await expect(markingGreen).toBeVisible();

  const author = reportDetailsPage.getTextForHeading('Author', 'ALLIED UNIVERSAL');
  await expect(author).toBeVisible();

  const reliability = reportDetailsPage.getTextForHeading('Reliability', 'C - Fairly reliable');
  await expect(reliability).toBeVisible();

  const confidenceLevel = reportDetailsPage.getTextForHeading('Confidence level', '2 - Probably True');
  await expect(confidenceLevel).toBeVisible();

  const originalCreationDate = reportDetailsPage.getTextForHeading('Original creation date', 'December 5, 2023');
  await expect(originalCreationDate).toBeVisible();

  const processingStatus = reportDetailsPage.getTextForHeading('Processing status', 'NEW');
  await expect(processingStatus).toBeVisible();

  const assignees = reportDetailsPage.getTextForHeading('Assignees', 'ADMIN');
  await expect(assignees).toBeVisible();

  const participants = reportDetailsPage.getTextForHeading('Participants', 'ADMIN');
  await expect(participants).toBeVisible();

  const revoked = reportDetailsPage.getTextForHeading('Revoked', 'NO');
  await expect(revoked).toBeVisible();

  const labelCampaign = reportDetailsPage.getTextForHeading('Labels', 'campaign');
  await expect(labelCampaign).toBeVisible();
  const labelReport = reportDetailsPage.getTextForHeading('Labels', 'report');
  await expect(labelReport).toBeVisible();

  const creators = reportDetailsPage.getTextForHeading('Creators', 'ADMIN');
  await expect(creators).toBeVisible();

  const now = format(new Date(), 'MMMM d, yyyy');
  const creationDate = reportDetailsPage.getTextForHeading('Platform creation date', now);
  await expect(creationDate).toBeVisible();
  const updateDate = reportDetailsPage.getTextForHeading('Modification date', now);
  await expect(updateDate).toBeVisible();

  const historyDescription = reportDetailsPage.getTextForHeading('Most recent history', 'admin creates a Report Test e2e');
  await expect(historyDescription).toBeVisible();
  const historyDate = reportDetailsPage.getTextForHeading('Most recent history', format(new Date(), 'MMM d, yyyy'));
  await expect(historyDate).toBeVisible();

  // ---------
  // endregion

  // region Content page
  // -------------------

  await reportDetailsPage.goToContentTab();
  await expect(page.getByText('This is a Test e2e content')).toBeVisible();

  //   const fileChooserPromise = page.waitForEvent('filechooser');
  //   await page.getByRole('button', { name: 'Select your file', exact: true }).click();
  //   const fileChooser = await fileChooserPromise;
  //   await fileChooser.setFiles([
  //     path.join(__dirname, 'assets/report.test.html'),
  //     path.join(__dirname, 'assets/report.test.md'),
  //     path.join(__dirname, 'assets/report.test.pdf'),
  //     path.join(__dirname, 'assets/report.test.txt'),
  //   ]);

  // ---------
  // endregion
});

test('Create a new report with associated file', async ({ page }) => {
  const reportPage = new ReportPage(page);
  const reportDetailsPage = new ReportDetailsPage(page);
  const reportForm = new ReportFormPage(page);
  await page.goto('/dashboard/analyses/reports');
  await reportPage.addNewReport();
  await reportForm.nameField.fill('Test e2e with file');
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
