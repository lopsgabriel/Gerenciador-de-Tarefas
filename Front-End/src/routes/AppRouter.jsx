import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRouter({ children }) {
  const authenticated = useSelector(e => e.authentication.authenticated);
  return authenticated ? children : <Navigate to="/login" />
}