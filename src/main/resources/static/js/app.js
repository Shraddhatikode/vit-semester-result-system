/**
 * VIT Student Semester Result Preparation System - Frontend JavaScript App
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial Setup
    initNavigation();
    initFormHandling();
    initSearch();
    loadDashboardStats();
    loadRecentStudents();
    loadAllStudents();
});

// Global API Base URL
const API_BASE_URL = '/api';

// Current active student data for result sheet view
let currentStudentResult = null;

/* -------------------------------------------------------------
 * 1. Navigation & View Switching Logic
 * ------------------------------------------------------------- */
function initNavigation() {
    const navTriggers = document.querySelectorAll('.nav-trigger, .vit-nav-item');

    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetViewId = trigger.getAttribute('data-view');
            if (targetViewId) {
                switchView(targetViewId);
            }
        });
    });
}

function switchView(viewId) {
    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });

    // Deactivate all navbar links
    document.querySelectorAll('.vit-nav-item').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === viewId) {
            link.classList.add('active');
        }
    });

    // Show selected section
    const targetSection = document.getElementById(viewId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Refresh view-specific data
    if (viewId === 'dashboard-view') {
        loadDashboardStats();
        loadRecentStudents();
    } else if (viewId === 'students-view') {
        loadAllStudents();
    }
}

/* -------------------------------------------------------------
 * 2. Toast Notification Utility
 * ------------------------------------------------------------- */
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    const toastMessageEl = document.getElementById('toast-message');

    toastEl.className = `toast align-items-center text-white border-0 bg-${type === 'success' ? 'success' : 'danger'}`;
    toastMessageEl.textContent = message;

    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
}

/* -------------------------------------------------------------
 * 3. Dashboard Statistics & Recent Records
 * ------------------------------------------------------------- */
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');

        const stats = await response.json();

        document.getElementById('stat-total-students').textContent = stats.totalStudents || 0;
        document.getElementById('stat-total-results').textContent = stats.totalResults || 0;
        document.getElementById('stat-avg-sgpa').textContent = (stats.averageSgpa || 0).toFixed(2);
        document.getElementById('stat-pass-percentage').textContent = `${(stats.passPercentage || 0).toFixed(1)}%`;

        // Update Pass vs Fail Progress Bars
        const passCount = stats.totalPassed || 0;
        const failCount = stats.totalFailed || 0;
        const total = stats.totalStudents || 0;

        document.getElementById('pass-count').textContent = passCount;
        document.getElementById('fail-count').textContent = failCount;

        const passPct = total > 0 ? (passCount / total) * 100 : 0;
        const failPct = total > 0 ? (failCount / total) * 100 : 0;

        document.getElementById('pass-bar').style.width = `${passPct}%`;
        document.getElementById('fail-bar').style.width = `${failPct}%`;

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentStudents() {
    const tbody = document.getElementById('recent-students-tbody');
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch student list');

        const students = await response.json();
        
        if (!students || students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No student results created yet. Click "Prepare Result" to get started!</td></tr>`;
            return;
        }

        // Show recent 5 students
        const recent = students.slice(0, 5);
        tbody.innerHTML = recent.map(student => `
            <tr>
                <td class="fw-bold">${escapeHtml(student.prn)}</td>
                <td>${escapeHtml(student.name)}</td>
                <td><span class="badge bg-light text-dark border">${escapeHtml(student.branch)}</span></td>
                <td>Sem ${student.semester}</td>
                <td class="fw-bold text-primary">${student.sgpa.toFixed(2)}</td>
                <td>${getStatusBadge(student.resultStatus)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewResultByPrn('${escapeHtml(student.prn)}')">
                        <i class="bi bi-eye-fill"></i> View
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error loading recent students:', error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-3">Failed to load recent student records.</td></tr>`;
    }
}

/* -------------------------------------------------------------
 * 4. All Students Database View & Delete
 * ------------------------------------------------------------- */
async function loadAllStudents() {
    const tbody = document.getElementById('all-students-tbody');
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');

        const students = await response.json();
        renderAllStudentsTable(students);

        // Bind quick search filter inside table
        const filterInput = document.getElementById('filter-students-input');
        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = students.filter(s => 
                    s.name.toLowerCase().includes(query) || 
                    s.prn.toLowerCase().includes(query) ||
                    s.branch.toLowerCase().includes(query)
                );
                renderAllStudentsTable(filtered);
            });
        }

    } catch (error) {
        console.error('Error loading all students:', error);
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger py-3">Error fetching student records. Please ensure Spring Boot backend is running.</td></tr>`;
    }
}

function renderAllStudentsTable(students) {
    const tbody = document.getElementById('all-students-tbody');
    if (!students || students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No student records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = students.map(s => `
        <tr>
            <td class="text-muted">#${s.id}</td>
            <td class="fw-bold">${escapeHtml(s.prn)}</td>
            <td>${escapeHtml(s.name)}</td>
            <td>${escapeHtml(s.branch)}</td>
            <td>Sem ${s.semester}</td>
            <td class="fw-bold">${s.totalMarks.toFixed(2)}</td>
            <td class="fw-bold text-primary">${s.sgpa.toFixed(2)}</td>
            <td>${getStatusBadge(s.resultStatus)}</td>
            <td class="text-center">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="View Result Sheet" onclick="viewResultByPrn('${escapeHtml(s.prn)}')">
                        <i class="bi bi-file-earmark-text"></i>
                    </button>
                    <button class="btn btn-outline-warning" title="Edit Result" onclick="editStudentResult(${s.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" title="Delete Student" onclick="confirmDeleteStudent(${s.id}, '${escapeHtml(s.prn)}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/* -------------------------------------------------------------
 * 5. Form Handling & Save Result API
 * ------------------------------------------------------------- */
function initFormHandling() {
    const form = document.getElementById('result-form');
    const resetBtn = document.getElementById('btn-reset-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            showToast('Please correct validation errors in the form before submitting.', 'danger');
            return;
        }

        // Gather form payload
        const editId = document.getElementById('edit-student-id').value;
        const payload = {
            prn: document.getElementById('prn-input').value.trim(),
            name: document.getElementById('name-input').value.trim(),
            branch: document.getElementById('branch-select').value,
            semester: parseInt(document.getElementById('semester-select').value, 10),
            subjects: [
                {
                    subjectCode: 'CS201',
                    subjectName: 'Data Structures',
                    credits: 4,
                    mse: parseFloat(document.getElementById('ds-mse').value),
                    ese: parseFloat(document.getElementById('ds-ese').value)
                },
                {
                    subjectCode: 'CS202',
                    subjectName: 'Database Management Systems',
                    credits: 4,
                    mse: parseFloat(document.getElementById('dbms-mse').value),
                    ese: parseFloat(document.getElementById('dbms-ese').value)
                },
                {
                    subjectCode: 'CS203',
                    subjectName: 'Operating Systems',
                    credits: 4,
                    mse: parseFloat(document.getElementById('os-mse').value),
                    ese: parseFloat(document.getElementById('os-ese').value)
                },
                {
                    subjectCode: 'CS204',
                    subjectName: 'Theory of Computation',
                    credits: 4,
                    mse: parseFloat(document.getElementById('toc-mse').value),
                    ese: parseFloat(document.getElementById('toc-ese').value)
                }
            ]
        };

        const submitBtn = document.getElementById('btn-save-result');
        const origBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Calculating & Saving...`;

        try {
            let response;
            if (editId) {
                // PUT Update
                response = await fetch(`${API_BASE_URL}/results/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // POST Create
                response = await fetch(`${API_BASE_URL}/results`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                const errMsg = data.message || (data.details ? data.details.join(', ') : 'Failed to save result');
                throw new Error(errMsg);
            }

            showToast(editId ? 'Student result updated successfully!' : 'Semester result calculated & saved successfully!', 'success');
            
            // Reset form state
            resetForm();

            // Display official Marksheet
            renderMarksheet(data);
            switchView('result-view');

        } catch (error) {
            console.error('Error saving result:', error);
            showToast(error.message, 'danger');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnText;
        }
    });

    resetBtn.addEventListener('click', () => {
        resetForm();
        showToast('Form reset.', 'success');
    });
}

function resetForm() {
    const form = document.getElementById('result-form');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('edit-student-id').value = '';
    document.getElementById('form-header-title').textContent = 'Prepare Student Semester Result';
}

/* -------------------------------------------------------------
 * 6. Marksheet Rendering View
 * ------------------------------------------------------------- */
async function viewResultByPrn(prn) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${encodeURIComponent(prn)}`);
        if (!response.ok) throw new Error(`Could not find student with PRN: ${prn}`);

        const resultData = await response.json();
        renderMarksheet(resultData);
        switchView('result-view');
    } catch (error) {
        console.error('Error viewing result:', error);
        showToast(error.message, 'danger');
    }
}

function renderMarksheet(student) {
    currentStudentResult = student;

    document.getElementById('sheet-prn').textContent = student.prn;
    document.getElementById('sheet-name').textContent = student.name;
    document.getElementById('sheet-branch').textContent = student.branch;
    document.getElementById('sheet-semester').textContent = `Semester ${student.semester}`;
    document.getElementById('sheet-total-marks').textContent = `${student.totalMarks.toFixed(2)} / 400`;
    document.getElementById('sheet-sgpa').textContent = student.sgpa.toFixed(2);
    document.getElementById('sheet-date').textContent = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const statusBadge = document.getElementById('sheet-status-badge');
    if (student.resultStatus === 'PASS') {
        statusBadge.className = 'badge-pass';
        statusBadge.innerHTML = `<i class="bi bi-check-circle-fill"></i> PASS`;
    } else {
        statusBadge.className = 'badge-fail';
        statusBadge.innerHTML = `<i class="bi bi-x-circle-fill"></i> FAIL`;
    }

    // Render Table Rows
    const tbody = document.getElementById('sheet-table-body');
    tbody.innerHTML = student.subjectResults.map(sr => `
        <tr>
            <td class="fw-bold">${escapeHtml(sr.subjectCode)}</td>
            <td class="text-start">${escapeHtml(sr.subjectName)}</td>
            <td>${sr.credits}</td>
            <td>${sr.mse.toFixed(1)}</td>
            <td>${sr.ese.toFixed(1)}</td>
            <td class="fw-bold">${sr.finalMarks.toFixed(1)}</td>
            <td><span class="badge grade-badge grade-${sr.grade.replace('+', '-plus')}">${sr.grade}</span></td>
            <td class="fw-bold">${sr.gradePoint}</td>
        </tr>
    `).join('');
}

/* -------------------------------------------------------------
 * 7. Edit & Delete Actions
 * ------------------------------------------------------------- */
async function editStudentResult(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/id/${id}`);
        if (!response.ok) throw new Error('Could not fetch student details for editing.');

        const student = await response.json();

        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('prn-input').value = student.prn;
        document.getElementById('name-input').value = student.name;
        document.getElementById('branch-select').value = student.branch;
        document.getElementById('semester-select').value = student.semester;

        // Pre-fill subject marks
        student.subjectResults.forEach(sr => {
            const name = sr.subjectName.toLowerCase();
            if (name.includes('data structure')) {
                document.getElementById('ds-mse').value = sr.mse;
                document.getElementById('ds-ese').value = sr.ese;
            } else if (name.includes('database')) {
                document.getElementById('dbms-mse').value = sr.mse;
                document.getElementById('dbms-ese').value = sr.ese;
            } else if (name.includes('operating')) {
                document.getElementById('os-mse').value = sr.mse;
                document.getElementById('os-ese').value = sr.ese;
            } else if (name.includes('theory')) {
                document.getElementById('toc-mse').value = sr.mse;
                document.getElementById('toc-ese').value = sr.ese;
            }
        });

        document.getElementById('form-header-title').textContent = `Edit Result for PRN: ${student.prn}`;
        switchView('prepare-view');
        showToast(`Editing records for PRN: ${student.prn}`, 'success');

    } catch (error) {
        console.error('Error editing result:', error);
        showToast(error.message, 'danger');
    }
}

async function confirmDeleteStudent(id, prn) {
    if (confirm(`Are you sure you want to delete result record for PRN: ${prn}? This action cannot be undone.`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/students/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok && response.status !== 204) {
                throw new Error('Failed to delete student record.');
            }

            showToast(`Deleted student record PRN: ${prn}`, 'success');
            loadAllStudents();
            loadDashboardStats();
            loadRecentStudents();

        } catch (error) {
            console.error('Error deleting student:', error);
            showToast(error.message, 'danger');
        }
    }
}

/* -------------------------------------------------------------
 * 8. Search Result Functionality
 * ------------------------------------------------------------- */
function initSearch() {
    const searchBtn = document.getElementById('btn-search-trigger');
    const searchInput = document.getElementById('search-input');

    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) {
            showToast('Please enter a PRN or Student Name to search.', 'danger');
            return;
        }

        const tbody = document.getElementById('search-results-tbody');
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-muted"><div class="spinner-border spinner-border-sm me-2 text-primary" role="status"></div> Searching...</td></tr>`;

        try {
            const response = await fetch(`${API_BASE_URL}/students/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search failed.');

            const results = await response.json();
            if (results.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No student found matching query "${escapeHtml(query)}"</td></tr>`;
                return;
            }

            tbody.innerHTML = results.map(s => `
                <tr>
                    <td class="fw-bold">${escapeHtml(s.prn)}</td>
                    <td>${escapeHtml(s.name)}</td>
                    <td>${escapeHtml(s.branch)}</td>
                    <td>Sem ${s.semester}</td>
                    <td class="fw-bold text-primary">${s.sgpa.toFixed(2)}</td>
                    <td>${getStatusBadge(s.resultStatus)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewResultByPrn('${escapeHtml(s.prn)}')">
                            <i class="bi bi-file-earmark-text"></i> View Grade Sheet
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error executing search:', error);
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-3">Error searching records.</td></tr>`;
        }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

/* -------------------------------------------------------------
 * 9. Helper Formatters
 * ------------------------------------------------------------- */
function getStatusBadge(status) {
    if (status === 'PASS') {
        return `<span class="badge-pass"><i class="bi bi-check-circle-fill"></i> PASS</span>`;
    }
    return `<span class="badge-fail"><i class="bi bi-x-circle-fill"></i> FAIL</span>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}
