import { useEffect, useState, useCallback } from "react";
import {
  Users, UserCheck, Inbox, Search, X, Filter,
  Calendar, ChevronDown, ShieldCheck, Clock
} from "lucide-react";
import { getAllActivities } from "../../api/dashboardService";
import Pagination from "../../components/Pagination";
import "../../styles/admin.css";

/* ─── Constants ─────────────────────────────────────────── */
const ENTITY_TYPES  = ["ALL", "HR", "MANAGER", "EMPLOYEE"];
const ACTION_TYPES  = ["ALL_ACTIONS", "CREATE", "UPDATE", "DISABLE", "ENABLE", "DELETE"];
const PERFORMER_ROLES = ["ALL_USERS", "ADMIN", "HR", "MANAGER"];
const DATE_RANGES   = [
  { label: "All Time",   value: "" },
  { label: "Today",      value: "TODAY" },
  { label: "Yesterday",  value: "YESTERDAY" },
  { label: "Last 7 Days",value: "LAST_7" },
  { label: "Last 30 Days",value: "LAST_30" },
  { label: "Custom",     value: "CUSTOM" },
];

const ACTION_LABELS = {
  CREATE: { label: "Created",  color: "#10b981" },
  UPDATE: { label: "Updated",  color: "#3b82f6" },
  DISABLE:{ label: "Disabled", color: "#f59e0b" },
  ENABLE: { label: "Enabled",  color: "#6366f1" },
  DELETE: { label: "Deleted",  color: "#ef4444" },
  APPROVE:{ label: "Approved", color: "#06b6d4" },
  REJECT: { label: "Rejected", color: "#ec4899" },
  ASSIGN: { label: "Assigned", color: "#8b5cf6" },
};

/* ─── Entity style map ───────────────────────────────────── */
const entityStyle = (type) => {
  switch (type) {
    case "HR":       return { color: "#6366f1", bg: "rgba(99,102,241,0.08)",   border: "rgba(99,102,241,0.2)"   };
    case "MANAGER":  return { color: "#10b981", bg: "rgba(16,185,129,0.08)",   border: "rgba(16,185,129,0.2)"   };
    case "EMPLOYEE": return { color: "#a855f7", bg: "rgba(168,85,247,0.08)",   border: "rgba(168,85,247,0.2)"   };
    default:         return { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",   border: "rgba(245,158,11,0.2)"   };
  }
};

/* ─── Chip button ────────────────────────────────────────── */
const Chip = ({ label, active, color = "rgba(59,130,246,0.5)", onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 14px",
      borderRadius: "20px",
      border: active ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.1)",
      background: active ? `${color}30` : "rgba(255,255,255,0.04)",
      color: active ? "#fff" : "rgba(255,255,255,0.55)",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: 600,
      transition: "all 0.2s",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </button>
);

/* ═══════════════════════════════════════════════════════════ */
export default function ActivityLogs() {
  const [activities,  setActivities]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(0);
  const [totalPages,  setTotalPages]  = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  /* Filter state */
  const [search,        setSearch]        = useState("");
  const [entityType,    setEntityType]    = useState("ALL");
  const [actionType,    setActionType]    = useState("ALL_ACTIONS");
  const [performerRole, setPerformerRole] = useState("ALL_USERS");
  const [dateRange,     setDateRange]     = useState("");
  const [dateFrom,      setDateFrom]      = useState("");
  const [dateTo,        setDateTo]        = useState("");
  const [showCustomDate, setShowCustomDate] = useState(false);

  /* ── active filter count badge ── */
  const activeCount = [
    entityType    !== "ALL"         ? 1 : 0,
    actionType    !== "ALL_ACTIONS" ? 1 : 0,
    performerRole !== "ALL_USERS"   ? 1 : 0,
    dateRange     !== ""            ? 1 : 0,
    search        !== ""            ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAll = () => {
    setSearch(""); setEntityType("ALL"); setActionType("ALL_ACTIONS");
    setPerformerRole("ALL_USERS"); setDateRange(""); setDateFrom(""); setDateTo("");
    setShowCustomDate(false); setPage(0);
  };

  /* ── Load ── */
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllActivities({
        entityType:      entityType    === "ALL"         ? "" : entityType,
        actionType:      actionType    === "ALL_ACTIONS" ? "" : actionType,
        performedByRole: performerRole === "ALL_USERS"   ? "" : performerRole,
        dateRange:       dateRange,
        dateFrom:        dateRange === "CUSTOM" ? dateFrom : "",
        dateTo:          dateRange === "CUSTOM" ? dateTo   : "",
        search,
        page,
        size: 10,
      });
      setActivities(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("Failed to load activities", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, entityType, actionType, performerRole, dateRange, dateFrom, dateTo]);

  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
  }, [load]);

  /* ── helpers ── */
  const relativeTime = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60)    return "Just now";
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  /* ── styles ── */
  const filterRow = {
    display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
  };
  const label = {
    fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
  };
  const inputStyle = {
    padding: "8px 14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    width: "220px",
  };
  const searchInputStyle = {
    ...inputStyle,
    paddingLeft: "38px",
  };

  return (
    <div className="activity-page">
      <div
        className="activity-card-wrapper"
        style={{
          padding: "28px",
          borderRadius: "20px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 700, color: "#fff" }}>Activity Logs</h2>
            <p style={{ margin: "6px 0 0", opacity: 0.6, fontSize: "14px" }}>
              Enterprise audit trail — {totalElements} total log{totalElements !== 1 ? "s" : ""}
            </p>
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "10px",
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171", cursor: "pointer", fontSize: "13px", fontWeight: 600,
              }}
            >
              <X size={14} /> Clear Filters ({activeCount})
            </button>
          )}
        </div>

        {/* ═══ FILTER BAR ═══ */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "18px 20px",
          marginBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>

          {/* Row 1: Search */}
          <div style={filterRow}>
            <span style={label}><Search size={11} style={{ display: "inline", marginRight: 4 }} />Search</span>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                style={searchInputStyle}
              />
              {search && (
                <X size={14} onClick={() => setSearch("")}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.5, cursor: "pointer" }} />
              )}
            </div>
          </div>

          {/* Row 2: Entity type */}
          <div style={filterRow}>
            <span style={label}><Users size={11} style={{ display: "inline", marginRight: 4 }} />Entity</span>
            {ENTITY_TYPES.map((t) => (
              <Chip
                key={t}
                label={t === "ALL" ? "All" : t}
                active={entityType === t}
                color={entityStyle(t).color}
                onClick={() => { setEntityType(t); setPage(0); }}
              />
            ))}
          </div>

          {/* Row 3: Action type */}
          <div style={filterRow}>
            <span style={label}><Filter size={11} style={{ display: "inline", marginRight: 4 }} />Action</span>
            {ACTION_TYPES.map((a) => {
              const meta = ACTION_LABELS[a] || {};
              return (
                <Chip
                  key={a}
                  label={a === "ALL_ACTIONS" ? "All Actions" : (meta.label || a)}
                  active={actionType === a}
                  color={meta.color || "#3b82f6"}
                  onClick={() => { setActionType(a); setPage(0); }}
                />
              );
            })}
          </div>

          {/* Row 4: Performed by */}
          <div style={filterRow}>
            <span style={label}><ShieldCheck size={11} style={{ display: "inline", marginRight: 4 }} />Performed By</span>
            {PERFORMER_ROLES.map((r) => (
              <Chip
                key={r}
                label={r === "ALL_USERS" ? "All Users" : r}
                active={performerRole === r}
                color="#8b5cf6"
                onClick={() => { setPerformerRole(r); setPage(0); }}
              />
            ))}
          </div>

          {/* Row 5: Date range */}
          <div style={filterRow}>
            <span style={label}><Calendar size={11} style={{ display: "inline", marginRight: 4 }} />Date</span>
            {DATE_RANGES.map((d) => (
              <Chip
                key={d.value}
                label={d.label}
                active={dateRange === d.value}
                color="#06b6d4"
                onClick={() => {
                  setDateRange(d.value);
                  setShowCustomDate(d.value === "CUSTOM");
                  if (d.value !== "CUSTOM") { setDateFrom(""); setDateTo(""); }
                  setPage(0);
                }}
              />
            ))}
            {showCustomDate && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", width: "100%", paddingLeft: "72px" }}>
                <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
                  style={{ ...inputStyle, width: "160px" }} />
                <span style={{ opacity: 0.4, fontSize: "13px" }}>to</span>
                <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
                  style={{ ...inputStyle, width: "160px" }} />
              </div>
            )}
          </div>
        </div>

        {/* ═══ ACTIVITY LIST ═══ */}
        <div style={{ minHeight: "360px", display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}>
          {loading && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(15,23,42,0.5)", zIndex: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "14px",
            }}>
              <div className="custom-spinner" />
            </div>
          )}

          {!loading && activities.length > 0 ? (
            activities.map((act) => {
              const es  = entityStyle(act.entityType || act.type);
              const am  = ACTION_LABELS[act.actionType] || {};
              return (
                <div
                  key={act.id}
                  style={{
                    display: "flex", gap: "14px",
                    background: es.bg, padding: "14px 16px",
                    borderRadius: "14px", border: `1px solid ${es.border}`,
                    transition: "all 0.22s ease", cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 6px 20px ${es.border}`;
                    e.currentTarget.style.borderColor = es.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = es.border;
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: es.color, flexShrink: 0,
                  }}>
                    <Users size={18} />
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#f3f4f6" }}>{act.message}</p>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap" }}>
                        {new Date(act.timestamp).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Tags row */}
                    <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {/* Entity badge */}
                      <span style={{
                        fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
                        background: `${es.color}20`, color: es.color,
                      }}>
                        {act.entityType || act.type}
                      </span>

                      {/* Action badge */}
                      {act.actionType && (
                        <span style={{
                          fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
                          background: `${am.color || "#64748b"}20`, color: am.color || "#94a3b8",
                        }}>
                          {am.label || act.actionType}
                        </span>
                      )}

                      <span style={{ opacity: 0.25, fontSize: "12px" }}>•</span>
                      <span style={{ fontSize: "12px", opacity: 0.55 }}>
                        <Clock size={11} style={{ display: "inline", marginRight: 3 }} />
                        {relativeTime(act.timestamp)}
                      </span>
                      <span style={{ opacity: 0.25, fontSize: "12px" }}>•</span>
                      <span style={{ fontSize: "12px", opacity: 0.55 }}>
                        By{" "}
                        <span style={{ color: "#fff", fontWeight: 600 }}>
                          {act.performedBy}
                        </span>
                        {act.performedByRole && (
                          <span style={{ marginLeft: 4, fontSize: "10px", opacity: 0.6 }}>
                            ({act.performedByRole})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : !loading && (
            <div style={{ padding: "70px", textAlign: "center", opacity: 0.45 }}>
              <Inbox size={52} style={{ marginBottom: "16px" }} />
              <p style={{ fontSize: "16px", fontWeight: 500 }}>No activities match your filters.</p>
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    marginTop: "14px", background: "none", border: "none",
                    color: "#60a5fa", cursor: "pointer", fontWeight: 600, fontSize: "14px",
                    textDecoration: "underline",
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: "24px" }}>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <style>{`
        .custom-spinner {
          width: 38px; height: 38px;
          border: 3px solid rgba(255,255,255,0.08);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          animation: al-spin 0.9s linear infinite;
        }
        @keyframes al-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
