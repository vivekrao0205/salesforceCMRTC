/**
 * Salesforce Club CMRTC — Google Sheets to Website Sync Script
 * -------------------------------------------------------------
 * Attach this script to your Google Sheet receiving Google Form responses.
 * Whenever a new row is submitted or edited, it sends a payload to your website's API.
 */

const WEBSITE_SYNC_URL = "https://your-website-domain.com/api/sync-students";

function onFormSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  
  if (rows.length < 2) return; // Header only
  
  // Assuming headers: Timestamp, Full Name, Roll Number, Email, Department, Year, Section, Trailhead Profile URL, Salesforce Username
  var lastRow = rows[rows.length - 1];
  
  var payload = {
    name: lastRow[1],
    rollNumber: lastRow[2],
    email: lastRow[3],
    department: lastRow[4] || "CSE",
    year: String(lastRow[5] || "1"),
    section: lastRow[6] || "",
    trailheadUrl: lastRow[7] || "",
    salesforceUsername: lastRow[8] || "",
    trailheadPoints: 0,
    badges: 0,
    superbadges: 0,
    certifications: 0,
    clubPoints: 0
  };
  
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  
  try {
    var response = UrlFetchApp.fetch(WEBSITE_SYNC_URL, options);
    Logger.log("Sync response: " + response.getContentText());
  } catch (error) {
    Logger.log("Error syncing student: " + error.toString());
  }
}
