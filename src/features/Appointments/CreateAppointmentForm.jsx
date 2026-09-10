import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import Button from "../../Shared/Button.jsx";
import Icon from "../../Shared/ui/Icon.jsx";
import SearchableSelectBox from "../../Shared/ui/SearchableSelectBox.jsx";
import ServiceSearchInput from "../../Shared/ui/ServiceSearchInput.jsx";
import { formatNumber } from "../../utils/appointmentUtils.js";

function CreateAppointmentForm({
  handleCancelForm,
  handleSubmitAppointment,
  formState,
  setFormState,
  clients,
  staffMembers,
  services,
  serviceSearchQuery,
  setServiceSearchQuery,
  staffSearchValue,
  handleToggleService,
  filteredServices,
  dateOptions,
  formTimeSlots,
  isSaving,
  saveError,
  saveSuccess,
  isAppointmentTableReady,
  STATUS_OPTIONS,
  handleStaffSearchChange,
  handleSelectStatusOption,
  handleSelectStaffOption,
  handleSelectDate,
  selectedServices,
  totalPrice,
  totalDuration,
  displayCurrencyCode,
  canSaveAppointment,
  staffSelectOptions,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientPhone: formState.clientPhone,
      clientEmail: formState.clientEmail,
      notes: formState.notes,
      clientName: formState.clientName,
    },
  });
  function onSubmitAppointment(data) {
    const appointmentPayload = {
      ...data,
      clientId: formState.clientId || null,
      status: formState.status,
      staffId: formState.staffId,
      serviceIds: formState.serviceIds,
      services: selectedServices,
      appointmentDate: formState.appointmentDate,
      appointmentTime: formState.appointmentTime,
    };

    console.log("Appointment Payload:", appointmentPayload);
    console.log("Appointment date:", data);
    handleSubmitAppointment(appointmentPayload);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleCancelForm}
      />

      {/* Modal Panel - larger size with header and close button */}
      <div className="border-ink/20 relative z-10 flex max-h-[95vh] w-full max-w-6xl flex-col overflow-y-auto border-2 bg-white sm:mx-4 sm:max-h-[92vh]">
        {/* Top accent bar */}
        <div className="bg-ink h-1 w-full" />

        {/* Header with Close Button */}
        <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
          <div>
            <p className="text-ink text-base leading-tight font-semibold">
              Add New Appointment
            </p>
          </div>

          <button
            onClick={handleCancelForm}
            className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {/* ///////////////////////////////////////////////////////// */}
        {/* Form Content */}
        <div className="overflow-y-auto p-4 sm:p-5">
          <form
            onSubmit={handleSubmit(onSubmitAppointment)}
            className="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Client Name *
                <SearchableSelectBox
                  value={formState.clientName}
                  onValueChange={(val) => {
                    const textOnlyName = val.replace(/[^a-zA-Z\s'-]/g, "");
                    setFormState((prev) => ({
                      ...prev,
                      clientName: textOnlyName,
                      clientId: "",
                    }));
                    setValue("clientName", textOnlyName, {
                      shouldValidate: true,
                    });
                  }}
                  options={clients.map((c) => ({
                    value: c.id,
                    label: c.full_name,
                  }))}
                  selectedValue={formState.clientId}
                  onOptionSelect={(option) => {
                    const client = clients.find((c) => c.id === option.value);
                    if (!client) return;
                    setFormState((prev) => ({
                      ...prev,
                      clientId: client.id,
                      clientName: client.full_name,
                      clientPhone: client.phone ?? prev.clientPhone,
                      clientEmail: client.email ?? prev.clientEmail,
                    }));
                    setValue("clientPhone", client.phone ?? "");
                    setValue("clientEmail", client.email ?? "");
                    setValue("clientName", client.full_name, {
                      shouldValidate: true,
                    });
                  }}
                  placeholder="Search existing client or type name"
                  noOptionsText="No clients found"
                  className="mt-2"
                />
                <input
                  type="hidden"
                  {...register("clientName", {
                    required: "Client name is required",
                  })}
                />
                {errors.clientName && (
                  <p className="text-danger mt-1 text-xs">
                    {errors.clientName.message}
                  </p>
                )}
                {formState.clientId && (
                  <p className="mt-1 text-[0.65rem] tracking-widest text-green-600 uppercase">
                    ✓ Linked to existing client profile
                  </p>
                )}
                {!formState.clientId && formState.clientName && (
                  <p className="mt-1 text-[0.65rem] tracking-widest text-amber-600 uppercase">
                    New client profile will be created automatically
                  </p>
                )}
              </label>
              {/* // that same use login page */}
              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Phone
                <input
                  name="clientPhone"
                  {...register("clientPhone", {
                    validate: (value) => {
                      if (!value) return true;
                      if (!value.trim().startsWith("+")) {
                        return "Use the full international format, e.g. +44 1234 567890";
                      }
                      return (
                        isValidPhoneNumber(value) ||
                        "Enter a valid international phone number"
                      );
                    },
                    required: "Client Phone Number is required",
                  })}
                  type="tel"
                  placeholder="+44 1234 567890"
                  className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                />
                {errors.clientPhone && (
                  <p className="text-danger mt-1 text-xs">
                    {errors.clientPhone.message}
                  </p>
                )}
              </label>

              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Email
                <input
                  name="clientEmail"
                  {...register("clientEmail", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                    required: "Client Email is required",
                  })}
                  type="email"
                  placeholder="client@email.com"
                  className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                />
                {errors.clientEmail && (
                  <p className="text-danger mt-1 text-xs">
                    {errors.clientEmail.message}
                  </p>
                )}
              </label>

              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Status
                <SearchableSelectBox
                  value={formState.status}
                  options={STATUS_OPTIONS}
                  selectedValue={formState.status}
                  onOptionSelect={handleSelectStatusOption}
                  placeholder="Select status"
                  searchable={false}
                  className="mt-2"
                />
              </label>

              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Staff *
                <SearchableSelectBox
                  value={staffSearchValue}
                  onValueChange={handleStaffSearchChange}
                  options={staffSelectOptions}
                  selectedValue={formState.staffId}
                  onOptionSelect={handleSelectStaffOption}
                  placeholder="Search and select staff"
                  required
                  noOptionsText="No staff found"
                  className="mt-2"
                />
              </label>

              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Search Services
                <ServiceSearchInput
                  value={serviceSearchQuery}
                  onChange={(event) =>
                    setServiceSearchQuery(event.target.value)
                  }
                  aria-label="Search services"
                  className="border-ink/20 text-ink focus:border-ink mt-2 w-full bg-white px-3 py-2 text-sm tracking-normal normal-case placeholder:text-[#5f544b]/70 sm:px-3 sm:text-sm"
                />
              </label>
            </div>

            {/* Services Selection with Cards */}
            <div>
              <p className="text-ink-muted mb-3 text-xs tracking-widest uppercase">
                Select Services * (Choose one or more)
              </p>
              {services.length > 0 ? (
                filteredServices.length > 0 ? (
                  <div className="scrollbar-hidden flex gap-3 overflow-x-auto pb-2">
                    {filteredServices.map((service) => {
                      const isSelected = formState.serviceIds.includes(
                        String(service.id),
                      );
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleToggleService(service.id)}
                          className={`flex min-w-[150px] items-center gap-2 border-2 p-2 text-left transition sm:min-w-[175px] sm:p-2.5 ${
                            isSelected
                              ? "border-ink bg-cream"
                              : "border-ink/30 hover:border-ink/50 bg-white"
                          }`}
                        >
                          <div className="border-ink/30 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-white">
                            <Icon
                              name={service.iconName}
                              size={15}
                              className="text-ink/70"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold sm:text-sm">
                              {service.title}
                            </p>
                            <p className="text-ink-muted mt-0.5 text-[0.6rem] tracking-widest uppercase">
                              {service.priceLabel}
                            </p>
                          </div>
                          {isSelected && (
                            <span
                              className="bg-ink text-cream flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.6rem]"
                              aria-label="Selected"
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border-ink/30 bg-cream-soft text-ink-muted border-2 border-dashed p-4 text-center text-sm sm:p-6">
                    No services found. Try a different search.
                  </div>
                )
              ) : (
                <div className="border-ink/30 bg-cream-soft text-ink-muted border-2 border-dashed p-4 text-center text-sm sm:p-6">
                  No services available. Add services first.
                </div>
              )}
            </div>

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div className="border-ink/20 bg-cream grid gap-2 border-2 p-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
                    Services Selected
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedServices.length} service
                    {selectedServices.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
                    Total Price
                  </p>
                  <p className="text-sm font-semibold">
                    {displayCurrencyCode} {formatNumber(totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
                    Total Duration
                  </p>
                  <p className="text-sm font-semibold">{totalDuration} min</p>
                </div>
                <div>
                  <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
                    Selected Items
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedServices.map((service) => (
                      <span
                        key={service.id}
                        className="text-ink bg-ink/10 rounded px-2 py-1 text-[0.7rem] font-medium tracking-wider uppercase"
                      >
                        {service.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <p className="text-ink-muted mb-2 text-xs tracking-widest uppercase">
                Select Date *
              </p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
                {dateOptions.map((option) => {
                  const isSelected = option.value === formState.appointmentDate;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelectDate(option.value)}
                      className={`border-2 px-3 py-2 text-left text-xs tracking-widest uppercase transition ${
                        isSelected
                          ? "border-ink bg-cream"
                          : "border-ink/20 hover:border-ink/50 bg-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-ink-muted mb-2 text-xs tracking-widest uppercase">
                Select Time *
              </p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(95px,1fr))] gap-2">
                {formTimeSlots.map((slot) => {
                  const isSelected = slot === formState.appointmentTime;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setFormState((prev) => ({
                          ...prev,
                          appointmentTime: slot,
                        }))
                      }
                      className={`border-2 px-2 py-2 text-xs tracking-widest uppercase transition ${
                        isSelected
                          ? "border-ink bg-cream"
                          : "border-ink/20 hover:border-ink/50 bg-white"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="text-ink-muted block text-xs tracking-widest uppercase">
              Notes
              <textarea
                name="notes"
                {...register("notes")}
                rows={3}
                placeholder="Add extra details for this appointment"
                className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
              />
            </label>

            {services.length === 0 && (
              <div className="border-danger/40 bg-danger/10 text-danger border-2 p-3 text-sm">
                No active services found. Add services first.
              </div>
            )}

            {staffMembers.length === 0 && (
              <div className="border-danger/40 bg-danger/10 text-danger border-2 p-3 text-sm">
                No staff found. Add staff members first.
              </div>
            )}

            {dateOptions.length === 0 && (
              <div className="border-danger/40 bg-danger/10 text-danger border-2 p-3 text-sm">
                No open schedule found. Please set working hours first.
              </div>
            )}

            {!isAppointmentTableReady && (
              <div className="border-2 border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                Appointments table is missing. Saves will be local only until
                you create that table in Supabase.
              </div>
            )}

            {(saveError || saveSuccess) && (
              <div
                className={`border-2 p-3 text-sm ${
                  saveError
                    ? "border-danger/40 bg-danger/10 text-danger"
                    : "border-green-600/40 bg-green-600/10 text-green-700"
                }`}
              >
                {saveError || saveSuccess}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="submit"
                variant="primary"
                loading={isSaving}
                disabled={!canSaveAppointment}
              >
                Save Appointment
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
  );
}

export default CreateAppointmentForm;
