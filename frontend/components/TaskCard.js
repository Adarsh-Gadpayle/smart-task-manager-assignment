export default function TaskCard({ task, onEdit, onDelete, onComplete }) {
  return (
    <article className="task-card">
      <div className="task-head">
        <div>
          <h3>{task.title}</h3>
          <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
          <span className={`badge status-${task.status.replaceAll(" ", "-").toLowerCase()}`}>{task.status}</span>
        </div>
        {task.isBlocked && task.status !== "Done" && <span className="blocked">Blocked</span>}
      </div>

      <p>{task.description || "No description."}</p>

      <div className="task-meta">
        <span><strong>Assigned:</strong> {task.assignedUser || "Unassigned"}</span>
        <span><strong>Dependencies:</strong> {task.dependencies.length || "None"}</span>
      </div>

      {task.dependencies.length > 0 && (
        <div className="dependencies">
          {task.dependencies.map((dependency) => (
            <span key={dependency.id} className={dependency.status === "Done" ? "dep done" : "dep"}>
              {dependency.title} — {dependency.status}
            </span>
          ))}
        </div>
      )}

      <div className="card-actions">
        {task.status !== "Done" && (
          <button className="success" disabled={task.isBlocked} onClick={onComplete}>
            Mark Done
          </button>
        )}
        <button className="secondary" onClick={onEdit}>Edit</button>
        <button className="danger" onClick={onDelete}>Delete</button>
      </div>
    </article>
  );
}
