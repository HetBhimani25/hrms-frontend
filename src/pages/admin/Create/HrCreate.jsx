/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createHr } from "../../../api/AdminServices/hrService";
import "../../../styles/hr.css";
import { useToast } from "../../../components/ToastContext";
import { ArrowLeft } from "lucide-react";

function HrCreate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    department: "Human Resource",
    designation: "",
    joiningDate: "",
  });

  const [loading , setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const designations = ["Junior HR Associate", "Senior HR Specialist", "HR Manager"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createHr(form);
      addToast("HR account created successfully!", "success");
      navigate("/admin/hr");
    } catch (e) {
      addToast(e.response?.data?.message || "Failed to create HR", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">

      <div className="form-card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
          <button 
            onClick={() => navigate("/admin/hr")}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <h3 style={{ margin: 0 }}>Create HR</h3>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              required
              style={{ width: '100%', paddingRight: '60px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <input name="department" value="Human Resource" readOnly />
          {/* Custom Premium Dropdown for Designation */}
          <div className="custom-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            <div 
              className={`custom-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: form.designation ? "#fff" : "rgba(255,255,255,0.5)",
                  padding: "0 15px",
                  height: "45px",
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
                  <span>{form.designation || "Select Designation"}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="custom-dropdown-menu" style={{
                  position: 'absolute',
                  top: '55px',
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
                  <div 
                      className="dropdown-item"
                      onClick={() => { setForm({...form, designation: ""}); setIsDropdownOpen(false); }}
                      style={{
                          padding: '12px 15px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: form.designation === "" ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                          color: form.designation === "" ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                          transition: 'background 0.2s'
                      }}
                  >
                      <span>Select Designation</span>
                      {form.designation === "" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  {designations.map((d) => (
                      <div 
                          key={d}
                          className="dropdown-item"
                          onClick={() => { setForm({...form, designation: d}); setIsDropdownOpen(false); }}
                          style={{
                              padding: '12px 15px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderTop: '1px solid rgba(255,255,255,0.05)',
                              background: form.designation === d ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                              color: form.designation === d ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                              transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                              if (form.designation !== d) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                              e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                              e.currentTarget.style.background = form.designation === d ? 'rgba(59, 130, 246, 0.1)' : 'transparent';
                              e.currentTarget.style.color = form.designation === d ? '#60a5fa' : 'rgba(255,255,255,0.7)';
                          }}
                      >
                          <span>{d}</span>
                          {form.designation === d && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                  ))}
              </div>
            )}
          </div>
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate || ""}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />

          <button className="primary-btn">Create HR</button>
        </form>
      </div>
    </div>
  );
}

export default HrCreate;
