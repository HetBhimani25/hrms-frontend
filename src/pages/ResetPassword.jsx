import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../components/ToastContext";
import "../styles/login.css";

function ResetPassword() {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      addToast("Invalid or missing reset token.", "error");
      navigate("/login");
    }
  }, [token, navigate, addToast]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      addToast("Password must be at least 6 characters", "warning");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      addToast("Passwords do not match", "warning");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { 
        token, 
        newPassword: form.newPassword 
      });
      addToast("Password reset successfully! You can now log in.", "success");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="login-right" style={{ width: '100%' }}>
            <div className="login-card fade-in">
              <header className="login-header">
                <h2 className="title-animated">Create New Password</h2>
                <p>Enter your new password below</p>
              </header>

              <form onSubmit={handleReset} className="login-form">
                <div className="field-group">
                  <label>New Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={form.newPassword}
                      autoFocus
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label>Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Type password again"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <button className="login-button" disabled={loading} style={{ marginTop: '10px' }}>
                  {loading ? <span className="loader"></span> : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
