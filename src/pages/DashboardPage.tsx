import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createGroup, getGroups } from "../api/groups";
import { useAuth } from "../context/AuthContext";
import type { Group } from "../types/group";

function DashboardPage() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("PLN");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadGroups = async () => {
    try {
      setError("");
      const data = await getGroups();
      setGroups(data);
    } catch {
      setError("Failed to load groups.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setIsCreating(true);

      await createGroup({
        name,
        currency,
      });

      setName("");
      setCurrency("PLN");

      await loadGroups();
    } catch {
      setError("Failed to create group.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Manage your groups and shared expenses.
            </p>
          </div>

          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h2 className="section-title">Create group</h2>
            <p className="section-subtitle">
              Start a new group and split expenses with others.
            </p>

            <form className="form" onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label className="label" htmlFor="group-name">
                  Group name
                </label>
                <input
                  id="group-name"
                  className="input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="group-currency">
                  Currency
                </label>
                <input
                  id="group-currency"
                  className="input"
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                />
              </div>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create group"}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="section-title">Your groups</h2>
            <p className="section-subtitle">
              Open an existing group to view balances and expenses.
            </p>

            {error && <div className="error-box">{error}</div>}

            {isLoading ? (
              <p className="text-muted">Loading groups...</p>
            ) : groups.length === 0 ? (
              <div className="empty-state">No groups yet.</div>
            ) : (
              <div className="grid">
                {groups.map((group) => (
                  <div key={group.id} className="card">
                    <div className="actions" style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0 }}>{group.name}</h3>
                      <span className="badge">{group.currency}</span>
                    </div>

                    <p className="text-muted" style={{ marginTop: "12px", marginBottom: "16px" }}>
                      Manage expenses, balances and settlements for this group.
                    </p>

                    <Link className="btn btn-primary" to={`/groups/${group.id}`}>
                      Open group
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;