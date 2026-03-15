function Note({
  title = "Need to Adjust?",
  primaryText = "Reschedule up to 24 hours before.",
  secondaryText = "Contact the front desk for last-minute changes.",
}) {
  return (
    <div className="border-2 border-dashed border-[#2d2620]/40 bg-[#f7f2ec] p-4 text-sm">
      <p className="text-xs uppercase tracking-widest text-[#5f544b]">
        {title}
      </p>
      <p className="mt-2 font-semibold">{primaryText}</p>
      <p className="text-xs text-[#5f544b]">{secondaryText}</p>
    </div>
  );
}

export default Note;
