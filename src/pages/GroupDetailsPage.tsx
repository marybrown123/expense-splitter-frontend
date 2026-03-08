import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getGroupBalances,
  getGroupById,
  getSettlementSuggestions,
} from "../api/groups";
import type { Group, GroupBalance, SettlementSuggestion } from "../types/group";

function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<GroupBalance[]>([]);
  const [suggestions, setSuggestions] = useState<SettlementSuggestion[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

console.log(balances);

  useEffect(() => {
    const loadGroupData = async () => {
      if (!id) {
        setError("Group id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const [groupData, balancesData, suggestionsData] = await Promise.all([
          getGroupById(id),
          getGroupBalances(id),
          getSettlementSuggestions(id),
        ]);

        setGroup(groupData);
        setBalances(balancesData);
        setSuggestions(suggestionsData);
      } catch {
        setError("Failed to load group details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupData();
  }, [id]);

  if (isLoading) {
    return <p>Loading group details...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  if (!group) {
    return (
      <div>
        <p>Group not found.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/dashboard">← Back to dashboard</Link>

      <h1>{group.name}</h1>
      <p>Currency: {group.currency}</p>
      <p>Owner: {group.ownerName}</p>
      <p>Created at: {new Date(group.createdAt).toLocaleString()}</p>

      <section>
        <h2>Balances</h2>

        {balances.length === 0 ? (
          <p>No balances yet.</p>
        ) : (
          <div>
            {balances.map((item) => (
              <div key={item.userId}>
                <h3>{item.username}</h3>
                <p>Paid: {item.paid.toFixed(2)}</p>
                <p>Owed: {item.owed.toFixed(2)}</p>
                <p>Balance: {item.balance.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Settlement suggestions</h2>

        {suggestions.length === 0 ? (
          <p>No settlement suggestions.</p>
        ) : (
          <div>
            {suggestions.map((item, index) => (
              <div key={`${item.fromUserId}-${item.toUserId}-${index}`}>
                <p>
                  {item.fromUsername} → {item.toUsername}
                </p>
                <p>Amount: {item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default GroupDetailsPage;