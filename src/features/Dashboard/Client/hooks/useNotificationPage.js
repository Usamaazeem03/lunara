import {
  notifications,
  filterTabs,
  channels,
  deliveryChecklist,
} from "../data/notificationPageData.js";
import { useState } from "react";
import bellIcon from "../../../../Shared/assets/icons/bell.svg";
import calendarIcon from "../../../../Shared/assets/icons/calendar.svg";
import creditCardIcon from "../../../../Shared/assets/icons/credit-card.svg";

// Demo dashboard data is kept here until these screens have API endpoints.
export function useNotificationPage() {
  const unreadCount = notifications.filter((item) => item.unread).length;

  const [activeFilter, setActiveFilter] = useState(filterTabs[0].key);

  const [preferences, setPreferences] = useState([
    {
      title: "Appointment Reminders",
      description: "Get notified about upcoming appointments.",
      enabled: true,
    },
    {
      title: "Promotional Offers",
      description: "Receive updates about special offers and deals.",
      enabled: false,
    },
    {
      title: "Payment Notifications",
      description: "Get notified about payment confirmations.",
      enabled: true,
    },
    {
      title: "Loyalty Updates",
      description: "Updates about your loyalty points and rewards.",
      enabled: false,
    },
  ]);

  const handleToggle = (index) => {
    setPreferences((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const categoryCounts = notifications.reduce((acc, notification) => {
    const key = notification.category;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const filterCounts = {
    All: notifications.length,
    ...categoryCounts,
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "All") return true;
    return notification.category === activeFilter;
  });

  const unreadNotifications = filteredNotifications.filter(
    (notification) => notification.unread,
  );
  const readNotifications = filteredNotifications.filter(
    (notification) => !notification.unread,
  );

  const notificationStats = [
    {
      title: "Unread",
      value: `${unreadCount}`,
      subtitle: "Need attention",
      icon: bellIcon,
    },
    {
      title: "Appointments",
      value: `${categoryCounts.Appointments ?? 0}`,
      subtitle: "Upcoming updates",
      icon: calendarIcon,
    },
    {
      title: "Bill Not Paid",
      value: `${categoryCounts["Bill Not Paid"] ?? 0}`,
      subtitle: "Payment reminders",
      icon: creditCardIcon,
    },
  ];

  return {
    notifications,
    unreadCount,
    filterTabs,
    handleToggle,
    channels,
    filterCounts,
    filteredNotifications,
    unreadNotifications,
    readNotifications,
    notificationStats,
    deliveryChecklist,
    activeFilter,
    setActiveFilter,
    preferences,
  };
}
