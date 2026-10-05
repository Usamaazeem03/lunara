import assert from "node:assert/strict";
import test from "node:test";
import {
  getAppointmentStats,
  getMonthlyRevenue,
} from "./appointmentStatsUtils.js";

const now = new Date(2026, 8, 19, 12);
const visit = (status, price, date = "2026-09-19") => ({
  status,
  price,
  appointment_date: date,
});

test("only completed visits earn revenue; pending and confirmed amounts stay separate", () => {
  const visits = [
    visit("Completed", 100),
    visit(" completed ", "GBP 25.50"),
    visit("Pending", 40),
    visit("Confirmed", 60),
    visit("Cancelled", 500),
    visit("No Show", 200),
  ];
  const stats = getAppointmentStats(visits, now);
  assert.equal(stats.todayRevenue, 125.5);
  assert.equal(stats.monthRevenue, 125.5);
  assert.equal(stats.pendingAmount, 100);
  assert.equal(stats.todayCount, 6);
  assert.equal(getMonthlyRevenue(visits, 2026)[8].revenue, 125.5);
});

test("weekly revenue includes earlier completed visits in the calendar week", () => {
  const visits = [
    visit("Completed", 10, "2026-09-14"),
    visit("Completed", 20, "2026-09-13"),
    visit("Completed", 30, "2026-09-20"),
    visit("Completed", 40, "2026-09-21"),
    visit("Completed", 50, "2026-08-31"),
    visit("Completed", 60, "2025-09-19"),
    visit("Completed", "invalid"),
  ];
  const stats = getAppointmentStats(visits, now);
  assert.equal(stats.weekRevenue, 40);
  assert.equal(stats.monthRevenue, 100);
  assert.equal(stats.todayRevenue, 0);
  assert.equal(getMonthlyRevenue(visits, 2026)[8].revenue, 100);
});

test("completing a booking moves its amount out of pending and into revenue", () => {
  const pending = getAppointmentStats([visit("Confirmed", 75)], now);
  const completed = getAppointmentStats([visit("Completed", 75)], now);
  assert.equal(pending.pendingAmount, 75);
  assert.equal(pending.todayRevenue, 0);
  assert.equal(completed.pendingAmount, 0);
  assert.equal(completed.todayRevenue, 75);
  assert.equal(getAppointmentStats([], now).monthRevenue, 0);
});
