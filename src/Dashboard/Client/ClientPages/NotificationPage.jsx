import { useState } from "react";

import bellIcon from "../../../Shared/assets/icons/bell.svg";
import calendarIcon from "../../../Shared/assets/icons/calendar.svg";
import creditCardIcon from "../../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../../Shared/assets/icons/gift-box-benefits.svg";
import DashboardHeader from "../../../Shared/layouts/DashboardHeader";
import Button from "../../../Shared/Button";
import StatCards from "../StatCards";
import Checklist from "../../../components/Checklist";
import Note from "../../../components/Note";

const NotificationPage = () => {
  const notifications = [
    {
      id: "note-1",
      title: "Appointment Reminder",
      message: "Your appointment with Alex Johnson is tomorrow at 10:00 AM.",
      time: "2 hours ago",
      icon: calendarIcon,
      unread: true,
      category: "Appointments",
    },
    {
      id: "note-2",
      title: "Special Offer",
      message: "Get 20% off all spa treatments this week. Book now!",
      time: "1 day ago",
      icon: giftIcon,
      unread: true,
      category: "Offers",
    },
    {
      id: "note-3",
      title: "Rate Your Experience",
      message: "How was your recent visit? Share your feedback with us.",
      time: "3 days ago",
      icon: bellIcon,
      unread: false,
      category: "Feedback",
    },
    {
      id: "note-4",
      title: "Booking Confirmed",
      message:
        "Your appointment for Facial Treatment on Feb 15 at 2:00 PM is confirmed.",
      time: "5 days ago",
      icon: calendarIcon,
      unread: false,
      category: "Appointments",
    },
    {
      id: "note-5",
      title: "Payment Due",
      message: "Your invoice for Relax Massage is unpaid. Complete payment.",
      time: "6 days ago",
      icon: creditCardIcon,
      unread: false,
      category: "Bill Not Paid",
    },
  ];

  const unreadCount = notifications.filter((item) => item.unread).length;
  const filterTabs = [
    { key: "All", label: "All" },
    { key: "Appointments", label: "Appointments" },
    { key: "Bill Not Paid", label: "Bill Not Paid" },
  ];
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

  const channels = [
    { id: "email", label: "Email Notifications", enabled: true },
    { id: "sms", label: "SMS Notifications", enabled: false },
    { id: "push", label: "Push Notifications", enabled: true },
  ];

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

  const deliveryChecklist = [
    { label: "Quiet Hours", detail: "10 PM - 8 AM" },
    { label: "Reminders", detail: "24h before" },
    { label: "Digest", detail: "Weekly" },
  ];

  return (
    <section className="flex h-full flex-col">
      {/* <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-[#e9e1d8] px-4 py-1 text-xs uppercase tracking-widest text-[#5f544b]">
            Notifications
          </span>
          <h1 className="text-2xl font-semibold tracking-wide sm:text-3xl">
            Notifications
          </h1>
          <p className="text-sm text-[#5f544b]">
            You have {unreadCount} unread notifications.
          </p>
        </div>
        <button className="border-2 border-[#2d2620] px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]">
          Mark all as read
        </button>
      </header> */}
      <DashboardHeader
        eyebrow={"Notifications"}
        title={"Notifications"}
        description={`You have ${unreadCount} unread notifications.`}
      >
        <Button onClick={() => {}} variant="primary">
          Mark all as read
        </Button>
      </DashboardHeader>

      <StatCards stats={notificationStats} lgGridCols={3} />

      <div className="mt-5 grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="relative flex min-h-0 flex-1 flex-col border-2 border-[#2d2620]/20 bg-white/90 p-4 sm:p-5">
            <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-[#2d2620]/5"></div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Notifications Feed</h2>
                <p className="text-sm text-[#5f544b]">
                  Stay on top of your activity, offers, and appointment updates.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9] px-3 py-1 text-[0.65rem] tracking-widest text-[#2d2620] uppercase">
                  {filteredNotifications.length} updates
                </span>
                <span className="rounded-full border-2 border-[#2d2620]/30 bg-white px-3 py-1 text-[0.65rem] tracking-widest text-[#2d2620] uppercase">
                  {unreadCount} unread
                </span>
              </div>
            </div>

            <div className="mt-3 grid w-full grid-cols-1 overflow-hidden border-2 border-[#2d2620]/20 text-xs tracking-widest uppercase sm:grid-cols-3">
              {filterTabs.map((tab, index) => {
                const isActive = tab.key === activeFilter;
                const isLast = index === filterTabs.length - 1;
                const count = filterCounts[tab.key] ?? 0;
                return (
                  <Button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    variant="custom"
                    unstyled
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-center transition ${
                      isActive ? "bg-[#f3efe9]" : "bg-white"
                    } ${
                      !isLast
                        ? "border-b-2 border-[#2d2620]/20 sm:border-r-2 sm:border-b-0"
                        : ""
                    }`}
                    aria-pressed={isActive}
                  >
                    <span>{tab.label}</span>
                    <span className="rounded-full border border-[#2d2620]/40 px-2 py-0.5 text-[0.65rem]">
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col">
              <div className="scrollbar-hidden flex-1 space-y-3 overflow-y-auto bg-white/80">
                {filteredNotifications.length === 0 ? (
                  <FeedEmptyState message="You are all caught up. New notifications will appear here." />
                ) : activeFilter === "All" ? (
                  <>
                    <FeedSectionHeader
                      label="Unread"
                      count={unreadNotifications.length}
                    />
                    {unreadNotifications.length > 0 ? (
                      unreadNotifications.map((item) => (
                        <NotificationRow key={item.id} notification={item} />
                      ))
                    ) : (
                      <FeedEmptyState message="No unread notifications right now." />
                    )}

                    <FeedSectionHeader
                      label="Earlier"
                      count={readNotifications.length}
                    />
                    {readNotifications.length > 0 ? (
                      readNotifications.map((item) => (
                        <NotificationRow key={item.id} notification={item} />
                      ))
                    ) : (
                      <FeedEmptyState message="No earlier notifications yet." />
                    )}
                  </>
                ) : (
                  filteredNotifications.map((item) => (
                    <NotificationRow key={item.id} notification={item} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-3">
          <div className="border-2 border-[#2d2620]/20 bg-white/90 p-4 sm:p-5">
            <div>
              <h2 className="text-lg font-semibold">
                Notification Preferences
              </h2>
              <p className="text-sm text-[#5f544b]">
                Choose which updates you want to receive.
              </p>
            </div>
            <div className="mt-4 space-y-4">
              {preferences.map((item, index) => (
                <PreferenceRow
                  key={item.title}
                  item={item}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>

            <div className="mt-4 border-t-2 border-[#2d2620]/10 pt-4">
              <h3 className="text-sm font-semibold">Notification Channels</h3>
              <p className="text-xs text-[#5f544b]">
                Select how you want to be notified.
              </p>
              <div className="mt-3 space-y-2 text-sm">
                {channels.map((channel) => (
                  <label
                    key={channel.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={channel.enabled}
                      className="h-4 w-4 accent-[#2d2620]"
                    />
                    {channel.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Checklist title="Delivery Plan" items={deliveryChecklist} />
          <Note
            title={"Payment Alerts"}
            primaryText={"Never miss a receipt or refund update."}
            secondaryText={
              "Enable payment notifications for instant confirmations."
            }
          />
        </aside>
      </div>
    </section>
  );
};

const NotificationRow = ({ notification }) => {
  const rowTone = notification.unread
    ? "border-[#2d2620]/50 bg-[#f3efe9]/80"
    : "border-[#2d2620]/20 bg-white";
  const rowAccent = notification.unread ? "border-l-4 border-l-[#2d2620]" : "";
  return (
    <div
      className={`flex items-start justify-between gap-3 border-2 px-3 py-3 transition hover:bg-[#f3efe9]/60 ${rowTone} ${rowAccent}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2d2620]/20 bg-[#f3efe9]">
          <img src={notification.icon} alt="" className="h-4 w-4 opacity-70" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{notification.title}</p>
          <p className="text-xs leading-relaxed text-[#5f544b]">
            {notification.message}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.65rem] tracking-widest text-[#5f544b] uppercase">
            <span>{notification.time}</span>
            <span className="rounded-full border border-[#2d2620]/30 bg-white px-2 py-0.5 text-[#2d2620]">
              {notification.category}
            </span>
          </div>
        </div>
      </div>
      <div className="shrink-0">
        {notification.unread ? (
          <span className="inline-flex items-center rounded-full border-2 border-[#2d2620] bg-[#f3efe9] px-2 py-1 text-[0.6rem] tracking-widest text-[#2d2620] uppercase">
            Unread
          </span>
        ) : (
          <button className="inline-flex items-center rounded-full border-2 border-[#2d2620]/40 px-2 py-1 text-[0.6rem] tracking-widest text-[#2d2620] uppercase transition hover:border-[#2d2620] hover:bg-[#2d2620] hover:text-[#f3efe9]">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const FeedSectionHeader = ({ label, count }) => {
  return (
    <div className="flex items-center justify-between border-2 border-[#2d2620]/10 bg-white/70 px-3 py-2 text-[0.65rem] tracking-widest text-[#5f544b] uppercase">
      <span>{label}</span>
      <span className="rounded-full border border-[#2d2620]/30 bg-[#f3efe9] px-2 py-0.5 text-[#2d2620]">
        {count}
      </span>
    </div>
  );
};

const FeedEmptyState = ({ message }) => {
  return (
    <div className="border-2 border-dashed border-[#2d2620]/20 bg-[#f7f2ec]/70 px-3 py-4 text-center text-xs text-[#5f544b]">
      {message}
    </div>
  );
};

const PreferenceRow = ({ item, onToggle }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">{item.title}</p>
        <p className="text-xs text-[#5f544b]">{item.description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-6 w-11 items-center rounded-full border-2 px-1 transition ${
          item.enabled
            ? "border-[#2d2620] bg-[#2d2620]"
            : "border-[#2d2620]/40 bg-white"
        }`}
        aria-pressed={item.enabled}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition ${
            item.enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationPage;
// naxt day mache style NotificationPage and same boader apply all panel border-2 border-[#2d2620]/20
