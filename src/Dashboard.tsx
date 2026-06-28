import { useState } from 'react';
import { Header } from './components/layout/Header';
import { DashboardTabs } from './components/layout/DashboardTabs';
import { FilterBar } from './components/dashboard/FilterBar';
import { KPICards } from './components/dashboard/KPICards';
import { DashboardEmptyState } from './components/dashboard/DashboardEmptyState';
import { ChartCard } from './components/charts/ChartCard';
import { VitalAveragesChart } from './components/charts/VitalAveragesChart';
import { FileUploadPanel } from './components/upload/FileUploadPanel';
import { DataPreviewSection } from './components/preview/DataPreviewSection';
import { AiAnalyticsAssistant } from './components/assistant/AiAnalyticsAssistant';
import { SavedChartsDashboard } from './components/savedCharts/SavedChartsDashboard';
import { useHealthcareData } from './hooks/useHealthcareData';
import { useFileUpload } from './hooks/useFileUpload';
import { useSavedCharts } from './hooks/useSavedCharts';
import type { DashboardTab } from './types/savedChart';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const {
    filteredRecords,
    filters,
    setFilters,
    analytics,
    loadRecords,
    clearRecords,
    hasDataset,
  } = useHealthcareData();
  const { upload, uploadFile, clearUpload } = useFileUpload({
    onDataLoaded: loadRecords,
    onDataCleared: clearRecords,
  });
  const { savedCharts, saveChart, deleteChart, lastSavedTitle } = useSavedCharts();
  const [activeTab, setActiveTab] = useState<DashboardTab>('analytics');

  function handleClearDataset() {
    clearUpload();
  }

  function handleLogout() {
    clearUpload();
    onLogout();
  }

  return (
    <div className="app-shell">
      <Header onLogout={handleLogout} />
      <main className="dashboard-main">
        <DashboardTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          savedCount={savedCharts.length}
        />

        {activeTab === 'saved' ? (
          <SavedChartsDashboard savedCharts={savedCharts} onDelete={deleteChart} />
        ) : (
          <>
            <FileUploadPanel
              upload={upload}
              onFileSelect={uploadFile}
              onClearDataset={handleClearDataset}
            />
            {!hasDataset ? <DashboardEmptyState /> : null}
            <DataPreviewSection upload={upload} />
            <AiAnalyticsAssistant upload={upload} disabled={!hasDataset} />

            {hasDataset ? (
              <>
                <FilterBar
                  filters={filters}
                  options={analytics.filterOptions}
                  onChange={setFilters}
                  resultCount={filteredRecords.length}
                />
                {lastSavedTitle ? (
                  <div className="save-chart-toast">
                    Saved &quot;{lastSavedTitle}&quot; to Saved Charts Dashboard.
                  </div>
                ) : null}
                <KPICards kpis={analytics.kpis} />

                <section className="charts-grid">
                  <ChartCard
                    title="Disease Category"
                    subtitle="Primary Disease Category column"
                    data={analytics.diseaseCategory}
                    type="bar"
                    layout="horizontal"
                    onSave={() =>
                      saveChart({
                        title: 'Disease Category',
                        chartType: 'bar',
                        layout: 'horizontal',
                        subtitle: 'Primary Disease Category column',
                        filters,
                        data: analytics.diseaseCategory,
                      })
                    }
                  />
                  <ChartCard
                    title="Gender Distribution"
                    subtitle="Gender column"
                    data={analytics.gender}
                    type="pie"
                    onSave={() =>
                      saveChart({
                        title: 'Gender Distribution',
                        chartType: 'pie',
                        subtitle: 'Gender column',
                        filters,
                        data: analytics.gender,
                      })
                    }
                  />
                  <ChartCard
                    title="Age Distribution"
                    subtitle="Age column (binned)"
                    data={analytics.ageDistribution}
                    type="bar"
                    onSave={() =>
                      saveChart({
                        title: 'Age Distribution',
                        chartType: 'bar',
                        subtitle: 'Age column (binned)',
                        filters,
                        data: analytics.ageDistribution,
                      })
                    }
                  />
                  <ChartCard
                    title="BMI Category"
                    subtitle="BMI Category column"
                    data={analytics.bmiCategory}
                    type="pie"
                    onSave={() =>
                      saveChart({
                        title: 'BMI Category',
                        chartType: 'pie',
                        subtitle: 'BMI Category column',
                        filters,
                        data: analytics.bmiCategory,
                      })
                    }
                  />
                  <ChartCard
                    title="Blood Pressure Status"
                    subtitle="BP Status column"
                    data={analytics.bpStatus}
                    type="bar"
                    onSave={() =>
                      saveChart({
                        title: 'Blood Pressure Status',
                        chartType: 'bar',
                        subtitle: 'BP Status column',
                        filters,
                        data: analytics.bpStatus,
                      })
                    }
                  />
                  <ChartCard
                    title="Treatment Outcome"
                    subtitle="Outcome column"
                    data={analytics.outcome}
                    type="bar"
                    layout="horizontal"
                    onSave={() =>
                      saveChart({
                        title: 'Treatment Outcome',
                        chartType: 'bar',
                        layout: 'horizontal',
                        subtitle: 'Outcome column',
                        filters,
                        data: analytics.outcome,
                      })
                    }
                  />
                  <ChartCard
                    title="Admissions Over Time"
                    subtitle="Admission Date column (monthly)"
                    data={analytics.admissionTrend}
                    type="line"
                    onSave={() =>
                      saveChart({
                        title: 'Admissions Over Time',
                        chartType: 'line',
                        subtitle: 'Admission Date column (monthly)',
                        filters,
                        data: analytics.admissionTrend,
                      })
                    }
                  />
                  <ChartCard
                    title="Patients by Division"
                    subtitle="Division column"
                    data={analytics.division}
                    type="bar"
                    onSave={() =>
                      saveChart({
                        title: 'Patients by Division',
                        chartType: 'bar',
                        subtitle: 'Division column',
                        filters,
                        data: analytics.division,
                      })
                    }
                  />
                  <ChartCard
                    title="Insurance Coverage"
                    subtitle="Insurance column"
                    data={analytics.insurance}
                    type="pie"
                    onSave={() =>
                      saveChart({
                        title: 'Insurance Coverage',
                        chartType: 'pie',
                        subtitle: 'Insurance column',
                        filters,
                        data: analytics.insurance,
                      })
                    }
                  />
                  <ChartCard
                    title="Vaccination Status"
                    subtitle="Vaccination Status column"
                    data={analytics.vaccinationStatus}
                    type="pie"
                    onSave={() =>
                      saveChart({
                        title: 'Vaccination Status',
                        chartType: 'pie',
                        subtitle: 'Vaccination Status column',
                        filters,
                        data: analytics.vaccinationStatus,
                      })
                    }
                  />
                  <VitalAveragesChart
                    data={analytics.vitalAverages}
                    onSave={() =>
                      saveChart({
                        title: 'Average Vital Signs',
                        chartType: 'bar',
                        subtitle:
                          'Systolic/Diastolic BP, Pulse Rate, SpO2, Blood Glucose, Haemoglobin',
                        filters,
                        data: analytics.vitalAverages,
                      })
                    }
                  />
                </section>
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
