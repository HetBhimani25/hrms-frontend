import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../components/ToastContext";
import "../styles/login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      addToast("Enter a valid email", "warning");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
      addToast("If your email exists, a reset link was sent.", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to process request";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="login-right" style={{ width: '100%' }}>
            <div className="login-card fade-in">
              <header className="login-header">
                <h2 className="title-animated">Reset Password</h2>
                <p>Enter your email to receive a reset link</p>
              </header>

              {success ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
                  <h3 style={{ color: '#fff', marginBottom: '12px' }}>Check your email</h3>
                  <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                    We've sent password reset instructions to {email}
                  </p>
                  <button 
                    className="login-button" 
                    onClick={() => navigate("/login")}
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="login-form">
                  <div className="field-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      autoFocus
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <button className="login-button" disabled={loading} style={{ marginTop: '10px' }}>
                    {loading ? <span className="loader"></span> : "Send Reset Link"}
                  </button>
                  
                  <div className="forgot-row" style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <span
                      className="forgot-link"
                      onClick={() => navigate("/login")}
                    >
                      ← Back to Login
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
