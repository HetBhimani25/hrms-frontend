/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHrById, updateHr } from "../../../api/AdminServices/hrService";
import "../../../styles/hr.css";
import { useToast } from "../../../components/ToastContext";

export default function HrEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
  });

  useEffect(() => {
    loadHr();
  }, []);

  const loadHr = async () => {
    const res = await getHrById(id);
    setForm(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateHr(id, form);
      addToast("HR updated successfully!", "success");
      navigate("/admin/hr");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update HR", "error");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h3>Edit HR</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
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
            placeholder="Human Resource"
            value={form.department}
            onChange={handleChange}
            readOnly
          />
          <select name="designation" value={form.designation} onChange={handleChange} required>            
            <option value="Junior HR Associate">Junior HR Associate</option>
            <option value="Senior HR Specialist">Senior HR Specialist</option>
            <option value="HR Manager">HR Manager</option>
          </select>
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate || ""}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />
          <button className="primary-btn">Edit HR</button>
        </form>
      </div>
    </div>
  );
}
