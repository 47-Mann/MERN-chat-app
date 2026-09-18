import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // The stored token is the client-side gate for screens that require login.
  const currentUser = JSON.parse(localStorage.getItem("userInfo") || null);
  const token = currentUser?.token;

  // Preserve the requested page for authenticated users and redirect guests.
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
