import { useState } from "react";

interface AddMemberFormProps {
  onSubmit: (email: string) => Promise<void>;
}

function AddMemberForm({ onSubmit }: AddMemberFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await onSubmit(email);
      setEmail("");
    } catch {
      setError("Failed to add member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="label" htmlFor="member-email">
          Member email
        </label>

        <input
          id="member-email"
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="actions">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding member..." : "Add member"}
        </button>
      </div>
    </form>
  );
}

export default AddMemberForm;