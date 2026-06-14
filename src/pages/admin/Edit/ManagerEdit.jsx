/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getManagerById,
  updateManager,
} from "../../../api/AdminServices/managerService";
import "../../../styles/manager.css";
import "../../../styles/hr.css";
import { useToast } from "../../../components/ToastContext";

export default function ManagerEdit() {
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
    loadManager();
  }, []);

  const loadManager = async () => {
    const res = await getManagerById(id);
    setForm(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateManager(id, form);
      addToast("Manager updated successfully!", "success");
      navigate("/admin/manager");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update Manager", "error");
    }
  };

  return (
    
    <div className="form-wrapper">
      <div className="form-card">
        <h3>Edit Manager</h3>

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
          <select name="department" value={form.department} onChange={handleChange} required>            
            <option value="Software Engineering">Software Engineering</option>
            <option value="Quality Assurance">Quality Assurance</option>
            <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
            <option value="Product Management">Product Management</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Data Science & AI">Data Science & AI</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="IT Support">IT Support</option>
            <option value="Finance & Administration">Finance & Administration</option>
          </select>
          <select name="designation" value={form.designation} onChange={handleChange} required>                  
            <option value="Project Manager">Project Manager</option>
            <option value="Senior Manager">Senior Manager</option>
            <option value="Senior Manager">Junior Manager</option>          
          </select>
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate || ""}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />

          <button className="primary-btn">Edit MANAGER</button>
        </form>
      </div>
    </div>
  );
}
