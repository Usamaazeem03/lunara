import Profile from "./Profile";

function Branding({
  profileImg,
  portalLabel,
  brand,

  profileAlt,
  onProfileClick,
}) {
  return (
    <div className="flex items-center gap-3">
      <Profile
        onProfileClick={onProfileClick}
        profileImg={profileImg}
        profileAlt={profileAlt}
      />
      {/* {onProfileClick ? (
        <button
          type="button"
          onClick={onProfileClick}
          aria-label="Open profile"
          className={`${avatarClasses} hover:border-ink/40 focus-visible:outline-ink/40 transition hover:scale-[1.02] focus-visible:outline-2`}
        >
          <img
            src={profileImg}
            alt={profileAlt}
            className="h-full w-full object-cover"
          />
        </button>
      ) : (
        <div className={avatarClasses}>
          <img
            src={profileImg}
            alt={profileAlt}
            className="h-full w-full object-cover"
          />
        </div>
      )} */}
      <div>
        <p className="text-ink-muted text-xs tracking-widest uppercase">
          {portalLabel}
        </p>
        <h3 className="text-2xl font-semibold tracking-widest">{brand}</h3>
      </div>
    </div>
  );
}

export default Branding;
