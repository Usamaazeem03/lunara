function SummaryPanal({
  selectedServices = [],
  
  totalPriceLabel,
}) {
  return (
    <div className="text-ink border bg-white/70 p-4 sm:p-5">
      <p className="text-ink/70 text-xs tracking-widest uppercase">
        Booking Summary
      </p>

      {selectedServices.length > 0 ? (
        <>
        
          {/* Full list */}
          <div className="grid grid-cols-3 gap-2">
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="bg-cream/70  w-fit flex flex-row  justify-between rounded-xl p-2 text-sm font-semibold"
              >
                <span>{service.title}</span>

              
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-ink/50 mt-3 text-sm">No services selected</p>
      )}

      <div className="text-ink/70 mt-3 space-y-2 text-[0.65rem] tracking-widest uppercase sm:text-xs">
       

        <div className="flex items-center justify-between">
          <span>Total</span>
          <span className="text-ink/80">{totalPriceLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default SummaryPanal;
