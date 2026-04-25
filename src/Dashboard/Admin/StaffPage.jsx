import { useEffect, useMemo, useState } from "react";

import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import hairCareIcon from "../../Shared/assets/icons/hair-care.svg";
import DashboardHeader from "../../Shared/layouts/DashboardHeader";
import StatCards from "../Client/StatCards";
import Button from "../../Shared/Button";
import { supabase } from "../../Shared/lib/supabaseClient";
import Icon from "../../Shared/ui/Icon";
import { confirmToast, notify } from "../../Shared/lib/toast.jsx";

const STAFF_ROLES = [
  { key: "Senior Stylist", iconName: "scissors" },
  { key: "Barber", iconName: "razor" },
  { key: "Spa Specialist", iconName: "spa" },
  { key: "Nail Technician", iconName: "nail" },
  { key: "Receptionist", iconName: "phone" },
  { key: "Manager", iconName: "briefcase" },
];

const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// FIX: Ensure specialties is always an array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string")
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  if (value === null || value === undefined) return [];
  return [];
};

const mapStaffRow = (staff) => {
  return {
    id: staff.id,
    name: staff.name ?? "Unknown",
    role: staff.role ?? "Staff",
    phone: staff.phone ?? "",
    email: staff.email ?? "",
    schedule: staff.schedule ?? "Mon - Fri",
    isOnShift: staff.is_on_shift ?? false,
    rating: Number(staff.rating) || 0,
    appointments: Number(staff.appointments_count) || 0,
    // FIX: Always ensure array
    specialties: ensureArray(staff.specialties),
    createdAt: staff.created_at,
  };
};

const StaffPage = () => {
  const [staffRows, setStaffRows] = useState([]);
  const [activeRole, setActiveRole] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    schedule: "Mon - Fri",
    isOnShift: false,
    specialties: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [deletingStaffId, setDeletingStaffId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    if (loadError) notify.error(loadError);
  }, [loadError]);

  useEffect(() => {
    if (saveError) notify.error(saveError);
  }, [saveError]);

  useEffect(() => {
    if (saveSuccess) notify.success(saveSuccess);
  }, [saveSuccess]);

  useEffect(() => {
    if (actionError) notify.error(actionError);
  }, [actionError]);

  useEffect(() => {
    if (actionSuccess) notify.success(actionSuccess);
  }, [actionSuccess]);

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

  useEffect(() => {
    let isMounted = true;

    const loadStaff = async () => {
      if (!ownerId) return;

      setIsLoading(true);
      setLoadError("");
      try {
        const { data, error } = await supabase
          .from("staff")
          .select(
            "id, name, phone, role, schedule, is_on_shift, created_at, specialties, rating, appointments_count, owner_id",
          )
          .eq("owner_id", ownerId)
          .order("name", { ascending: true });

        if (!isMounted) return;

        if (error) {
          console.error("Supabase error:", error);
          setLoadError(error.message || "Unable to load staff members.");
          setStaffRows([]);
        } else {
          setStaffRows(data ?? []);
        }
      } catch (err) {
        console.error("Load error:", err);
        setLoadError("Network error. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadStaff();

    return () => {
      isMounted = false;
    };
  }, [ownerId]);

  const staffMembers = useMemo(() => staffRows.map(mapStaffRow), [staffRows]);

  const roles = useMemo(() => {
    const uniqueRoles = new Set(
      staffMembers.map((s) => s.role).filter(Boolean),
    );
    return ["All", ...Array.from(uniqueRoles)];
  }, [staffMembers]);

  const selectedRole = roles.includes(activeRole) ? activeRole : "All";

  const filteredStaff = useMemo(() => {
    if (selectedRole === "All") return staffMembers;
    return staffMembers.filter((s) => s.role === selectedRole);
  }, [selectedRole, staffMembers]);

  const stats = useMemo(() => {
    const total = staffMembers.length;
    const activeToday = staffMembers.filter((s) => s.isOnShift).length;
    const avgRating =
      total > 0
        ? staffMembers.reduce((sum, s) => sum + s.rating, 0) / total
        : 0;
    const totalAppointments = staffMembers.reduce(
      (sum, s) => sum + s.appointments,
      0,
    );

    return [
      {
        title: "Total Staff",
        value: total.toString(),
        subtitle: "Team members",
        icon: giftIcon,
      },
      {
        title: "Active Today",
        value: activeToday.toString(),
        subtitle: "On shift",
        icon: calendarIcon,
      },
      {
        title: "Avg. Rating",
        value: avgRating > 0 ? avgRating.toFixed(1) : "0.0",
        subtitle: "Client feedback",
        icon: clockIcon,
      },
      {
        title: "Total Appointments",
        value: totalAppointments.toString(),
        subtitle: "All time",
        icon: hairCareIcon,
      },
    ];
  }, [staffMembers]);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormState({
      name: "",
      phone: "",
      email: "",
      role: "",
      schedule: "Mon - Fri",
      isOnShift: false,
      specialties: "",
    });
    setSaveError("");
    setSaveSuccess("");
  };

  const handleOpenAddForm = () => {
    setEditingStaffId(null);
    resetForm();
    setShowForm(true);
    setActionError("");
    setActionSuccess("");
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStaffId(null);
    resetForm();
  };

  const startEditingStaff = (member) => {
    setEditingStaffId(member.id);
    setFormState({
      name: member.name ?? "",
      phone: member.phone ?? "",
      email: member.email ?? "",
      role: member.role ?? "",
      schedule: member.schedule ?? "Mon - Fri",
      isOnShift: member.isOnShift ?? false,
      // FIX: Convert array back to string for form
      specialties: Array.isArray(member.specialties)
        ? member.specialties.join(", ")
        : "",
    });
    setShowForm(true);
    setSaveError("");
    setSaveSuccess("");
    setActionError("");
    setActionSuccess("");
  };

  const isEditing = Boolean(editingStaffId);

  const isFormValid =
    formState.name.trim() && formState.role.trim() && formState.phone.trim();

  const handleSubmitStaff = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isFormValid) return;

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess("");
    setActionError("");
    setActionSuccess("");

    // FIX: Convert specialties string to array for Supabase
    const specialtiesArray = formState.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // ✅ Generate UUID for staff_id
    // const generateStaffId = () => {
    //   return crypto.randomUUID();
    // };

    const payload = {
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      email: formState.email.trim() || null,
      role: formState.role.trim(),
      schedule: formState.schedule.trim(),
      is_on_shift: formState.isOnShift,
      specialties: specialtiesArray,
      owner_id: ownerId,
    };

    try {
      if (isEditing) {
        const { data, error } = await supabase
          .from("staff")
          .update(payload)
          .eq("id", editingStaffId)
          .select(
            "id, name, phone, role, schedule, is_on_shift, created_at, specialties, rating, appointments_count, owner_id",
          )
          .single();

        if (error) throw error;

        if (data) {
          setStaffRows((prev) =>
            prev.map((row) => (row.id === data.id ? data : row)),
          );
        }
        setSaveSuccess("Staff member updated successfully.");
        setTimeout(() => {
          setShowForm(false);
          setEditingStaffId(null);
          resetForm();
        }, 1500);
      } else {
        const { data, error } = await supabase
          .from("staff")
          .insert([payload])
          .select(
            "id, name, phone, role, schedule, is_on_shift, created_at, specialties, rating, appointments_count, owner_id",
          )
          .single();

        if (error) throw error;

        if (data) {
          setStaffRows((prev) => [data, ...prev]);
        }
        setSaveSuccess("Staff member added successfully!");
        setTimeout(() => {
          setShowForm(false);
          resetForm();
        }, 1500);
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveError(error.message || "Unable to save staff member.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStaff = async (member) => {
    const confirmed = await confirmToast({
      title: `Delete "${member.name}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete staff",
      cancelLabel: "Keep staff",
      confirmTone: "danger",
    });
    if (!confirmed) return;

    setDeletingStaffId(member.id);
    setActionError("");
    setActionSuccess("");

    try {
      const { error } = await supabase
        .from("staff")
        .delete()
        .eq("id", member.id);

      if (error) throw error;

      setStaffRows((prev) => prev.filter((row) => row.id !== member.id));
      setActionSuccess("Staff member deleted successfully.");

      if (editingStaffId === member.id) {
        handleCancelForm();
      }
    } catch (error) {
      console.error("Delete error:", error);
      setActionError(error.message || "Unable to delete staff member.");
    } finally {
      setDeletingStaffId(null);
    }
  };

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Staff"
        title="Staff Management"
        description="Manage your team members and their schedules."
      >
        <Button
          variant="primary"
          onClick={showForm ? handleCancelForm : handleOpenAddForm}
          type="button"
        >
          {showForm ? "Close" : "Add Staff Member"}
        </Button>
      </DashboardHeader>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCancelForm}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="staff-form-title"
            className="border-ink/20 relative z-10 flex max-h-[95vh] w-full max-w-6xl flex-col overflow-y-auto border-2 bg-white sm:mx-4 sm:max-h-[92vh]"
          >
            <div className="bg-ink h-1 w-full" />

            <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
              <div>
                <p
                  id="staff-form-title"
                  className="text-ink text-base leading-tight font-semibold"
                >
                  {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelForm}
                className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
                aria-label="Close"
              >
                X
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5">
              <form onSubmit={handleSubmitStaff} className="space-y-4">
                <p className="text-ink-muted text-xs tracking-widest uppercase">
                  {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Full Name *
                    <input
                      name="name"
                      value={formState.name}
                      onChange={handleFormChange}
                      type="text"
                      placeholder="e.g. Jessica Martinez"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Role *
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {STAFF_ROLES.map((option) => {
                        const isSelected = formState.role === option.key;
                        return (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() =>
                              setFormState((prev) => ({
                                ...prev,
                                role: option.key,
                              }))
                            }
                            aria-pressed={isSelected}
                            className={`flex items-center gap-2 border-2 px-3 py-2 text-[0.65rem] tracking-widest uppercase transition ${
                              isSelected
                                ? "border-ink bg-cream text-ink"
                                : "border-ink/20 text-ink-muted hover:border-ink bg-white"
                            }`}
                          >
                            <Icon
                              name={option.iconName}
                              size={16}
                              className="text-ink/70"
                            />
                            {option.key}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      name="role"
                      value={formState.role}
                      onChange={handleFormChange}
                      type="text"
                      placeholder="Or type a custom role"
                      className="border-ink/20 text-ink focus:border-ink mt-3 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Phone *
                    <input
                      name="phone"
                      value={formState.phone}
                      onChange={handleFormChange}
                      type="tel"
                      placeholder="(555) 111-2222"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Email
                    <input
                      name="email"
                      value={formState.email}
                      onChange={handleFormChange}
                      type="email"
                      placeholder="name@salonpro.com"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Schedule
                    <input
                      name="schedule"
                      value={formState.schedule}
                      onChange={handleFormChange}
                      type="text"
                      placeholder="Mon - Fri"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase sm:col-span-2">
                    Specialties (comma separated)
                    <input
                      name="specialties"
                      value={formState.specialties}
                      onChange={handleFormChange}
                      type="text"
                      placeholder="Hair Coloring, Hair Styling, Hair Treatment"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>

                  <label className="text-ink-muted flex items-center gap-2 text-xs tracking-widest uppercase">
                    <input
                      name="isOnShift"
                      checked={formState.isOnShift}
                      onChange={handleFormChange}
                      type="checkbox"
                      className="border-ink/40 h-4 w-4 border-2"
                    />
                    Currently On Shift
                  </label>
                </div>

                {(saveError || saveSuccess) && (
                  <div
                    className={`mt-4 border-2 p-3 text-sm ${
                      saveError
                        ? "border-[#b0412e]/40 bg-[#b0412e]/10 text-[#b0412e]"
                        : "border-green-600/40 bg-green-600/10 text-green-700"
                    }`}
                  >
                    {saveError || saveSuccess}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSaving}
                    disabled={!isFormValid || isSaving}
                  >
                    {isEditing ? "Update Staff" : "Save Staff"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelForm}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <StatCards stats={stats} lgGridCols={4} />

      <div className="mt-5 flex flex-col gap-4">
        <div className="border-ink/20 border-2 bg-white/90 p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => {
              const isActive = role === selectedRole;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={`rounded-full border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${
                    isActive
                      ? "border-ink bg-cream text-ink"
                      : "border-ink/20 text-ink-muted hover:border-ink bg-white"
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {loadError && (
          <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
            {loadError}
          </div>
        )}

        {actionError && (
          <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
            {actionError}
          </div>
        )}

        {actionSuccess && (
          <div className="border-ink/20 bg-cream text-ink border-2 p-3 text-sm">
            {actionSuccess}
          </div>
        )}

        {isLoading && (
          <div className="border-ink/20 text-ink-muted border-2 bg-white/90 p-4 text-sm">
            Loading staff members...
          </div>
        )}

        {!isLoading && filteredStaff.length === 0 && (
          <div className="border-ink/30 bg-cream text-ink-muted border-2 border-dashed p-4 text-center text-sm">
            No staff members yet. Add your first team member above.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStaff.map((member) => (
            <StaffCard
              key={member.id}
              member={member}
              onEdit={startEditingStaff}
              onDelete={handleDeleteStaff}
              isDeleting={deletingStaffId === member.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const StaffCard = ({ member, onEdit, onDelete, isDeleting }) => {
  const initials = getInitials(member.name);

  return (
    <article className="border-ink/20 relative flex h-full flex-col border-2 bg-white/90 p-4 sm:p-5">
      <div className="bg-ink/5 absolute -top-8 -right-8 h-20 w-20 rounded-full"></div>
      <div className="flex items-start justify-between gap-3">
        <div className="border-ink/20 bg-cream text-ink-muted flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-semibold uppercase">
          {initials}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="border-ink/20 bg-cream text-ink-muted rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase">
            {member.role}
          </span>
          {member.isOnShift && (
            <span className="rounded-full border-2 border-green-600/40 bg-green-600/10 px-3 py-1 text-[0.6rem] tracking-widest text-green-700 uppercase">
              On Shift
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{member.name}</h3>
      </div>

      <div className="border-ink/10 bg-cream/60 mt-4 grid grid-cols-2 gap-3 border-2 p-3 text-center">
        <div>
          <p className="text-base font-semibold">
            {member.rating > 0 ? member.rating.toFixed(1) : "N/A"}
          </p>
          <p className="text-ink-muted text-xs tracking-widest uppercase">
            Rating
          </p>
        </div>
        <div>
          <p className="text-base font-semibold">{member.appointments}</p>
          <p className="text-ink-muted text-xs tracking-widest uppercase">
            Appointments
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <InfoRow label="Phone" value={member.phone} iconName="phone" />
        <InfoRow label="Email" value={member.email || "N/A"} iconName="mail" />
        <InfoRow label="Schedule" value={member.schedule} iconName="clock" />
      </div>

      {/* FIX: Safe array check with optional chaining */}
      {member.specialties?.length > 0 && (
        <div className="mt-4">
          <p className="text-ink-muted text-xs tracking-widest uppercase">
            Specialties
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {member.specialties.map((specialty) => (
              <span
                key={specialty}
                className="border-ink/20 bg-cream text-ink-muted rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(member)}
          disabled={isDeleting}
          className={`border-ink/20 bg-cream hover:border-ink flex-1 border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${
            isDeleting ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(member)}
          disabled={isDeleting}
          className={`flex-1 border-2 border-[#b0412e]/40 bg-[#b0412e]/10 px-4 py-2 text-xs tracking-widest text-[#b0412e] uppercase transition hover:border-[#b0412e] ${
            isDeleting ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {isDeleting ? "Deleting..." : "Remove"}
        </button>
      </div>
    </article>
  );
};

const InfoRow = ({ label, value, iconName }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
        <Icon name={iconName} size={16} className="text-ink/70" />
      </div>
      <div>
        <p className="text-ink-muted text-xs tracking-widest uppercase">
          {label}
        </p>
        <p className="text-ink text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StaffPage;
