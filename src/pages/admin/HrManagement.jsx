/* eslint-disable react-hooks/immutability */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllHrs,
  deleteHr,
  disableHr,
  enableHr
} from "../../api/AdminServices/hrService";
import "../../styles/hr.css";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useToast } from "../../components/ToastContext";
import { Inbox } from "lucide-react";

export default function HrManagement() {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedHr, setSelectedHr] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToast();


  const loadHrs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllHrs({ search, page, size: 8 });
      setHrs(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to load HR data", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, addToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHrs();
    }, 400);
    return () => clearTimeout(timer);
  }, [loadHrs]);

  const openModal = (hr, type) => {
    setSelectedHr(hr);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHr(null);
    setModalType(null);
  };

  const handleConfirmAction = async () => {
    try {
      if (modalType === "delete") {
        await deleteHr(selectedHr.id);
        addToast("HR deleted successfully", "error");
      } else if (modalType === "disable") {
        await disableHr(selectedHr.id);
        addToast("HR account disabled", "warning");
      } else if (modalType === "enable") {
        await enableHr(selectedHr.id);
        addToast("HR account enabled", "success");
      }
      loadHrs();
    } catch (err) {
      addToast(err.response?.data?.message || "Operation failed", "error");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="hr-page">
      <div className="hr-card">
        <div className="hr-header">
          <h2 className="hr-title">HR Management</h2>
          <div className="hr-header-actions">
            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(0);
              }}
            />

            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/hr/create")}
            >
              + Add HR
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    Loading...
                  </td>
                </tr>
              ) : hrs.length > 0 ? (
                hrs.map((hr) => (
                  <tr key={hr.id}>
                    <td>{hr.email}</td>
                    <td>{hr.fullName}</td>
                    <td>{hr.department}</td>
                    <td>{hr.designation}</td>
                    <td>{hr.phone}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          hr.status === "ACTIVE"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {hr.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="actions-cell">
                      <button
                        className="btn btn-outline"
                        onClick={() =>
                          navigate(`/admin/hr/edit/${hr.id}`)
                        }
                      >
                        Edit
                      </button>

                      {hr.status === "ACTIVE" ? (
                        <button
                          className="btn btn-warning"
                          onClick={() => openModal(hr, "disable")}
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          className="btn-success"
                          onClick={() => openModal(hr, "enable")}
                        >
                          Enable
                        </button>
                      )}

                      <button
                        className="btn btn-danger"
                        onClick={() => openModal(hr, "delete")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-row">
                    <div className="empty-state">
                      <Inbox size={48} style={{ opacity: 0.5 }} />

                      {search ? (
                        <p>No HR found for "{search}"</p>
                      ) : totalElements === 0 ? (
                        <>
                          <p>No HR records found.</p>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              navigate("/admin/hr/create")
                            }
                          >
                            + Add First HR
                          </button>
                        </>
                      ) : (
                        <p>No data available on this page.</p>
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

      <ConfirmationDialog
        isOpen={showModal}
        title={
          modalType === "delete"
            ? "Delete HR Account"
            : modalType === "enable"
            ? "Enable HR Account"
            : "Disable HR Account"
        }
        message={
          modalType === "delete"
            ? "This action is permanent and cannot be undone."
            : modalType === "enable"
            ? "This HR will now be able to log in and access the system."
            : "This HR will no longer be able to log in."
        }
        confirmText={
          modalType === "delete"
            ? "Delete"
            : modalType === "enable"
            ? "Enable"
            : "Disable"
        }
        confirmColor={
          modalType === "delete"
            ? "var(--danger)"
            : modalType === "enable"
            ? "var(--success)"
            : "var(--warning)"
        }
        onConfirm={handleConfirmAction}
        onCancel={closeModal}
        data={selectedHr}
      />
    </div>
  );
}