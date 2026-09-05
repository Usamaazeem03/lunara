function Profile({ onProfileClick, profileImg, profileAlt }) {
  const avatarClasses =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2620]/20 bg-white/80 overflow-hidden";

  return (
    <div>
      {onProfileClick ? (
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
      )}
    </div>
  );
}

export default Profile;
