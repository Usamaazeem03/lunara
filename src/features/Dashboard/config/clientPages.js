import BookAppointmentPage from "../../Appointments/clientSideBooking/ClientAppointmentPageLayout";
import MyAppointmentPage from "../Client/ClientPages/MyAppointmentPage";
import PaymentHistoryPage from "../Client/ClientPages/PaymentHistoryPage";
import OffersLoyaltyPage from "../Client/ClientPages/OffersLoyaltyPage";
import NotificationPage from "../Client/ClientPages/NotificationPage";
import HomePage from "../Client/ClientPages/HomePage";
import ClientSettingsPage from "../../settings/ClientSettingsPage";
export const CLIENT_PAGES = {
  home: HomePage,
  "book-appointment": BookAppointmentPage,
  "my-appointment": MyAppointmentPage,
  "payment-history": PaymentHistoryPage,
  "offers-loyalty": OffersLoyaltyPage,
  notifications: NotificationPage,
  settings: ClientSettingsPage,
};
