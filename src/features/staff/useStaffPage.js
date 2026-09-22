import { useState } from "react";
import { useOwnerId } from "../../globalHooks/useOwnerId";
import { confirmToast } from "../../Shared/lib/toast";
import { useStaff } from "./useStaff";
import { useDeleteStaff } from "./useDeleteStaff";

export function useStaffPage() {
  const {
    ownerId,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useOwnerId();
  const { staffMembers, isLoading: isStaffLoading, error } = useStaff(ownerId);
  const {
    deleteStaff,
    isDeleting,
    variables,
    error: deleteError,
  } = useDeleteStaff(ownerId);
  const [activeRole, setActiveRole] = useState("All");
  const [form, setForm] = useState(null);
  const roles = [
    "All",
    ...new Set(staffMembers.map((member) => member.role).filter(Boolean)),
  ];
  const selectedRole = roles.includes(activeRole) ? activeRole : "All";
  const filteredStaff =
    selectedRole === "All"
      ? staffMembers
      : staffMembers.filter((member) => member.role === selectedRole);
  const isLoading = isOwnerLoading || isStaffLoading;
  const closeForm = () => setForm(null);

  async function handleDeleteStaff(member) {
    if (isDeleting) return;
    const confirmed = await confirmToast({
      title: `Delete "${member.name}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete staff",
      cancelLabel: "Keep staff",
      confirmTone: "danger",
    });
    if (!confirmed) return;
    deleteStaff(member.id, {
      onSuccess: () =>
        setForm((current) =>
          current?.member?.id === member.id ? null : current,
        ),
    });
  }

  return {
    ownerId,
    staffMembers,
    filteredStaff,
    roles,
    selectedRole,
    setActiveRole,
    isLoading,
    loadError:
      ownerError?.message ||
      error?.message ||
      (!isLoading && !ownerId ? "Please sign in to load staff." : ""),
    actionError: deleteError?.message,
    showForm: Boolean(form),
    editingMember: form?.member,
    openCreateForm: () => setForm({ member: null }),
    closeForm,
    editStaff: (member) => setForm({ member }),
    handleDeleteStaff,
    deletingStaffId: isDeleting ? variables : null,
  };
}
