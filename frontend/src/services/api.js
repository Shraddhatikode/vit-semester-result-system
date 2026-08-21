const API_BASE_URL = 'http://localhost:8080/api';

export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
};

export const fetchAllStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students`);
  if (!response.ok) {
    throw new Error('Failed to fetch student list');
  }
  return response.json();
};

export const fetchStudentByPrn = async (prn) => {
  const response = await fetch(`${API_BASE_URL}/students/${encodeURIComponent(prn)}`);
  if (!response.ok) {
    throw new Error(`Could not find student with PRN: ${prn}`);
  }
  return response.json();
};

export const fetchStudentById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/students/id/${id}`);
  if (!response.ok) {
    throw new Error('Could not fetch student details for editing.');
  }
  return response.json();
};

export const searchStudents = async (query) => {
  const response = await fetch(`${API_BASE_URL}/students/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Search failed.');
  }
  return response.json();
};

export const saveStudentResult = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    const errMsg = data.message || (data.details ? data.details.join(', ') : 'Failed to save result');
    throw new Error(errMsg);
  }
  return data;
};

export const updateStudentResult = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/results/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    const errMsg = data.message || (data.details ? data.details.join(', ') : 'Failed to update result');
    throw new Error(errMsg);
  }
  return data;
};

export const deleteStudentResult = async (id) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete student record.');
  }
  return true;
};
