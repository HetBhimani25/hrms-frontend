/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useToast } from "../../components/ToastContext";
import {
  getHrLeaves,
  approveLeaveByHr,
  rejectLeaveByHr
} from "../../api/LeaveServices/leaveService";
import { 
  Clock, 
  FileText
} from "lucide-react";
import "../../styles/hr.css";

function HrLeave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await getHrLeaves();
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      addToast("Failed to load leave requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await approveLeaveByHr(id);
      addToast("Leave request approved successfully", "success");
      loadLeaves();
    } catch (err) {
      addToast("Failed to approve leave", "error");
    }
  };

  const reject = async (id) => {
    try {
      await rejectLeaveByHr(id);
      addToast("Leave request rejected", "warning");
      loadLeaves();
    } catch (err) {
      addToast("Failed to reject leave", "error");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' };
      case 'MANAGER_APPROVED':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' };
      case 'HR_APPROVED':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' };
      case 'REJECTED':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af', border: 'rgba(156, 163, 175, 0.2)' };
    }
  };

  return (
    <div className="hr-page" style={{ padding: '0', width: '100%', height: '100%' }}>
      <div className="hr-card-premium" style={{ 
        background: 'var(--bg-card)', 
        borderRadius: '24px', 
        padding: '40px', 
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(16px)',
        minHeight: 'calc(100vh - 120px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className="hr-header" style={{ marginBottom: '40px' }}>
          <div>
            <h2 className="hr-title" style={{ margin: 0, fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>Company Leave Approvals</h2>
            <p style={{ margin: '10px 0 0', opacity: 0.6, fontSize: '16px' }}>Finalize employee leave requests approved by managers.</p>
          </div>
        </div>
        
        <div className="table-wrapper" style={{ minHeight: '400px', overflow: 'visible', border: 'none', padding: '0 20px' }}>
          {loading ? (
            <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <div className="custom-spinner"></div>
            </div>
          ) : (
            <table className="hr-table-premium">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                  <th style={{ width: '60px', textAlign: 'right' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => {
                  const sStyle = getStatusStyle(l.status);
                  return (
                    <tr key={l.id} className="premium-row">
                      <td>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{l.employeeName}</span>
                      </td>
                      <td>
                        <span style={{ opacity: 0.7, fontSize: '14px' }}>{l.department || 'N/A'}</span>
                      </td>
                      <td>
                        <span style={{ opacity: 0.9, fontSize: '14px' }}>{l.leaveType}</span>
                      </td>
                      <td>
                        <span style={{ opacity: 0.6, fontSize: '13px' }}>{l.startDate} to {l.endDate}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '6px 14px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            background: sStyle.bg,
                            color: sStyle.color,
                            border: `1px solid ${sStyle.border}`,
                            textTransform: 'uppercase'
                          }}
                        >
                          {l.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {l.status === 'MANAGER_APPROVED' ? (
                          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                            <span 
                              onClick={() => approve(l.id)}
                              style={{ 
                                color: '#10b981', 
                                cursor: 'pointer', 
                                fontWeight: '600', 
                                fontSize: '14px',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px'
                              }}
                            >
                              Approve
                            </span>
                            <span 
                              onClick={() => reject(l.id)}
                              style={{ 
                                color: '#ef4444', 
                                cursor: 'pointer', 
                                fontWeight: '600', 
                                fontSize: '14px',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px'
                              }}
                            >
                              Reject
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', opacity: 0.5, fontStyle: 'italic' }}>Processed</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="info-icon-wrapper-premium">
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600', 
                            opacity: 0.7, 
                            cursor: 'pointer',
                            color: 'var(--accent)',
                            textDecoration: 'underline'
                          }}>info</span>
                          <div className="info-popup-premium">
                            <div className="popup-section">
                              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '14px', margin: '0 0 12px' }}>
                                <FileText size={16} /> Request Details
                              </h4>
                              <p><strong>Reason:</strong> <br/><span>{l.reason || 'No reason provided'}</span></p>
                              <p><strong>Applied On:</strong> <br/><span>{l.createdAt ? new Date(l.createdAt).toLocaleString() : 'N/A'}</span></p>
                            </div>
                            
                            <div className="popup-section" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '12px' }}>
                              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '14px', margin: '0 0 12px' }}>
                                <Clock size={16} /> Audit Trail
                              </h4>
                              {l.managerName ? (
                                <p>
                                  <strong>Manager ({l.managerName}):</strong> <br/>
                                  <span style={{ color: 'var(--success)' }}>Approved</span> on {l.managerApprovedAt ? new Date(l.managerApprovedAt).toLocaleString() : 'N/A'}
                                </p>
                              ) : (
                                <p style={{ opacity: 0.5 }}>Waiting for Manager interaction.</p>
                              )}
                              {l.hrName && (
                                <p style={{ marginTop: '8px' }}>
                                  <strong>HR ({l.hrName}):</strong> <br/>
                                  <span style={l.status === 'REJECTED' ? { color: 'var(--danger)' } : { color: 'var(--success)' }}>{l.status === 'REJECTED' ? 'Rejected' : 'Approved'}</span> on {l.hrApprovedAt ? new Date(l.hrApprovedAt).toLocaleString() : 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!loading && leaves.length === 0 && (
            <div style={{ padding: '100px', textAlign: 'center', opacity: 0.4 }}>
              <Clock size={56} style={{ marginBottom: '20px' }} />
              <p style={{ fontSize: '20px', fontWeight: 500 }}>No leave requests pending HR review.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hr-table-premium {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 16px;
        }
        .hr-table-premium th {
          padding: 12px 20px;
          text-align: left;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .premium-row {
          background: rgba(255,255,255,0.015);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }
        .premium-row:hover {
          background: rgba(255,255,255,0.04);
          transform: translateY(-3px) scale(1.002);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 50;
        }
        .premium-row td {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .premium-row td:first-child {
          border-left: 1px solid rgba(255,255,255,0.04);
          border-radius: 16px 0 0 16px;
        }
        .premium-row td:last-child {
          border-right: 1px solid rgba(255,255,255,0.04);
          border-radius: 0 16px 16px 0;
        }
        
        .info-icon-wrapper-premium {
          position: relative;
          display: inline-block;
        }
        .info-popup-premium {
          position: absolute;
          right: calc(100% + 15px);
          top: 50%;
          transform: translateY(-50%) translateX(10px);
          width: 300px;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
          text-align: left;
        }
        .info-popup-premium::after {
          content: "";
          position: absolute;
          top: 0;
          left: 100%;
          height: 100%;
          width: 20px;
        }
        .info-icon-wrapper-premium:hover .info-popup-premium,
        .info-popup-premium:hover {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }
        .info-popup-premium p {
          margin: 8px 0;
          font-size: 14px;
          line-height: 1.5;
        }
        .info-popup-premium strong {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-popup-premium span {
          color: rgba(255,255,255,0.9);
        }
        .custom-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255,255,255,0.05);
          border-top: 4px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Hide scrollbars but keep functionality if needed */
        .table-wrapper::-webkit-scrollbar {
          display: none;
        }
        .table-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default HrLeave;