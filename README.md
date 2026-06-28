# 🏥 Healthcare AI Dashboard

A modern React-based Healthcare Analytics Dashboard developed as part of a technical assessment. The application enables users to upload healthcare datasets, automatically analyze data quality, visualize insights through interactive charts, and explore the data using an AI-assisted analytics interface.

**Live Demo:** https://healthcare-ai-dashboard.vercel.app

**GitHub Repository:** https://github.com/ahmedjubaer403-creator/healthcare-ai-dashboard

---

# 📌 Project Overview

The objective of this project was to build a complete analytics workflow that transforms uploaded healthcare datasets into meaningful visual insights.

The application allows users to:

* Upload CSV or Excel datasets
* Parse data into structured JSON
* Review data quality
* Generate interactive visualizations
* Ask AI-powered questions about the uploaded data
* Save charts for future reference

The solution was designed with modular React components, reusable hooks, and a clean user interface while keeping the architecture easy to maintain and extend.

---

# ✨ Features

## 🔐 Authentication

* Mock user login
* Session persistence
* Logout support

---

## 📂 File Upload

Supports

* CSV (.csv)
* Excel (.xlsx)

Uploaded datasets are parsed immediately and converted into structured JSON for further analysis.

---

## 📊 Data Preview

* Displays the first 100 rows
* Collapsible preview table
* Dynamic column generation

---

## 📈 Data Quality Summary

Automatically calculates

* Missing values per column
* Duplicate row count
* Dataset overview

---

## 📉 Interactive Dashboard

The dashboard is generated dynamically from the uploaded dataset.

Includes

* KPI cards
* Summary statistics
* Interactive charts
* Dataset-driven visualizations
* Dynamic filtering

No analytics are displayed until a valid dataset is uploaded.

---

## 🤖 AI Analytics Assistant

Users can ask questions about the uploaded dataset.

Each response follows the required assessment structure:

### Source A

Answer based on the uploaded file.

### Source B

Answer based on the parsed structured dataset.

### Comparison

Explains whether both answers match and why.

### Suggested Next Step

Recommends additional analysis or visualizations.

---

## 💾 Saved Charts Dashboard

Users can

* Save charts
* View saved charts
* Delete saved charts

Saved charts are stored using LocalStorage and remain available after refreshing the application.

---

# 🏗️ Technology Stack

## Frontend

* React
* TypeScript
* Vite

## Data Processing

* SheetJS
* PapaParse

## Charts

* Recharts

## Storage

* LocalStorage

## Authentication

* Mock Authentication

## Styling

* CSS

---

# 📁 Project Structure

```text
src/
│
├── components/
├── hooks/
├── pages/
├── types/
├── utils/
│
public/
package.json
README.md
```

---

# 🚀 Installation

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

Create production build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# 🌐 Deployment

The application is deployed on **Vercel**.

Production URL

https://healthcare-ai-dashboard.vercel.app

---

# 📄 Sample Dataset

A sample healthcare dataset is included in the repository for testing and demonstration purposes.

---

# 🧠 Design Decisions

Several architectural decisions were made while developing this project:

* Modular and reusable React components
* Reusable custom hooks for state management
* Dynamic rendering based entirely on uploaded datasets
* Empty dashboard state before upload
* Local persistence for saved charts
* Clear separation between data parsing, visualization, and AI interaction
* Responsive layout for different screen sizes

---

# ⚠️ Assumptions

* Authentication is implemented as mock authentication for demonstration.
* AI responses are generated from the uploaded dataset and parsed data structure.
* Saved charts are stored locally in the browser.

---

# 🚧 Current Limitations

* No backend database
* No real authentication provider
* Saved charts are browser-specific
* AI assistant uses local data processing rather than an external LLM API

---

# 🔮 Future Improvements

Potential enhancements include

* OpenAI API integration
* Firebase or Supabase authentication
* Database persistence
* User accounts
* Export charts to PDF or PNG
* Dashboard sharing
* Advanced filtering
* Dark mode
* Role-based access control

---

# ✅ Assignment Requirements Coverage

| Requirement                  | Status |
| ---------------------------- | ------ |
| User Login                   | ✅      |
| CSV Upload                   | ✅      |
| XLSX Upload                  | ✅      |
| Parse to JSON                | ✅      |
| Data Preview                 | ✅      |
| Data Quality Summary         | ✅      |
| AI Chat                      | ✅      |
| Source-labelled AI Responses | ✅      |
| Interactive Charts           | ✅      |
| Saved Charts Dashboard       | ✅      |
| Dynamic Dashboard            | ✅      |

---

# 👨‍💻 Author

**Ahmed Jubaer**

Technical Assessment Submission

Thank you for reviewing this project.
