/* eslint-disable react-hooks/immutability */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllManagers,
  deleteManager,
  disableManager,
  enableManager,
} from "../../api/AdminServices/managerService";
import "../../styles/hr.css";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useToast } from "../../components/ToastContext";
import { Inbox } from "lucide-react";

export default function ManagerManagement() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const loadManagers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllManagers({ search, page, size: 8 });
      setManagers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      addToast(
        err.response?.data?.message || "Failed to load Manager data",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [search, page, addToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadManagers();
    }, 400);
    return () => clearTimeout(timer);
  }, [loadManagers]);

  const openModal = (manager, type) => {
    setSelectedManager(manager);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedManager(null);
    setModalType(null);
  };

  const handleConfirmAction = async () => {
    try {
      if (modalType === "delete") {
        await deleteManager(selectedManager.id);
        addToast("Manager deleted successfully", "success");
      } else if (modalType === "disable") {
        await disableManager(selectedManager.id);
        addToast("Manager account disabled", "warning");
      } else if (modalType === "enable") {
        await enableManager(selectedManager.id);
        addToast("Manager account enabled", "success");
      }
      loadManagers();
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
          <h2 className="hr-title">Manager Management</h2>
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
              onClick={() => navigate("/admin/manager/create")}
            >
              + Add Manager
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
              ) : managers.length > 0 ? (
                managers.map((manager) => (
                  <tr key={manager.id}>
                    <td>{manager.email}</td>
                    <td>{manager.fullName}</td>
                    <td>{manager.department}</td>
                    <td>{manager.designation}</td>
                    <td>{manager.phone}</td>
                    <td>
                      <span
                        className={`status-badge ${manager.status === "ACTIVE" ? "status-active" : "status-inactive"}`}
                      >
                        {manager.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="actions-cell">
                      <button
                        className="btn btn-outline"
                        onClick={() =>
                          navigate(`/admin/manager/edit/${manager.id}`)
                        }
                      >
                        Edit
                      </button>

                      {manager.status === "ACTIVE" ? (
                        <button
                          className="btn btn-warning"
                          onClick={() => openModal(manager, "disable")}
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          className="btn-success"
                          onClick={() => openModal(manager, "enable")}
                        >
                          Enable
                        </button>
                      )}

                      <button
                        className="btn btn-danger"
                        onClick={() => openModal(manager, "delete")}
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
                        <p>No Manager found for "{search}"</p>
                      ) : totalElements === 0 ? (
                        <>
                          <p>No Manager records found.</p>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              navigate("/admin/manager/create")
                            }
                          >
                            + Add First Manager
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
          modalType === "delete" ? 
            "Delete Manager Accounnt" 
            : modalType === "enable"
            ? "Enable Manager Account"
            : "Disable Manager Account"
        }
        message={
          modalType === "delete"
            ? "This action is permanent and cannot be undone."
            : modalType === "enable"
            ? "This Manager will now be able to log in and access the system."
            : "This Manager will no longer be able to log in."
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
        data={selectedManager}
      />
    </div>
  );
}
