import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  // The stored token is the client-side gate for screens that require login.
  const currentUser = JSON.parse(localStorage.getItem("userInfo") || null);
  const token = currentUser?.token;

  // Preserve the requested page for authenticated users and redirect guests.
  return token ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
