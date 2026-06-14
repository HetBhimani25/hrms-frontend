import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getManagerDashboardStats } from "../../api/dashboardService";
import { Users, Clock } from "lucide-react";
import "../../styles/admin.css"; // Reuse admin styles for consistency

/* Animated Counter Component */
function Counter({ end }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    if (!end) {
      setCount(0);
      return;
    }
    const step = Math.ceil(end / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [end]);

  return <span>{count}</span>;
}

function ManagerDashboard() {
  const { auth } = useAuth();
  const [stats, setStats] = useState({ totalEmployees: 0, pendingLeaves: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getManagerDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {auth?.fullName || "Manager"}</h2>
      <p className="dashboard-sub">Monitor your team's performance and approve leave requests</p>

      <div className="stats-grid" style={{ marginTop: '30px' }}>
        <div className="stat-card purple">
          <div className="stat-icon purple">
            <Users size={22} />
          </div>
          <h4>Active Employees</h4>
          <Counter end={stats.totalEmployees} />
        </div>

        <div className="stat-card blue">
          <div className="stat-icon blue">
            <Clock size={22} />
          </div>
          <h4>Pending Leaves</h4>
          <Counter end={stats.pendingLeaves} />
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;