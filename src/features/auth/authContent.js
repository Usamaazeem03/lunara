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
    eyebrow: "Client Access",
    heroTitle: "Beauty Meets Simplicity",
    heroBody: "Book, manage, and glow - all in one place.",
    steps: ["Create Account", "Choose Service", "Book Appointment"],
    headline: {
      signup: "Create Your Client Account",
      login: "Welcome Back, Client",
    },
    subhead: {
      signup: "Start booking in seconds.",
      login: "Sign in to manage your appointments.",
    },
  },
  owner: {
    eyebrow: "Owner Access",
    heroTitle: "Grow Your Business",
    heroBody: "Manage bookings, staff, and clients effortlessly.",
    steps: ["Create Business", "Add Services", "Accept Bookings"],
    headline: {
      signup: "Create Owner Account",
      login: "Owner Portal",
    },
    subhead: {
      signup: "Launch your salon in minutes.",
      login: "Sign in to manage your business.",
    },
  },
};

export { AUTH_IMAGE_SOURCES, ROLE_CONTENT, ROLE_IMAGES, ROLE_OPTIONS };
