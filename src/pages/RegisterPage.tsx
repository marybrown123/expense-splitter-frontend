import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await register({ username, email, password });
      loginUser(response.token);
      navigate("/dashboard");
    } catch {
      setError("Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container" style={{ maxWidth: "520px" }}>
        <div className="card">
          <div className="page-header" style={{ marginBottom: "20px" }}>
            <div>
              <h1 className="page-title">Register</h1>
              <p className="page-subtitle">
                Create an account and start managing shared expenses.
              </p>
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: "16px" }}>
              <div className="error-box">{error}</div>
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                className="input"
                type="password"
                value={password}
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="divider" />

          <p className="text-muted" style={{ margin: 0 }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "var(--primary)", fontWeight: 600 }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;