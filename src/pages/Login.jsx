import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { useToast } from "../components/ToastContext";
import "../styles/login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const navigate = useNavigate();
  const { login, auth } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!auth?.roles) return;

    const roleRoutes = {
      ROLE_ADMIN: "/admin",
      ROLE_HR: "/hr",
      ROLE_MANAGER: "/manager",
      ROLE_EMPLOYEE: "/employee",
    };

    const userRole = auth.roles.find((r) => roleRoutes[r]);
    navigate(roleRoutes[userRole] || "/employee");
  }, [auth, navigate]);

  const validate = () => {
    if (!form.email.includes("@")) return "Enter a valid email";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      addToast(validationError, "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      addToast(`Welcome back, ${res.data.fullName}!`, "success");
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || err.message || "Login failed";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-container">

          <div className="login-left">
            <div className="login-left-content fade-in">
              <h1>HRMS Portal</h1>
              <p>Manage employees, roles & growth securely</p>
            </div>
          </div>

          <div className="login-right">
            <div className="login-card fade-in">
              <header className="login-header">
                <h2 className="title-animated">Welcome Back</h2>
                <p>Sign in to continue</p>
              </header>

              <form onSubmit={handleLogin} className="login-form">
                <div className="field-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="example@hrms.com"
                    value={form.email}
                    autoFocus
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="field-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
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

                <div className="forgot-row">
                  <span
                    className="forgot-link"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </span>
                </div>

                <button className="login-button" disabled={loading}>
                  {loading ? <span className="loader"></span> : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
