/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, Building2, Settings } from "lucide-react";
import "../../styles/admin.css";
import {
  getAdminDashboardStats,
  getRecentActivities,
} from "../../api/dashboardService";

/* Animated Counter */
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

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalHrs: 0,
    totalManagers: 0,
    totalEmployees: 0,
    activeEmployees: 0,
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        getAdminDashboardStats(),
        getRecentActivities(),
      ]);
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString();
  };

  const getActivityStyles = (type) => {
    switch (type) {
      case "HR":
        return {
          icon: <Users size={16} />,
          color: "#6366f1",
          bg: "rgba(99, 102, 241, 0.08)",
          border: "rgba(99, 102, 241, 0.15)",
        };
      case "MANAGER":
        return {
          icon: <Users size={16} />,
          color: "#10b981",
          bg: "rgba(16, 185, 129, 0.08)",
          border: "rgba(16, 185, 129, 0.15)",
        };
      case "EMPLOYEE":
        return {
          icon: <Users size={16} />,
          color: "#a855f7",
          bg: "rgba(168, 85, 247, 0.08)",
          border: "rgba(168, 85, 247, 0.15)",
        };
      default:
        return {
          icon: <UserCheck size={16} />,
          color: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.08)",
          border: "rgba(245, 158, 11, 0.15)",
        };
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome, Admin</h2>

      <p className="dashboard-sub">Manage HRs, Managers and Employees</p>

      <div className="dashboard-grid">
        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-icon green">
              <UserCheck size={22} />
            </div>
            <h4>Active Employees</h4>
            <Counter end={stats.activeEmployees} />
          </div>

          <div className="stat-card blue">
            <div className="stat-icon blue">
              <Users size={22} />
            </div>
            <h4>Total HRs</h4>
            <Counter end={stats.totalHrs} />
          </div>

          <div className="stat-card tyle">
            <div className="stat-icon tyle">
              <Users size={22} />
            </div>
            <h4>Total Managers</h4>
            <Counter end={stats.totalManagers} />
          </div>

          <div className="stat-card purple">
            <div className="stat-icon purple">
              <Users size={22} />
            </div>
            <h4>Total Employees</h4>
            <Counter end={stats.totalEmployees} />
          </div>
        </div>

        {/* RECENT ACTIVITY FEED */}
        <div className="activity-feed">
          <div className="activity-feed-header">
            <h3>Recent Activity</h3>
            <Link to="/admin/activities" className="view-all-link">
              View All
            </Link>
          </div>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((act) => {
                const styles = getActivityStyles(act.entityType || act.type);
                const actionColors = {
                  CREATE: "#10b981", UPDATE: "#3b82f6", DISABLE: "#f59e0b",
                  ENABLE: "#6366f1", DELETE: "#ef4444",
                };
                const actionLabels = {
                  CREATE: "Created", UPDATE: "Updated", DISABLE: "Disabled",
                  ENABLE: "Enabled", DELETE: "Deleted",
                };
                const actionColor = actionColors[act.actionType] || styles.color;
                const actionLabel = actionLabels[act.actionType];
                return (
                  <div
                    className="activity-item"
                    key={act.id}
                    style={{
                      background: styles.bg,
                      border: `1px solid ${styles.border}`,
                      padding: "10px 14px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.borderColor = styles.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.borderColor = styles.border;
                    }}
                  >
                    <div style={{ color: styles.color }}>{styles.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#f3f4f6",
                        }}
                      >
                        {act.message}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                        {actionLabel && (
                          <span style={{
                            fontSize: "10px", fontWeight: 700, padding: "1px 6px",
                            borderRadius: "4px", background: `${actionColor}20`, color: actionColor,
                          }}>
                            {actionLabel}
                          </span>
                        )}
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {formatRelativeTime(act.timestamp)} • by{" "}
                          {act.performedBy.split("@")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="activity-item">
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                  No recent activities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
