import clientLoginImg from "../../Shared/assets/images/client-login-img.jpg";
import ownerLoginImg from "../../Shared/assets/images/owner-login-img.jpg";

const AUTH_IMAGE_SOURCES = [clientLoginImg, ownerLoginImg];

const ROLE_IMAGES = {
  client: clientLoginImg,
  owner: ownerLoginImg,
};

const ROLE_OPTIONS = ["client", "owner"];

const ROLE_CONTENT = {
  client: {
    eyebrowKey: "auth.clientAccess",
    heroTitleKey: "auth.beautyMeetsSimplicity",
    heroBodyKey: "auth.bookManageAndGlowAllInOnePlace",
    steps: [{ translationKey: "auth.createAccount" }, { translationKey: "auth.chooseService" }, { translationKey: "common.bookAppointment" }],
    headline: {
      signupKey: "auth.createYourClientAccount",
      loginKey: "auth.welcomeBackClient",
    },
    subhead: {
      signupKey: "auth.startBookingInSeconds",
      loginKey: "auth.signInToManageYourAppointments",
    },
  },
  owner: {
    eyebrowKey: "auth.ownerAccess",
    heroTitleKey: "auth.growYourBusiness",
    heroBodyKey: "auth.manageBookingsStaffAndClientsEffortlessly",
    steps: [{ translationKey: "auth.createBusiness" }, { translationKey: "auth.addServices" }, { translationKey: "auth.acceptBookings" }],
    headline: {
      signupKey: "auth.createOwnerAccount",
      loginKey: "common.ownerPortal",
    },
    subhead: {
      signupKey: "auth.launchYourSalonInMinutes",
      loginKey: "auth.signInToManageYourBusiness",
    },
  },
};

export { AUTH_IMAGE_SOURCES, ROLE_CONTENT, ROLE_IMAGES, ROLE_OPTIONS };
