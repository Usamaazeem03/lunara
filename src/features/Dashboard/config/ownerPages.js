import AdminDashboard from "../Admin/AdminDashboard";
import AppointmentPage from "../../Appointments/AppointmentPage";
import ClientsPage from "../../clients/ClientsPage";
import ServicesPage from "../../services/ServicesPage";
import StaffPage from "../../staff/StaffPage";
import PaymentsPage from "../../payments/PaymentsPage";
import ReportsPage from "../../reports/ReportsPage";
import SettingsPage from "../../settings/SettingsPage";
import WorkingSchedule from "../../schedule/WorkingSchedulePage";
import WebsiteIntegrationPage from "../../websiteIntegration/WebsiteIntegrationPage";
export const OWNER_PAGES = {
  dashboard: AdminDashboard,
  appointments: AppointmentPage,
  clients: ClientsPage,
  services: ServicesPage,
  staff: StaffPage,
  payment: PaymentsPage,
  reports: ReportsPage,
  schedule: WorkingSchedule,
  settings: SettingsPage,
  "website-integration": WebsiteIntegrationPage,
};
