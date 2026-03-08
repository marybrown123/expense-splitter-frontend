import type { GroupMember } from "../types/member";

interface MemberListProps {
  members: GroupMember[];
}

function MemberList({ members }: MemberListProps) {
  if (members.length === 0) {
    return <div className="empty-state">No members yet.</div>;
  }

  return (
    <div
      style={{
        maxHeight: "420px",
        overflowY: "auto",
        paddingRight: "6px",
        scrollbarGutter: "stable",
      }}
    >
      <div className="grid grid-2">
        {members.map((member) => (
          <div key={member.userId} className="card">
            <div
              className="actions"
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0 }}>{member.username}</h3>

              {member.role === "Owner" && (
                <span className="badge">Owner</span>
              )}
            </div>

            <p className="text-muted" style={{ margin: 0 }}>
              Joined {new Date(member.joinedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberList;