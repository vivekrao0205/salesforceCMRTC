# Salesforce Club CMRTC — Data Ingestion & Google Sheets Setup Guide

This guide explains how to connect your official **Google Form** to your **Google Sheet** and sync responses directly into the website's database.

---

## 1. Google Form Setup

Create a Google Form with the following fields:
1. **Full Name** (Short Answer — Required)
2. **Roll Number** (Short Answer — Required, e.g. `237R1A0501`)
3. **Email Address** (Short Answer — Required)
4. **Department** (Dropdown — CSE, IT, ECE, EEE, MECH, CIVIL, CSE-DS, CSE-AIML)
5. **Academic Year** (Dropdown — 1, 2, 3, 4)
6. **Section** (Short Answer — e.g. A, B, C)
7. **Trailhead Profile URL** (Short Answer — e.g. `https://trailblazer.me/id/...`)
8. **Salesforce Username** (Short Answer)

---

## 2. Link Form to Google Sheets

1. In Google Form, click **Responses** → **Link to Sheets**.
2. Create a new Spreadsheet titled `Salesforce Club CMRTC — Form Responses`.

---

## 3. Attach Apps Script Trigger

1. In the Google Sheet, navigate to **Extensions** → **Apps Script**.
2. Replace default code with the contents of [`docs/google-apps-script.js`](file:///c:/Users/Vivek/Downloads/salesforceCMRTC/docs/google-apps-script.js).
3. Update `WEBSITE_SYNC_URL` to your production or local domain (e.g. `http://localhost:3000/api/sync-students`).
4. In Apps Script left sidebar, click **Triggers** (Clock icon) → **Add Trigger**:
   - Choose function to run: `onFormSubmit`
   - Select event source: `From spreadsheet`
   - Select event type: `On form submit`
5. Click **Save** and grant permissions.

---

## 4. Automatic Webhook Endpoint

The website's API route at `/api/sync-students` handles incoming POST requests, validates student details, creates a new `Student` object, and updates the public student directory and leaderboard.
