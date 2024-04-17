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
  await reportForm.selectReportTypeOption('malware');
  await expect(reportForm.getReportTypeOption('malware')).toBeVisible();
  await reportForm.selectReportTypeOption('threat-report');
  await expect(reportForm.getReportTypeOption('threat-report')).toBeVisible();

  // Reliability
  await reportForm.selectReliabilityOption('C - Fairly reliable');
  await expect(reportForm.getReliabilityOption('C - Fairly reliable')).toBeVisible();

  // Confidence level
  await reportForm.confidenceLevelField.fillInput('75');
  await expect(reportForm.confidenceLevelField.getSelect().getByText('2 - Probably True')).toBeVisible();
  await reportForm.confidenceLevelField.selectOption('- Possibly True');
  await expect(reportForm.confidenceLevelField.getInput().getByText('40')).toBeVisible();

  // Description
  await reportForm.fillDescriptionInput('Test e2e Description');
  await expect(page.getByText('Test e2e Description')).toBeVisible();

  // Content
  await reportForm.fillContentInput('This is a Test e2e content');
  await expect(page.getByText('This is a Test e2e content')).toBeVisible();

  // Assignees
  await reportForm.selectAssigneesOption('admin');
  await expect(reportForm.getAssigneesOption('admin')).toBeVisible();

  // Participants
  // await reportForm.selectParticipantsOption('admin');
  // await expect(reportForm.getParticipantsOption('admin')).toBeVisible();

  // Author
  await reportForm.selectAuthorOption('Allied Universal');
  await expect(reportForm.getAuthorOption('Allied Universal')).toBeVisible();

  // Labels
  await reportForm.selectLabelsOption('campaign');
  await expect(reportForm.getLabelsOption('campaign')).toBeVisible();
  await reportForm.selectLabelsOption('report');
  await expect(reportForm.getLabelsOption('report')).toBeVisible();

  // Markings
  await reportForm.selectMarkingsOption('PAP:CLEAR');
  await expect(reportForm.getMarkingsOption('PAP:CLEAR')).toBeVisible();
  await reportForm.selectMarkingsOption('TLP:GREEN');
  await expect(reportForm.getMarkingsOption('TLP:GREEN')).toBeVisible();

  /*  // External references type
  await reportForm.selectExternalReferencesOption('malware');
  await expect(reportForm.getExternalReferencesOption('malware')).toBeVisible(); */

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
