export default function StudentCard({ student, onDelete}) {
  const {id, name, age, email, city = 'Unknown'} =  student

  return (
    <div className="sma-student-card">
      <div className="sma-student-card-avatar">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="sma-student-card-body">
        <h3 className="sma-student-card-name">{name}</h3>
        <p className="sma-student-card-detail">{email}</p>
        <div className="sma-student-card-footer">
          <span className="sma-student-card-age">Age {age}</span>
          <span className="sma-student-card-tag">{city}</span>
        </div>
      </div>
      <div className="sma-card-actions">
        <button
          className="sma-btn-icon sma-btn-icon-delete"
          onClick={() => onDelete(id)}
          title="Delete student"
        >
          DELETE
        </button>
      </div>
    </div>
  )
}