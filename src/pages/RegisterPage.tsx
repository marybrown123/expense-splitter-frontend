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
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;