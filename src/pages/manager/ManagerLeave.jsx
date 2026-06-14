/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useToast } from "../../components/ToastContext";
import {
  getManagerLeaves,
  approveLeaveByManager,
  rejectLeaveByManager
} from "../../api/LeaveServices/leaveService";

function ManagerLeave() {

  const [leaves, setLeaves] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    const res = await getManagerLeaves();
    setLeaves(res.data);
  };

  const approve = async (id) => {
    try {
      await approveLeaveByManager(id);
      addToast("Leave request approved and sent to HR", "success");
      loadLeaves();
    } catch (err) {
      addToast("Failed to approve leave", "error");
    }
  };

  const reject = async (id) => {
    try {
      await rejectLeaveByManager(id);
      addToast("Leave request rejected", "warning");
      loadLeaves();
    } catch (err) {
      addToast("Failed to reject leave", "error");
    }
  };

  return (
    <div className="hr-page" style={{ padding: '20px 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
      <div className="hr-card" style={{ width: '100%', margin: '0' }}>
        <div className="hr-header">
          <h2 className="hr-title">Team Leave Approvals (Manager)</h2>
        </div>
        
        <div className="table-wrapper">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Status</th>
                <th>Actions</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.employeeName}</td>
                  <td>{l.leaveType}</td>
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
                    {l.status === 'HR_APPROVED' ? (
                      <span style={{ color: 'var(--success)', fontWeight: '600' }}>Manager Approved</span>
                    ) : l.status.includes('REJECTED') ? (
                      <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Rejected</span>
                    ) : l.status === 'MANAGER_APPROVED' ? (
                      <span style={{ color: 'var(--accent)', fontWeight: '600' }}>Forwarded to HR</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => approve(l.id)} 
                          style={{ background: 'var(--success)', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                          Approve
                        </button>
                        <button 
                          onClick={() => reject(l.id)} 
                          style={{ background: 'var(--danger)', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="info-icon-wrapper">
                      ℹ️
                      <div className="info-popup">
                        <strong style={{ display: 'block', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)' }}>Request Details</strong>
                        <p style={{ margin: '4px 0' }}><strong>Applied:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{l.createdAt ? new Date(l.createdAt).toLocaleString() : 'N/A'}</span></p>
                        <p style={{ margin: '8px 0 4px' }}><strong>Period:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{l.startDate} to {l.endDate}</span></p>
                        <p style={{ margin: '8px 0 0' }}><strong>Reason:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{l.reason || 'None provided'}</span></p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-row" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No pending requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManagerLeave;