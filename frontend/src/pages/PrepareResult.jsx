import React, { useState, useEffect } from 'react';
import { saveStudentResult, updateStudentResult } from '../services/api';

const PrepareResult = ({ editingStudent, onResultSaved, showToast }) => {
  const [formData, setFormData] = useState({
    id: '',
    prn: '',
    name: '',
    branch: '',
    semester: '',
    dsMse: '',
    dsEse: '',
    dbmsMse: '',
    dbmsEse: '',
    osMse: '',
    osEse: '',
    tocMse: '',
    tocEse: '',
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      const student = editingStudent;
      const getSubjectMarks = (subName) => {
        const sr = student.subjectResults?.find((s) =>
          s.subjectName.toLowerCase().includes(subName)
        );
        return { mse: sr ? sr.mse : '', ese: sr ? sr.ese : '' };
      };

      const ds = getSubjectMarks('data structure');
      const dbms = getSubjectMarks('database');
      const os = getSubjectMarks('operating');
      const toc = getSubjectMarks('theory');

      setFormData({
        id: student.id || '',
        prn: student.prn || '',
        name: student.name || '',
        branch: student.branch || '',
        semester: student.semester ? String(student.semester) : '',
        dsMse: ds.mse !== '' ? ds.mse : '',
        dsEse: ds.ese !== '' ? ds.ese : '',
        dbmsMse: dbms.mse !== '' ? dbms.mse : '',
        dbmsEse: dbms.ese !== '' ? dbms.ese : '',
        osMse: os.mse !== '' ? os.mse : '',
        osEse: os.ese !== '' ? os.ese : '',
        tocMse: toc.mse !== '' ? toc.mse : '',
        tocEse: toc.ese !== '' ? toc.ese : '',
      });
      setValidated(false);
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'prn-input': 'prn',
      'name-input': 'name',
      'branch-select': 'branch',
      'semester-select': 'semester',
      'ds-mse': 'dsMse',
      'ds-ese': 'dsEse',
      'dbms-mse': 'dbmsMse',
      'dbms-ese': 'dbmsEse',
      'os-mse': 'osMse',
      'os-ese': 'osEse',
      'toc-mse': 'tocMse',
      'toc-ese': 'tocEse',
    };
    const key = fieldMap[id] || id;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFormData({
      id: '',
      prn: '',
      name: '',
      branch: '',
      semester: '',
      dsMse: '',
      dsEse: '',
      dbmsMse: '',
      dbmsEse: '',
      osMse: '',
      osEse: '',
      tocMse: '',
      tocEse: '',
    });
    setValidated(false);
    showToast('Form reset.', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      showToast('Please correct validation errors in the form before submitting.', 'danger');
      return;
    }

    setValidated(true);

    const payload = {
      prn: formData.prn.trim(),
      name: formData.name.trim(),
      branch: formData.branch,
      semester: parseInt(formData.semester, 10),
      subjects: [
        {
          subjectCode: 'CS201',
          subjectName: 'Data Structures',
          credits: 4,
          mse: parseFloat(formData.dsMse),
          ese: parseFloat(formData.dsEse),
        },
        {
          subjectCode: 'CS202',
          subjectName: 'Database Management Systems',
          credits: 4,
          mse: parseFloat(formData.dbmsMse),
          ese: parseFloat(formData.dbmsEse),
        },
        {
          subjectCode: 'CS203',
          subjectName: 'Operating Systems',
          credits: 4,
          mse: parseFloat(formData.osMse),
          ese: parseFloat(formData.osEse),
        },
        {
          subjectCode: 'CS204',
          subjectName: 'Theory of Computation',
          credits: 4,
          mse: parseFloat(formData.tocMse),
          ese: parseFloat(formData.tocEse),
        },
      ],
    };

    setLoading(true);
    try {
      let data;
      if (formData.id) {
        data = await updateStudentResult(formData.id, payload);
        showToast('Student result updated successfully!', 'success');
      } else {
        data = await saveStudentResult(payload);
        showToast('Semester result calculated & saved successfully!', 'success');
      }

      handleReset();
      onResultSaved(data);
    } catch (err) {
      console.error('Error saving result:', err);
      showToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="prepare-view" className="view-section active">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" id="form-header-title">
          {formData.id ? `Edit Result for PRN: ${formData.prn}` : 'Prepare Student Semester Result'}
        </h2>
        <p className="text-muted mb-0">
          Input student details and subject marks (MSE out of 30, ESE out of 100). Final result is computed by Spring Boot backend.
        </p>
      </div>

      <form
        id="result-form"
        className={`needs-validation ${validated ? 'was-validated' : ''}`}
        noValidate
        onSubmit={handleSubmit}
      >
        <input type="hidden" id="edit-student-id" value={formData.id} />

        {/* Student Details Card */}
        <div className="vit-card mb-4">
          <div className="vit-card-header">
            <h3 className="vit-card-title">
              <i className="bi bi-person-lines-fill text-primary"></i> Student Information
            </h3>
          </div>
          <div className="vit-card-body">
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="prn-input" className="form-label">
                  PRN (Permanent Registration No.) *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="prn-input"
                  placeholder="e.g. 22110045"
                  value={formData.prn}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Please provide a valid PRN.</div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="name-input" className="form-label">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name-input"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Student name is required.</div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="branch-select" className="form-label">
                  Branch / Department *
                </label>
                <select
                  className="form-select"
                  id="branch-select"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch...</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Artificial Intelligence & DS">Artificial Intelligence & DS</option>
                  <option value="Electronics & Telecomm">Electronics & Telecomm</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                </select>
                <div className="invalid-feedback">Please select a branch.</div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="semester-select" className="form-label">
                  Semester *
                </label>
                <select
                  className="form-select"
                  id="semester-select"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Semester...</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
                <div className="invalid-feedback">Please select a semester.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Table Card */}
        <div className="vit-card mb-4">
          <div className="vit-card-header">
            <h3 className="vit-card-title">
              <i className="bi bi-pencil-square text-primary"></i> Subject Marks Entry (4 Subjects)
            </h3>
            <span className="badge bg-light text-dark border">Weightage: MSE 30% | ESE 70%</span>
          </div>
          <div className="vit-card-body p-0 table-responsive">
            <table className="table vit-table align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '15%' }}>Subject Code</th>
                  <th style={{ width: '30%' }}>Subject Name</th>
                  <th style={{ width: '10%' }}>Credits</th>
                  <th style={{ width: '20%' }}>MSE Marks (0 - 30) *</th>
                  <th style={{ width: '20%' }}>ESE Marks (0 - 100) *</th>
                </tr>
              </thead>
              <tbody>
                {/* Subject 1 */}
                <tr>
                  <td className="fw-bold">1</td>
                  <td>
                    <span className="badge bg-secondary">CS201</span>
                  </td>
                  <td className="fw-semibold">Data Structures</td>
                  <td>
                    <span className="badge bg-primary">4</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      className="form-control mse-input"
                      id="ds-mse"
                      placeholder="0 - 30"
                      value={formData.dsMse}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">0 to 30 only</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      className="form-control ese-input"
                      id="ds-ese"
                      placeholder="0 - 100"
                      value={formData.dsEse}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">0 to 100 only</div>
                  </td>
                </tr>
                {/* Subject 2 */}
                <tr>
                  <td className="fw-bold">2</td>
                  <td>
                    <span className="badge bg-secondary">CS202</span>
                  </td>
                  <td className="fw-semibold">Database Management Systems</td>
                  <td>
                    <span className="badge bg-primary">4</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      className="form-control mse-input"
                      id="dbms-mse"
                      placeholder="0 - 30"
                      value={formData.dbmsMse}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">0 to 30 only</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      className="form-control ese-input"
                      id="dbms-ese"
                      placeholder="0 - 100"
                      value={formData.dbmsEse}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">0 to 100 only</div>
                  </td>
                </tr>
                {/* Subject 3 */}
                <tr>
                  <td className="fw-bold">3</td>
                  <td>
                    <span className="badge bg-secondary">CS203</span>
                  </td>
                  <td className="fw-semibold">Operating Systems</td>
                  <td>
                    <span className="badge bg-primary">4</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      className="form-control mse-input"
                      id="os-mse"
                      placeholder="0 - 30"
                      value={formData.osMse}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">0 to 30 only</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      className="form-control ese-input"
                      id="os-ese"
                      placeholder="0 - 100"
                      value={formData.osEse}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">0 to 100 only</div>
                  </td>
                </tr>
                {/* Subject 4 */}
                <tr>
                  <td className="fw-bold">4</td>
                  <td>
                    <span className="badge bg-secondary">CS204</span>
                  </td>
                  <td className="fw-semibold">Theory of Computation</td>
                  <td>
                    <span className="badge bg-primary">4</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      className="form-control mse-input"
                      id="toc-mse"
                      placeholder="0 - 30"
                      value={formData.tocMse}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">0 to 30 only</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      className="form-control ese-input"
                      id="toc-ese"
                      placeholder="0 - 100"
                      value={formData.tocEse}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">0 to 100 only</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap gap-3 justify-content-end mb-4">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            id="btn-reset-form"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-counterclockwise"></i> Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4"
            id="btn-save-result"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span> Calculating & Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill me-1"></i> Save Result & Generate Sheet
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PrepareResult;
