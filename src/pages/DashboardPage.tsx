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
    <div className="card-list">
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Create group</h2>
      <form onSubmit={handleCreateGroup}>
        <div>
          <label htmlFor="group-name">Group name</label>
          <input
            id="group-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="group-currency">Currency</label>
          <input
            id="group-currency"
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create group"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <h2>Your groups</h2>

      {isLoading ? (
        <p>Loading groups...</p>
      ) : groups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        <div>
          {groups.map((group) => (
        <div key={group.id} className="card">
              <h3>{group.name}</h3>
              <p>Currency: {group.currency}</p>
              <Link to={`/groups/${group.id}`}>Open group</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;