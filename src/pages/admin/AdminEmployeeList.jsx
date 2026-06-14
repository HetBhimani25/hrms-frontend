/* eslint-disable react-hooks/immutability */
import { useEffect, useState, useCallback, useRef } from "react";
import { getAllEmployeesForAdmin } from "../../api/AdminServices/employeeService";
import "../../styles/hr.css";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { Inbox, Building2, User, ChevronDown, Check } from "lucide-react";
import { useToast } from "../../components/ToastContext";

export default function AdminEmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { addToast } = useToast();

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllEmployeesForAdmin({
        search,
        department,
        page,
        size: 8,
      });
      setEmployees(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      addToast(
        err.response?.data?.message || "Failed to load employee data",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [search, department, page, addToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 400);
    return () => clearTimeout(timer);
  }, [loadEmployees]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const departments = [
    "Software Engineering",
    "Quality Assurance",
    "DevOps & Infrastructure",
    "Product Management",
    "UI/UX Design",
    "Data Science & AI",
    "Cybersecurity",
    "IT Support",
    "Finance & Administration",
  ];

  return (
    <div className="hr-page">
      <div className="hr-card">
        <div className="hr-header" style={{ marginBottom: "30px" }}>
          <div>
            <h2 className="hr-title">All Employees</h2>
            
          </div>

          <div className="hr-header-actions" style={{ gap: "16px" }}>
            {/* Custom Premium Dropdown */}
            <div className="custom-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '220px' }}>
              <div 
                className={`custom-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: department ? "#fff" : "rgba(255,255,255,0.5)",
                    padding: "0 15px",
                    height: "42px",
                    borderRadius: "12px",
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
                    <Building2 size={16} opacity={0.6} />
                    <span>{department || "All Departments"}</span>
                </div>
                <ChevronDown size={16} style={{ 
                    transition: 'transform 0.3s ease',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
                }} />
              </div>

              {isDropdownOpen && (
                <div className="custom-dropdown-menu" style={{
                    position: 'absolute',
                    top: '50px',
                    left: 0,
                    right: 0,
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 100,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    animation: 'dropdownFade 0.2s ease-out'
                }}>
                    <div 
                        className="dropdown-item"
                        onClick={() => { setDepartment(""); setIsDropdownOpen(false); setPage(0); }}
                        style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: department === "" ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            color: department === "" ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                            transition: 'background 0.2s'
                        }}
                    >
                        <span>All Departments</span>
                        {department === "" && <Check size={14} />}
                    </div>
                    {departments.map((d) => (
                        <div 
                            key={d}
                            className="dropdown-item"
                            onClick={() => { setDepartment(d); setIsDropdownOpen(false); setPage(0); }}
                            style={{
                                padding: '10px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                background: department === d ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                color: department === d ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (department !== d) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = department === d ? 'rgba(59, 130, 246, 0.1)' : 'transparent';
                                e.currentTarget.style.color = department === d ? '#60a5fa' : 'rgba(255,255,255,0.7)';
                            }}
                        >
                            <span>{d}</span>
                            {department === d && <Check size={14} />}
                        </div>
                    ))}
                </div>
              )}
            </div>

            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(0);
              }}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Reporting Manager</th>
                <th>Joining Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    <div style={{ padding: "20px" }}>Loading employees...</div>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 500 }}>{emp.email}</td>
                    <td style={{ fontWeight: 500 }}>{emp.fullName}</td>
                    <td>{emp.phone}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {emp.department}
                      </div>
                    </td>
                    <td>
                        {emp.managerName ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {emp.managerName}
                            </div>
                        ) : (
                            <span style={{ opacity: 0.4 }}>Not Assigned</span>
                        )}
                    </td>
                    <td>{emp.joiningDate}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          emp.status === "ACTIVE"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {emp.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-row">
                    <div className="empty-state">
                      <Inbox size={48} style={{ opacity: 0.5 }} />
                      <p>No employees found matching your criteria.</p>
                      {(search || department) && (
                        <button
                          className="btn btn-outline"
                          style={{ marginTop: "10px" }}
                          onClick={() => {
                            setSearch("");
                            setDepartment("");
                          }}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-dropdown-trigger:hover {
            border-color: rgba(59, 130, 246, 0.5) !important;
            background: rgba(255,255,255,0.08) !important;
        }
        .custom-dropdown-trigger.active {
            border-color: var(--accent) !important;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .custom-dropdown-menu::-webkit-scrollbar {
            width: 5px;
        }
        .custom-dropdown-menu::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
