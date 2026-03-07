import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DashboardPage;