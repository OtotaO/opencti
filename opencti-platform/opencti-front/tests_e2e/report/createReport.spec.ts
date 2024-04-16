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

  // Reliability
  await reportForm.selectReliabilityOption('C - Fairly reliable');
  await expect(reportForm.getReliabilityOption('C - Fairly reliable')).toBeVisible();

  /*  // Confidence level
  await reportForm.fillConfidenceLevelInput('80');
  await expect(reportForm.getConfidenceLevelOption('- Confirmed by other sources')).toBeVisible(); */

  // Description
  await reportForm.fillDescriptionInput('Test e2e Description');
  await expect(page.getByText('Test e2e Description')).toBeVisible();

  // Content
  await reportForm.fillContentInput('This is a Test e2e content');
  await expect(page.getByText('This is a Test e2e content')).toBeVisible();

  // Assignees type
  await reportForm.selectAssigneeseOption('admin');
  await expect(reportForm.getAssigneesOption('admin')).toBeVisible();

  /*  // Participants type
  await reportForm.selectParticipantsOption('admin');
  await expect(reportForm.getParticipantsOption('admin')).toBeVisible(); */

  // Author type
  await reportForm.selectAuthorOption('Allied Universal');
  await expect(reportForm.getAuthorOption('Allied Universal')).toBeVisible();

  // Labels type
  await reportForm.selectLabelsOption('campaign');
  await expect(reportForm.getLabelsOption('campaign')).toBeVisible();

  // Markings type
  await reportForm.selectMarkingsOption('PAP:CLEAR');
  await expect(reportForm.getMarkingsOption('PAP:CLEAR')).toBeVisible();

  /*  // External references type
  await reportForm.selectExternalReferenceslOption('malware');
  await expect(reportForm.getExternalReferenceslOption('malware')).toBeVisible(); */

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
