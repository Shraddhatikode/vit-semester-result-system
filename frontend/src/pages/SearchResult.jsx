import React, { useState } from 'react';
import { searchStudents } from '../services/api';

const SearchResult = ({ onViewResult, showToast }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const query = searchInput.trim();
    if (!query) {
      showToast('Please enter a PRN or Student Name to search.', 'danger');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const results = await searchStudents(query);
      setSearchResults(results || []);
    } catch (err) {
      console.error('Error executing search:', err);
      showToast('Error searching records.', 'danger');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section id="search-view" className="view-section active">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Search Student Result</h2>
        <p className="text-muted mb-0">Search academic performance record by PRN or Student Name.</p>
      </div>

      <div className="vit-card mb-4">
        <div className="vit-card-body">
          <div className="row g-3">
            <div className="col-12 col-md-9">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  id="search-input"
                  className="form-control form-control-lg"
                  placeholder="Type PRN (e.g. 22110045) or Student Name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <button
                className="btn btn-primary btn-lg w-100"
                id="btn-search-trigger"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span> Searching...
                  </>
                ) : (
                  'Search Records'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Output */}
      <div className="vit-card">
        <div className="vit-card-header">
          <h3 className="vit-card-title">Search Results</h3>
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
            <tbody id="search-results-tbody">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-3 text-muted">
                    <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div> Searching...
                  </td>
                </tr>
              ) : !searched ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Enter PRN or Name above to search...
                  </td>
                </tr>
              ) : searchResults.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No student found matching query "{searchInput}"
                  </td>
                </tr>
              ) : (
                searchResults.map((s) => (
                  <tr key={s.id || s.prn}>
                    <td className="fw-bold">{s.prn}</td>
                    <td>{s.name}</td>
                    <td>{s.branch}</td>
                    <td>Sem {s.semester}</td>
                    <td className="fw-bold text-primary">{s.sgpa.toFixed(2)}</td>
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
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onViewResult(s.prn)}
                      >
                        <i className="bi bi-file-earmark-text me-1"></i> View Grade Sheet
                      </button>
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

export default SearchResult;
