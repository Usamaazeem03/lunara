import AdminDashboard from "../Admin/AdminDashboard";
import AppointmentPage from "../Admin/AppointmentPage";
import ClientPage from "../Admin/ClientPage";
import ServicesPage from "../../services/ServicesPage";
import StaffPage from "../../staff/StaffPage";
import PaymentPage from "../Admin/PaymentPage";
import ReportsPage from "../Admin/ReportsPage";
import SettingsPage from "../../settings/SettingsPage";
import WorkingSchedule from "../Admin/WorkingSchedulePage";
export const OWNER_PAGES = {
  dashboard: AdminDashboard,
  appointments: AppointmentPage,
  clients: ClientPage,
  services: ServicesPage,
  staff: StaffPage,
  payment: PaymentPage,
  reports: ReportsPage,
  schedule: WorkingSchedule,
  settings: SettingsPage,
};
