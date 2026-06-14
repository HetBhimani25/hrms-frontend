/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHrs, deleteHr } from "../../../api/AdminServices/hrService";
// import { getAllHrs, deleteHr, toggleHrStatus } from "../../api/hrService";

export default function HrList() {
  const [hrs, setHrs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHrs();
  }, []);

  const loadHrs = async () => {
    try {
      const res = await getAllHrs();
      setHrs(res.data);
    } catch {
      alert("Failed to load HRs");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this HR?")) {
      await deleteHr(id);
      loadHrs();
    }
  };

  return (
    // <div>
    //   <h2>HR Management</h2>

    //   <button onClick={() => navigate("/admin/hr/create")}>
    //     + Add HR
    //   </button>

    //   <table border="1" cellPadding="8">
    //     <thead>
    //       <tr>
    //         <th>Email</th>
    //         <th>Name</th>
    //         <th>Department</th>
    //         <th>Designation</th>
    //         <th>Phone</th>
    //         <th>Joining Date</th>
    //         <th>Status</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>

    //     <tbody>
    //       {hrs.map((hr) => (
    //         <tr key={hr.id}>
    //           <td>{hr.email}</td>
    //           <td>{hr.fullName}</td>
    //           <td>{hr.department}</td>
    //           <td>{hr.designation}</td>
    //           <td>{hr.phone}</td>
    //           <td>{hr.joiningDate}</td>
    //           <td>{hr.status}</td>
    //           <td>
    //             {/* <button onClick={() => handleStatus(hr.id)}>
    //               Toggle
    //             </button> */}
    //             <button onClick={() => navigate(`/admin/hr/edit/${hr.id}`)}>
    //               Edit
    //             </button>
    //             <button onClick={() => handleDelete(hr.id)}>
    //               Delete
    //             </button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>

    <div className="hr-page">
      <div className="hr-header">
        <h2>HR Management</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/admin/hr/create")}
        >
          + Add HR
        </button>
      </div>

      <table className="hr-table">
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
          {hrs.map((hr) => (
            <tr key={hr.id}>
              <td>{hr.fullName}</td>
              <td>{hr.email}</td>
              <td>{hr.department}</td>
              <td>
                <span className={`status ${hr.status.toLowerCase()}`}>
                  {hr.status}
                </span>
              </td>
              <td className="actions">
                <button onClick={() => navigate(`/admin/hr/edit/${hr.id}`)}>
                  Edit
                </button>
                {/* <button onClick={() => handleDisable(hr.id)}>Disable</button> */}
                <button className="danger" onClick={() => handleDelete(hr.id)}>
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
