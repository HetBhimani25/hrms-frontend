import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";
import { LayoutDashboard, UserCog, Users, Activity, User } from "lucide-react";
import { useToast } from "../../components/ToastContext";
import "../../styles/admin.css";

function AdminLayout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      if (auth?.refreshToken) {
        await api.post("/auth/logout", {
          refreshToken: auth.refreshToken,
        });
      }
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      logout();
      addToast("Logged out successfully", "error");
      navigate("/login");
    }
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h2>HRMS Admin</h2>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-main">
        <aside className="admin-sidebar static">
          <NavLink to="/admin" end className="side-link">
            <span className="link-icon">
              <LayoutDashboard size={20} />
            </span>
            <span className="link-text">Admin Dashboard</span>
          </NavLink>

          <NavLink to="/admin/hr" className="side-link">
            <span className="link-icon">
              <UserCog size={20} />
            </span>
            <span className="link-text">HR</span>
          </NavLink>

          <NavLink to="/admin/manager" className="side-link">
            <span className="link-icon">
              <Users size={20} />
            </span>
            <span className="link-text">Manager</span>
          </NavLink>         

          <NavLink to="/admin/employees" className="side-link">
            <span className="link-icon">
              <User size={20} />
            </span>
            <span className="link-text">Employees</span>
          </NavLink>
          
          <NavLink to="/admin/activities" className="side-link">
            <span className="link-icon">
              <Activity size={20} />
            </span>
            <span className="link-text">Recent Activity</span>
          </NavLink>
        </aside>

        <section className="admin-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default AdminLayout;
