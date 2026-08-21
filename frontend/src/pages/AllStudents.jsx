import React, { useEffect, useState } from 'react';
import { fetchAllStudents, deleteStudentResult } from '../services/api';

const AllStudents = ({ onNavigate, onViewResult, onEditResult, showToast }) => {
  const [students, setStudents] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchAllStudents();
      setStudents(data || []);
    } catch (err) {
      console.error('Error loading all students:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, prn) => {
    if (
      window.confirm(
        `Are you sure you want to delete result record for PRN: ${prn}? This action cannot be undone.`
      )
    ) {
      try {
        await deleteStudentResult(id);
        showToast(`Deleted student record PRN: ${prn}`, 'success');
        loadStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        showToast(err.message, 'danger');
      }
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = filterQuery.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.prn && s.prn.toLowerCase().includes(q)) ||
      (s.branch && s.branch.toLowerCase().includes(q))
    );
  });

  return (
    <section id="students-view" className="view-section active">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">All Student Records</h2>
          <p className="text-muted mb-0">List of all registered students with calculated results.</p>
        </div>
        <button
          className="btn btn-primary nav-trigger"
          onClick={() => onNavigate('prepare-view')}
        >
          <i className="bi bi-plus-circle-fill me-1"></i> Add Student
        </button>
      </div>

      <div className="vit-card">
        <div className="vit-card-header d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <h3 className="vit-card-title">Registered Students Database</h3>
          <div className="d-flex gap-2" style={{ maxWidth: '350px' }}>
            <input
              type="text"
              id="filter-students-input"
              className="form-control form-control-sm"
              placeholder="Filter by Name/PRN..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="vit-card-body p-0 table-responsive">
          <table className="table vit-table align-middle mb-0">
            <thead>
              <tr>
                <th># ID</th>
                <th>PRN</th>
                <th>Student Name</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Total Marks</th>
                <th>SGPA</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody id="all-students-tbody">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div> Loading student list...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="text-center text-danger py-3">
                    Error fetching student records. Please ensure Spring Boot backend is running.
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id || s.prn}>
                    <td className="text-muted">#{s.id}</td>
                    <td className="fw-bold">{s.prn}</td>
                    <td>{s.name}</td>
                    <td>{s.branch}</td>
                    <td>Sem {s.semester}</td>
                    <td className="fw-bold">{s.totalMarks ? s.totalMarks.toFixed(2) : '0.00'}</td>
                    <td className="fw-bold text-primary">{s.sgpa ? s.sgpa.toFixed(2) : '0.00'}</td>
                    <td>
                      {s.resultStatus === 'PASS' ? (
                        <span className="badge-pass">
                          <i className="bi bi-check-circle-fill"></i> PASS
                        </span>
                      ) : (
                        <span className="badge-fail">
                          <i className="bi bi-x-circle-fill"></i> FAIL
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          title="View Result Sheet"
                          onClick={() => onViewResult(s.prn)}
                        >
                          <i className="bi bi-file-earmark-text"></i>
                        </button>
                        <button
                          className="btn btn-outline-warning"
                          title="Edit Result"
                          onClick={() => onEditResult(s.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete Student"
                          onClick={() => handleDelete(s.id, s.prn)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AllStudents;
