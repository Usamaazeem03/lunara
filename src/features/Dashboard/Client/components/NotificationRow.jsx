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

export default NotificationRow;
