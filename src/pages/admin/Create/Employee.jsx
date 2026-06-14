import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../../../api/HrServices/employeeService.js";
import "../../../styles/employee.css";


function EmployeeCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
  });

  const [loading , setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEmployee(form);
      navigate("/hr/employee");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to create Employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      {/* <div className="modal">
        <h3>Add HR</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <input
            name="department"
            placeholder="Department"
            onChange={handleChange}
          />
          <input
            name="designation"
            placeholder="Designation"
            onChange={handleChange}
          />
          <input type="date" name="joiningDate" onChange={handleChange} />

          <div className="modal-actions">
            <button type="submit">Create</button>
          </div>
        </form>
      </div> */}

      <div className="form-card">
        <h3>Create Employee</h3>

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
          <input
            name="department"  
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />
          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
          />
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate || ""}
            onChange={handleChange}
          />

          <button className="primary-btn">
            Create Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeCreate;