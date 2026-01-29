import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Applayout from "../layout/Applayout.jsx";

function Protected() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <>Loading...</>;
  }

  return isAuthenticated ? (
    <Applayout>
      <Outlet />
    </Applayout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Protected;
