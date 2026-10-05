import { useTranslation } from "react-i18next";
import AppHeader from "../../AppLayout/AppHeader.jsx";
import Button from "../../Shared/Button.jsx";
import StaffCard from "./StaffCard";
import StaffStats from "./StaffStats";
import StaffFilter from "./StaffFilter";
import CreateStaffForm from "./CreateStaffForm";
import { useStaffPage } from "./useStaffPage";

export default function StaffPage() {
  const { t } = useTranslation();
  const {
    ownerId,
    staffMembers,
    filteredStaff,
    roles,
    selectedRole,
    setActiveRole,
    isLoading,
    loadError,
    actionError,
    showForm,
    editingMember,
    openCreateForm,
    closeForm,
    editStaff,
    handleDeleteStaff,
    deletingStaffId,
  } = useStaffPage();
  return (
    <section className="flex h-full flex-col">
      <AppHeader
        eyebrow={t("nav.staff")}
        title={t("staff.staffManagement")}
        description={t("staff.manageYourTeamMembersAndTheirSchedules")}
      >
        <Button
          disabled={!ownerId}
          variant="primary"
          onClick={showForm ? closeForm : openCreateForm}
          type="button"
        >
          {showForm ? t("common.close") : t("staff.addStaffMember")}
        </Button>
      </AppHeader>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center">
          <CreateStaffForm
            key={editingMember?.id ?? "new"}
            ownerId={ownerId}
            member={editingMember}
            onCloseForm={closeForm}
          />
        </div>
      )}

      <StaffStats staffMembers={staffMembers} />

      <div className="mt-5 flex flex-col gap-4">
        <StaffFilter
          roles={roles}
          selectedRole={selectedRole}
          onRoleChange={setActiveRole}
        />
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

        {isLoading && (
          <div className="border-ink/20 text-ink-muted border-2 bg-white/90 p-4 text-sm"> {t("staff.loadingStaffMembers")} </div>
        )}

        {!isLoading && !loadError && filteredStaff.length === 0 && (
          <div className="border-ink/30 bg-cream text-ink-muted border-2 border-dashed p-4 text-center text-sm"> {t("staff.noStaffMembersYetAddYourFirstTeamMemberAbove")} </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStaff.map((member) => (
            <StaffCard
              key={member.id}
              member={member}
              onEdit={editStaff}
              onDelete={handleDeleteStaff}
              isDeleting={deletingStaffId === member.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
