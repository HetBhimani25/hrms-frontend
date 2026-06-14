/* eslint-disable react-hooks/immutability */
import React, { useEffect, useState, useRef } from "react";
import { applyLeave, getEmployeeLeaves } from "../../api/LeaveServices/leaveService";
import "../../styles/hr.css"; 
import { useToast } from "../../components/ToastContext"; 

function EmployeeLeave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    leaveType: "SICK",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const { addToast } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const leaveTypes = [
    { value: "SICK", label: "Sick Leave" },
    { value: "CASUAL", label: "Casual Leave" },
    { value: "ANNUAL", label: "Annual Leave" },
    { value: "MATERNITY", label: "Maternity Leave" },
    { value: "PATERNITY", label: "Paternity Leave" }
  ];

  useEffect(() => {
    loadLeaves();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadLeaves = async () => {
    try {
      const res = await getEmployeeLeaves();
      setLeaves(res.data);
    } catch(e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await applyLeave(form);
      setForm({
        leaveType: "SICK",
        startDate: "",
        endDate: "",
        reason: ""
      });
        addToast("Leave request successfully submitted!", "success");
        loadLeaves();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Application failed. Ensure dates are strictly valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hr-page" style={{ flexDirection: 'column', gap: '30px', display: 'flex', paddingBottom: '40px', position: 'relative' }}>
      


      {/* Leave Application Form Card */}
      <div className="hr-card" style={{ maxWidth: '850px', margin: '0' }}>
        <div className="hr-header">
          <h2 className="hr-title">Apply For Leave</h2>
        </div>
        
        {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(300px, 2fr)', gap: '20px' }}>
            {/* Custom Premium Dropdown for Leave Type */}
            <div className="custom-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Leave Type</label>
              <div 
                className={`custom-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: form.leaveType ? "#fff" : "rgba(255,255,255,0.5)",
                    padding: "0 15px",
                    height: "45px",
                    borderRadius: "10px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{leaveTypes.find(t => t.value === form.leaveType)?.label || "Select Leave Type"}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {isDropdownOpen && (
                <div className="custom-dropdown-menu" style={{
                    position: 'absolute',
                    top: '75px',
                    left: 0,
                    right: 0,
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 100,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    animation: 'dropdownFade 0.2s ease-out'
                }}>
                    {leaveTypes.map((t) => (
                        <div 
                            key={t.value}
                            className="dropdown-item"
                            onClick={() => { setForm({...form, leaveType: t.value}); setIsDropdownOpen(false); }}
                            style={{
                                padding: '12px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                background: form.leaveType === t.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                color: form.leaveType === t.value ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (form.leaveType !== t.value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = form.leaveType === t.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent';
                                e.currentTarget.style.color = form.leaveType === t.value ? '#60a5fa' : 'rgba(255,255,255,0.7)';
                            }}
                        >
                            <span>{t.label}</span>
                            {form.leaveType === t.value && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                    ))}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Reason (Optional)</label>
              <input
                type="text"
                placeholder="Briefly describe your reason..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                style={{ width: '100%', padding: '0 15px', height: '45px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
                style={{ width: '100%', padding: '0 15px', height: '45px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', outline: 'none' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>End Date</label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
                style={{ width: '100%', padding: '0 15px', height: '45px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', outline: 'none' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              marginTop: '10px', 
              width: '100%', 
              maxWidth: '240px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'filter 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            {loading ? "Submitting Request..." : "Submit Leave Request"}
          </button>
        </form>
      </div>

      {/* Leave History Table Card */}
      <div className="hr-card" style={{ maxWidth: '1000px', margin: '0' }}>
        <div className="hr-header">
          <h2 className="hr-title">My Leave History</h2>
        </div>

        <div className="table-wrapper">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status Track</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.leaveType}</td>
                  <td>{l.startDate}</td>
                  <td>{l.endDate}</td>
                  <td>{l.reason || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        l.status.includes("APPROVED") 
                          ? "status-active" 
                          : l.status.includes("REJECTED") 
                            ? "status-inactive" 
                            : ""
                      }`}
                      style={l.status === 'PENDING' ? { background: 'rgba(245, 158, 11, 0.2)', color: '#d97706', border: '1px solid currentColor' } : {}}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <div className="info-icon-wrapper">
                      ℹ️
                      <div className="info-popup">
                        <strong style={{ display: 'block', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)' }}>Approval Audit</strong>
                        {l.managerName ? (
                          <p style={{ margin: '4px 0' }}>
                            <strong>Manager ({l.managerName}): </strong> <br/>
                            <span style={{ color: 'var(--text-muted)' }}>{l.managerApprovedAt ? new Date(l.managerApprovedAt).toLocaleString() : 'N/A'}</span>
                          </p>
                        ) : (
                          <p style={{ margin: '4px 0', color: 'var(--text-muted)' }}>No Manager Interaction yet.</p>
                        )}
                        {l.hrName ? (
                          <p style={{ margin: '12px 0 4px' }}>
                            <strong>HR ({l.hrName}): </strong> <br/>
                            <span style={{ color: 'var(--text-muted)' }}>{l.hrApprovedAt ? new Date(l.hrApprovedAt).toLocaleString() : 'N/A'}</span>
                          </p>
                        ) : (
                          <p style={{ margin: '12px 0 4px', color: 'var(--text-muted)' }}>No HR Interaction yet.</p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-row" style={{ padding: '30px' }}>No leave application records found. Take a break!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLeave;