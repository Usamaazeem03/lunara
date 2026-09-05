// useDashboardRouting.js
import { useCallback, useEffect, useMemo } from "react";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { CLIENT_PAGES } from "../config/clientPages";
import { OWNER_PAGES } from "../config/ownerPages";
import { CLIENT_MENU_ITEMS } from "../config/clientMenu";
import { OWNER_MENU_ITEMS } from "../config/ownerMenu";
import ClientProfilePage from "../Admin/ClientProfilePage";

const DEFAULT_SEGMENT = { owner: "dashboard", client: "home" };
const VALID_ROLES = ["owner", "client"];

export function useDashboardRouting() {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileRoute = Boolean(useMatch("/profile"));
  const params = useParams();
  const { user, profile, loading } = useAuth();

  // ---------- 1. Who is this? ----------
  const role =
    user?.user_metadata?.role ||
    (VALID_ROLES.includes(params.role) ? params.role : "client");

  const isOwner = role === "owner";
  const menuItems = isOwner ? OWNER_MENU_ITEMS : CLIENT_MENU_ITEMS;
  const pages = isOwner ? OWNER_PAGES : CLIENT_PAGES;
  const defaultSegment = DEFAULT_SEGMENT[role] || menuItems[0].segment;

  // ---------- 2. What page are they on? ----------
  const requestedPage = params.page?.toLowerCase();
  const isValidPage = Boolean(requestedPage && pages[requestedPage]);
  const activeSegment = isValidPage ? requestedPage : defaultSegment;

  const isClientProfilePage =
    activeSegment === "clients" && Boolean(params.clientSlug);
  const ActivePage = isClientProfilePage
    ? ClientProfilePage
    : pages[activeSegment];

  // ---------- 3. Build a URL for a given segment ----------
  const ownerSlug = profile?.salon_slug || params.slug;

  const pathFor = useCallback(
    (segment) => {
      if (isOwner) {
        if (!ownerSlug) return "/dashboard";
        return segment === defaultSegment
          ? `/owner/salon/${ownerSlug}/dashboard`
          : `/owner/salon/${ownerSlug}/${segment}`;
      }
      return segment === defaultSegment
        ? "/dashboard"
        : `/dashboard/${segment}`;
    },
    [isOwner, ownerSlug, defaultSegment],
  );

  // ---------- 4. Is the current URL "correct"? If not, what should it be? ----------
  // Returns null when the URL is already fine, otherwise the segment to redirect to.
  function getRedirectSegment() {
    if (isOwner) {
      if (!ownerSlug) return null; // nothing to build a URL with yet, wait

      const missingSlugInUrl = !params.slug;
      const usingOldRouteShape = params.role === "owner"; // legacy /owner/:role style
      const slugDoesntMatch = params.slug && params.slug !== ownerSlug;
      const pageIsInvalid = Boolean(params.page) && !isValidPage;
      const pageIsRedundant =
        Boolean(params.page) && activeSegment === defaultSegment;

      if (missingSlugInUrl) return defaultSegment;
      if (usingOldRouteShape || slugDoesntMatch || pageIsRedundant)
        return activeSegment;
      if (pageIsInvalid) return defaultSegment;
      return null;
    }

    // client
    if (!params.page) return null; // already at default, nothing to fix
    if (!isValidPage || activeSegment === defaultSegment) return defaultSegment;
    return null;
  }

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate(`/auth/${role}/signin`, { replace: true });
      return;
    }

    if (isProfileRoute) return;

    const redirectSegment = getRedirectSegment();
    if (redirectSegment !== null) {
      navigate(pathFor(redirectSegment), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loading,
    user,
    role,
    isProfileRoute,
    activeSegment,
    defaultSegment,
    ownerSlug,
    params.slug,
    params.page,
    params.role,
    pathFor,
    navigate,
  ]);

  // ---------- 5. UI helpers ----------
  const avatarUrl = useMemo(
    () => profile?.avatar_img || user?.user_metadata?.picture || null,
    [profile?.avatar_img, user?.user_metadata?.picture],
  );

  const openProfile = useCallback(() => {
    if (isProfileRoute) return;
    navigate("/profile", {
      state: { from: `${location.pathname}${location.search}` },
    });
  }, [isProfileRoute, location.pathname, location.search, navigate]);

  const closeProfile = useCallback(() => {
    const fromPath =
      typeof location.state?.from === "string" ? location.state.from : null;
    if (fromPath && fromPath !== "/profile") {
      navigate(fromPath, { replace: true });
      return;
    }
    navigate(pathFor(activeSegment), { replace: true });
  }, [activeSegment, pathFor, location.state, navigate]);

  const setActiveMenu = useCallback(
    (identifier) => {
      const item = menuItems.find(
        (m) => m.segment === identifier || m.text === identifier,
      );
      if (!item) return;
      navigate(pathFor(item.segment));
    },
    [menuItems, pathFor, navigate],
  );

  const menuItemsWithActive = useMemo(
    () =>
      menuItems.map((item) => ({
        ...item,
        active: item.segment === activeSegment,
        onClick: () => setActiveMenu(item.segment),
      })),
    [menuItems, activeSegment, setActiveMenu],
  );

  return {
    role,
    loading,
    profile,
    isProfileRoute,
    ActivePage,
    avatarUrl,
    menuItemsWithActive,
    setActiveMenu,
    openProfile,
    closeProfile,
  };
}
