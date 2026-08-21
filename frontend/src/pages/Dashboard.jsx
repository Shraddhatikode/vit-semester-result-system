import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchAllStudents } from '../services/api';

const Dashboard = ({ onNavigate, onViewResult }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalResults: 0,
    averageSgpa: 0,
    passPercentage: 0,
    totalPassed: 0,
    totalFailed: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [errorRecent, setErrorRecent] = useState(false);

  useEffect(() => {
    loadStats();
    loadRecent();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats({
        totalStudents: data.totalStudents || 0,
        totalResults: data.totalResults || 0,
        averageSgpa: data.averageSgpa || 0,
        passPercentage: data.passPercentage || 0,
        totalPassed: data.totalPassed || 0,
        totalFailed: data.totalFailed || 0,
      });
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  };

  const loadRecent = async () => {
    setLoadingRecent(true);
    setErrorRecent(false);
    try {
      const students = await fetchAllStudents();
      setRecentStudents(students ? students.slice(0, 5) : []);
    } catch (err) {
      console.error('Error loading recent students:', err);
      setErrorRecent(true);
    } finally {
      setLoadingRecent(false);
    }
  };

  const passPct = stats.totalStudents > 0 ? (stats.totalPassed / stats.totalStudents) * 100 : 0;
  const failPct = stats.totalStudents > 0 ? (stats.totalFailed / stats.totalStudents) * 100 : 0;

  return (
    <section id="dashboard-view" className="view-section active">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Semester Result Dashboard</h2>
          <p className="text-muted mb-0">Overview of student academic performance and results statistics.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 nav-trigger"
          onClick={() => onNavigate('prepare-view')}
        >
          <i className="bi bi-plus-lg"></i> Prepare New Result
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card blue">
            <div className="stat-icon-box">
              <i className="bi bi-people"></i>
            </div>
            <div className="stat-value" id="stat-total-students">
              {stats.totalStudents}
            </div>
            <div className="stat-label">Total Students Enrolled</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card amber">
            <div className="stat-icon-box">
              <i className="bi bi-journal-check"></i>
            </div>
            <div className="stat-value" id="stat-total-results">
              {stats.totalResults}
            </div>
            <div className="stat-label">Total Results Generated</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card purple">
            <div className="stat-icon-box">
              <i className="bi bi-graph-up-arrow"></i>
            </div>
            <div className="stat-value" id="stat-avg-sgpa">
              {stats.averageSgpa.toFixed(2)}
            </div>
            <div className="stat-label">Average SGPA Score</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card green">
            <div className="stat-icon-box">
              <i className="bi bi-trophy"></i>
            </div>
            <div className="stat-value" id="stat-pass-percentage">
              {stats.passPercentage.toFixed(1)}%
            </div>
            <div className="stat-label">Pass Percentage</div>
          </div>
        </div>
      </div>

      {/* Dashboard Details Row */}
      <div className="row g-4">
        {/* Recent Students Table */}
        <div className="col-12 col-xl-8">
          <div className="vit-card">
            <div className="vit-card-header">
              <h3 className="vit-card-title">
                <i className="bi bi-clock-history text-primary"></i> Recent Result Submissions
              </h3>
              <button
                className="btn btn-sm btn-outline-primary nav-trigger"
                onClick={() => onNavigate('students-view')}
              >
                View All Students
              </button>
            </div>
            <div className="vit-card-body p-0 table-responsive">
              <table className="table vit-table mb-0">
                <thead>
                  <tr>
                    <th>PRN</th>
                    <th>Student Name</th>
                    <th>Branch</th>
                    <th>Semester</th>
                    <th>SGPA</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="recent-students-tbody">
                  {loadingRecent ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div> Loading recent records...
                      </td>
                    </tr>
                  ) : errorRecent ? (
                    <tr>
                      <td colSpan="7" className="text-center text-danger py-3">
                        Failed to load recent student records.
                      </td>
                    </tr>
                  ) : recentStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No student results created yet. Click "Prepare Result" to get started!
                      </td>
                    </tr>
                  ) : (
                    recentStudents.map((student) => (
                      <tr key={student.id || student.prn}>
                        <td className="fw-bold">{student.prn}</td>
                        <td>{student.name}</td>
                        <td>
                          <span className="badge bg-light text-dark border">{student.branch}</span>
                        </td>
                        <td>Sem {student.semester}</td>
                        <td className="fw-bold text-primary">{student.sgpa.toFixed(2)}</td>
                        <td>
                          {student.resultStatus === 'PASS' ? (
                            <span className="badge-pass">
                              <i className="bi bi-check-circle-fill"></i> PASS
                            </span>
                          ) : (
                            <span className="badge-fail">
                              <i className="bi bi-x-circle-fill"></i> FAIL
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onViewResult(student.prn)}
                          >
                            <i className="bi bi-eye-fill"></i> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Stats & Quick Info */}
        <div className="col-12 col-xl-4">
          <div className="vit-card mb-4">
            <div className="vit-card-header">
              <h3 className="vit-card-title">
                <i className="bi bi-pie-chart text-primary"></i> Pass vs Fail Summary
              </h3>
            </div>
            <div className="vit-card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold text-success">
                    <i className="bi bi-check-circle-fill"></i> Passed Students
                  </span>
                  <span className="fw-bold" id="pass-count">
                    {stats.totalPassed}
                  </span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    id="pass-bar"
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${passPct}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold text-danger">
                    <i className="bi bi-x-circle-fill"></i> Failed Students
                  </span>
                  <span className="fw-bold" id="fail-count">
                    {stats.totalFailed}
                  </span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    id="fail-bar"
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: `${failPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade System Card */}
          <div className="vit-card">
            <div className="vit-card-header">
              <h3 className="vit-card-title">
                <i className="bi bi-award text-primary"></i> Grading Scheme Rules
              </h3>
            </div>
            <div className="vit-card-body p-0">
              <ul className="list-group list-group-flush small">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>90 – 100 Marks</span>
                  <span className="badge grade-badge grade-O">Grade O (Point: 10)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>80 – 89 Marks</span>
                  <span className="badge grade-badge grade-A-plus">Grade A+ (Point: 9)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>70 – 79 Marks</span>
                  <span className="badge grade-badge grade-A">Grade A (Point: 8)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>60 – 69 Marks</span>
                  <span className="badge grade-badge grade-B-plus">Grade B+ (Point: 7)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>50 – 59 Marks</span>
                  <span className="badge grade-badge grade-B">Grade B (Point: 6)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>40 – 49 Marks</span>
                  <span className="badge grade-badge grade-C">Grade C (Point: 5)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Below 40 Marks</span>
                  <span className="badge grade-badge grade-F">Grade F (Point: 0)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
