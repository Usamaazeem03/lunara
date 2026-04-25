import { useEffect, useState } from "react";

import clockIcon from "../../Shared/assets/icons/clock.svg";
import DashboardHeader from "../../Shared/layouts/DashboardHeader";
import Button from "../../Shared/Button";
import { supabase } from "../../Shared/lib/supabaseClient";
import { notify } from "../../Shared/lib/toast.jsx";

const DAYS_OF_WEEK = [
  { day_of_week: 0, day_name: "Sunday" },
  { day_of_week: 1, day_name: "Monday" },
  { day_of_week: 2, day_name: "Tuesday" },
  { day_of_week: 3, day_name: "Wednesday" },
  { day_of_week: 4, day_name: "Thursday" },
  { day_of_week: 5, day_name: "Friday" },
  { day_of_week: 6, day_name: "Saturday" },
];

const getDefaultWorkingHours = () => [
  {
    day_of_week: 0,
    day_name: "Sunday",
    is_open: false,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 1,
    day_name: "Monday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 2,
    day_name: "Tuesday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 3,
    day_name: "Wednesday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 4,
    day_name: "Thursday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 5,
    day_name: "Friday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 6,
    day_name: "Saturday",
    is_open: true,
    open_time: "10:00",
    close_time: "16:00",
  },
];

const WorkingSchedulePage = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    if (error) notify.error(error);
  }, [error]);

  useEffect(() => {
    const getOwnerId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setOwnerId(user.id);
      }
    };
    getOwnerId();
  }, []);

  // Fetch working hours from Supabase
  useEffect(() => {
    const fetchWorkingHours = async () => {
      if (!ownerId) return;

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("working_hours")
        .select("*")
        .eq("owner_id", ownerId)
        .order("day_of_week", { ascending: true });

      if (error) {
        setError(error.message);
        setWorkingHours(getDefaultWorkingHours());
      } else if (data && data.length > 0) {
        setWorkingHours(data);
      } else {
        setWorkingHours(getDefaultWorkingHours());
      }

      setLoading(false);
    };

    fetchWorkingHours();
  }, [ownerId]);

  const handleHoursChange = (dayOfWeek, field, value) => {
    setWorkingHours((prev) =>
      prev.map((day) =>
        day.day_of_week === dayOfWeek ? { ...day, [field]: value } : day,
      ),
    );
  };

  const saveWorkingHours = async () => {
    setSaving(true);
    setError("");

    try {
      // Delete only this owner's working hours
      await supabase.from("working_hours").delete().eq("owner_id", ownerId);

      const { error } = await supabase.from("working_hours").insert(
        workingHours.map((day) => ({
          day_of_week: day.day_of_week,
          day_name: day.day_name,
          is_open: day.is_open,
          open_time: day.open_time,
          close_time: day.close_time,
          owner_id: ownerId,
        })),
      );

      if (error) throw error;

      notify.success("Working hours saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Generate preview dates
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.getDay();
      const dayConfig = workingHours.find((d) => d.day_of_week === dayOfWeek);

      if (dayConfig?.is_open) {
        const month = date.toLocaleString("default", { month: "short" });
        const dayNum = date.getDate().toString().padStart(2, "0");

        dates.push({
          day: date.toLocaleString("default", { weekday: "long" }),
          date: `${month} ${dayNum}`,
        });
      }
    }

    return dates;
  };

  if (loading) {
    return <div className="p-8 text-center">Loading working hours...</div>;
  }

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Schedule"
        title="Working Schedule"
        description="Set your salon opening days and hours."
      >
        <Button variant="primary" onClick={saveWorkingHours} loading={saving}>
          Save Schedule
        </Button>
      </DashboardHeader>

      {error && (
        <div className="mb-4 border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
          {error}
        </div>
      )}

      <div className="border-ink/20 border-2 bg-white/90 p-4 sm:p-5">
        <div className="mb-6 flex items-center gap-3">
          <div className="border-ink/20 bg-cream flex h-11 w-11 items-center justify-center rounded-2xl border-2">
            <img src={clockIcon} alt="" className="h-5 w-5 opacity-70" />
          </div>
          <h2 className="text-lg font-semibold">Weekly Hours</h2>
        </div>

        <div className="space-y-4">
          {workingHours.map((day) => (
            <div
              key={day.day_of_week}
              className="border-ink/10 flex flex-wrap items-center justify-between gap-3 border-b pb-4 last:border-0"
            >
              <label className="flex min-w-[140px] items-center gap-3">
                <input
                  type="checkbox"
                  checked={day.is_open}
                  onChange={(e) =>
                    handleHoursChange(
                      day.day_of_week,
                      "is_open",
                      e.target.checked,
                    )
                  }
                  className="accent-ink h-4 w-4"
                />
                <span
                  className={`text-sm font-semibold ${!day.is_open ? "text-ink/50" : ""}`}
                >
                  {day.day_name}
                </span>
              </label>

              <div className="text-ink-muted flex items-center gap-2 text-xs tracking-widest uppercase">
                <span>From</span>
                <input
                  type="time"
                  value={day.open_time}
                  onChange={(e) =>
                    handleHoursChange(
                      day.day_of_week,
                      "open_time",
                      e.target.value,
                    )
                  }
                  disabled={!day.is_open}
                  className="border-ink/20 focus:border-ink rounded-lg border-2 bg-white px-3 py-1 text-xs focus:outline-none disabled:opacity-50"
                />
                <span>To</span>
                <input
                  type="time"
                  value={day.close_time}
                  onChange={(e) =>
                    handleHoursChange(
                      day.day_of_week,
                      "close_time",
                      e.target.value,
                    )
                  }
                  disabled={!day.is_open}
                  className="border-ink/20 focus:border-ink rounded-lg border-2 bg-white px-3 py-1 text-xs focus:outline-none disabled:opacity-50"
                />
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[0.65rem] tracking-widest uppercase ${
                  day.is_open
                    ? "border border-green-200 bg-green-100 text-green-700"
                    : "bg-ink/10 text-ink-muted border-ink/20 border"
                }`}
              >
                {day.is_open ? "Open" : "Closed"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() =>
              setWorkingHours((prev) =>
                prev.map((d) => ({ ...d, is_open: true })),
              )
            }
            className="border-ink/20 bg-cream hover:border-ink rounded-lg border-2 px-4 py-2 text-xs tracking-widest uppercase transition"
          >
            Open All
          </button>
          <button
            type="button"
            onClick={() =>
              setWorkingHours((prev) =>
                prev.map((d) => ({ ...d, is_open: false })),
              )
            }
            className="border-ink/20 bg-cream hover:border-ink rounded-lg border-2 px-4 py-2 text-xs tracking-widest uppercase transition"
          >
            Close All
          </button>
          <button
            type="button"
            onClick={() => setWorkingHours(getDefaultWorkingHours())}
            className="border-ink/20 bg-cream hover:border-ink rounded-lg border-2 px-4 py-2 text-xs tracking-widest uppercase transition"
          >
            Reset Default
          </button>
        </div>

        <div className="border-ink/10 mt-6 border-t-2 pt-4">
          <p className="text-ink-muted mb-3 text-xs tracking-widest uppercase">
            Preview: Available Booking Dates (Next 14 Days)
          </p>
          <div className="flex flex-wrap gap-2">
            {generateAvailableDates()
              .slice(0, 10)
              .map((date, idx) => (
                <span
                  key={idx}
                  className="rounded-full border-2 border-green-600/30 bg-green-50 px-3 py-1 text-xs text-green-800"
                >
                  {date.day} {date.date}
                </span>
              ))}
            {generateAvailableDates().length === 0 && (
              <span className="text-sm text-[#b0412e]">No available dates</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkingSchedulePage;
