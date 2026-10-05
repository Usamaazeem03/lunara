import { useTranslation } from "react-i18next";
import { useOwnerId } from "../../globalHooks/useOwnerId";
import { useSchedule } from "./useSchedule";
import ScheduleForm from "./ScheduleForm";

export default function WorkingSchedulePage() {
  const { t } = useTranslation();
  const {
    ownerId,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useOwnerId();
  const { data, isLoading, error, refetch, isFetching } = useSchedule(ownerId);
  if (isOwnerLoading || isLoading)
    return (
      <p role="status" className="p-8 text-center"> {t("schedule.loadingWorkingHours")} </p>
    );
  if (ownerError || error || !ownerId)
    return (
      <div role="alert" className="text-danger border-danger/40 border-2 p-4">
        <p>
          {ownerError?.message ||
            error?.message ||
            t("schedule.pleaseSignInToLoadYourSchedule")}
        </p>
        {ownerId && (
          <button
            type="button"
            disabled={isFetching}
            onClick={() => refetch()}
            className="mt-3 underline"
          > {t("common.tryAgain")} </button>
        )}
      </div>
    );
  return <ScheduleForm key={ownerId} ownerId={ownerId} schedule={data} />;
}
