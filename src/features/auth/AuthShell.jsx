import "./mobileAuth.css";

function AuthShell({ children }) {
  return (
    <div className="mobile-auth relative mx-auto w-full max-w-6xl">
      {children}
    </div>
  );
}

export default AuthShell;
