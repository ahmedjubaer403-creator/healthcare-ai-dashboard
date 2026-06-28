# Healthcare AI Dashboard

## Overview

Healthcare AI Dashboard is a React-based analytics application developed as part of the technical assessment. The application allows users to upload CSV or Excel datasets, automatically analyzes the data, generates interactive visualizations, and provides AI-assisted insights with clearly labeled data sources.

The project focuses on creating an end-to-end analytics workflow, from data ingestion to visualization and AI-powered exploration.

---

## Features

* Mock user authentication
* Upload CSV (.csv) and Excel (.xlsx) files
* Parse uploaded files into structured JSON
* Preview the first 100 rows of uploaded data
* Data Quality Summary

  * Missing values by column
  * Duplicate row detection
* Dynamic analytics dashboard
* Interactive charts
* AI-powered data assistant
* Source-labelled AI responses
* Saved Charts Dashboard
* Responsive UI
* LocalStorage support for saved charts

---

## AI Response Format

Every AI response follows the required assignment structure:

* Source A — Based on the uploaded file
* Source B — Based on parsed structured data
* Comparison
* Suggested Next Step / Chart

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite

### Data Processing

* SheetJS
* PapaParse

### Charts

* Recharts

### Storage

* LocalStorage

### Authentication

* Mock Authentication

---

## Installation

Clone the repository

```bash
git clone https://github.com/ahmedjubaer403-creator/healthcare-ai-dashboard.git
```

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Build

```bash
npm run build
```

---

## Deployment

The application has been deployed using Vercel.

---

## Sample Dataset

A sample healthcare dataset is included in the repository for testing.

---

## Assumptions

* Authentication is implemented as mock authentication for demonstration purposes.
* AI responses are generated using the uploaded dataset and parsed data.
* Saved charts are stored locally using LocalStorage.

---

## Limitations

* No backend database.
* Saved charts are browser-specific.
* Authentication is mock only.
* Large datasets may require additional optimization.

---

## Future Improvements

* Real authentication (Firebase/Supabase/Auth0)
* Database persistence
* OpenAI API integration
* Advanced dashboard filtering
* Export charts as PDF/PNG
* Multi-user support

---

## Project Structure

```
src/
components/
hooks/
pages/
utils/
types/

public/

README.md
package.json
```

---

## Author

Ahmed Jubaer

Technical Assessment Submission
