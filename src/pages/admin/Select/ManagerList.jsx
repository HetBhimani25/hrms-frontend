/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllManagers ,deleteManager,} from "../../../api/AdminServices/managerService";
import "../../../styles/manager.css";


export default function ManagerList() {
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {    
      const res = await getAllManagers();
      setManagers(res.data);
    } catch{
      alert("Failed to load Managers");    
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this MANAGER?")) {
      await deleteManager(id);
      loadManagers();
    }
  };

  return (    
    <div className="manager-page">
      <div className="manager-header">
        <h2>MANAGER Management</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/admin/manager/create")}
        >
          + Add MANAGER
        </button>
      </div>

      <table className="manager-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {managers.map((manager) => (
            <tr key={manager.id}>
              <td>{manager.fullName}</td>
              <td>{manager.email}</td>
              <td>{manager.department}</td>
              <td>
                <span
                  className={`status-badge ${
                    manager.status === "ACTIVE"
                      ? "status-active"
                      : manager.status === "DISABLED"
                      ? "status-disabled"
                      : "status-inactive"
                  }`}
                >
                  {manager.status}
                </span>
              </td>
              <td className="actions">
                <button
                  onClick={() => navigate(`/admin/manager/edit/${manager.id}`)}
                >
                  Edit
                </button>
                {/* <button onClick={() => handleDisable(hr.id)}>Disable</button> */}
                <button
                  className="danger"
                  onClick={() => handleDelete(manager.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}